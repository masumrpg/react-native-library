import { describe, it, expect } from "bun:test";
import JSZip from "jszip";
import { PDFDocument, PDFName, PDFString } from "pdf-lib";
import { parseMarkdownDocument } from "../src/core/parser.js";
import { buildDocxDocument } from "../src/core/docx/docxBuilder.js";
import { buildHtmlDocument } from "../src/core/html/htmlBuilder.js";
import { extractPdfOutlinesMap, injectTocPageNumbers, buildPdfDocument } from "../src/core/pdf/pdfBuilder.js";
import { THEME_COMPONENTS } from "../src/core/html/htmlThemes.js";

describe("Table of Contents (TOC) > Native Word DOCX", () => {
  it("generates a native Word TOC (<w:sdt> with TOC instruction, dot leaders, and updateFields)", async () => {
    const md = `---
title: "Project Specification"
toc: true
---

# 1. Introduction
This is the introduction.

## 1.1 Architecture
Architecture description.

### 1.1.1 Data Flow
Data flow details.

# 2. Deployment
Deployment guide.
`;

    const doc = parseMarkdownDocument(md);
    const buffer = await buildDocxDocument(doc, { toc: true });

    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(1000);

    // Unpack Word DOCX (ZIP) archive
    const zip = await JSZip.loadAsync(buffer);
    const documentXml = await zip.file("word/document.xml")?.async("string");
    const settingsXml = await zip.file("word/settings.xml")?.async("string");

    expect(documentXml).toBeDefined();
    // Verify native Word Structured Document Tag (<w:sdt>)
    expect(documentXml).toContain("<w:sdt>");
    expect(documentXml).toContain("Table of Contents");
    // Verify native Word TOC instruction field with levels 1-3
    expect(documentXml).toContain("TOC");
    expect(documentXml).toContain('\\o &quot;1-3&quot;');
    // Verify native tab stops with dot leader attribute (w:leader="dot")
    expect(documentXml).toContain('w:leader="dot"');
    // Verify headings are cached inside the TOC
    expect(documentXml).toContain("1. Introduction");
    expect(documentXml).toContain("1.1 Architecture");
    expect(documentXml).toContain("2. Deployment");

    // Verify settings.xml has updateFields enabled for automatic TOC page computation on open
    expect(settingsXml).toBeDefined();
    expect(settingsXml).toContain("w:updateFields");
  });
});

describe("Table of Contents (TOC) > HTML & CSS Formatting", () => {
  it("renders semantically structured TOC elements with .toc-dots and .toc-page containers", async () => {
    const md = `---
title: "User Guide"
toc: true
---

# Getting Started
Overview.

## Installation
How to install.
`;

    const doc = parseMarkdownDocument(md);
    const html = await buildHtmlDocument(doc, { toc: true });

    expect(html).toContain('class="table-of-contents"');
    expect(html).toContain('class="toc-header"');
    expect(html).toContain('class="toc-list"');
    expect(html).toContain('class="toc-item toc-level-1"');
    expect(html).toContain('class="toc-item toc-level-2"');
    expect(html).toContain('class="toc-title"');
    expect(html).toContain('class="toc-dots"');
    expect(html).toContain('class="toc-page"');
    expect(html).toContain('data-page-for="getting-started"');
    expect(html).toContain('data-page-for="installation"');

    // Verify Shared Theme CSS defines flex layout and dotted leaders
    expect(THEME_COMPONENTS).toContain(".toc-dots");
    expect(THEME_COMPONENTS).toContain("dotted");
    expect(THEME_COMPONENTS).toContain(".toc-page");
    expect(THEME_COMPONENTS).toContain("tabular-nums");
  });
});

describe("Table of Contents (TOC) > Page Number Injection & Outline Map", () => {
  it("injects target page numbers into TOC HTML spans based on outline mapping", () => {
    const rawHtml = `
    <nav class="table-of-contents">
      <ul class="toc-list">
        <li class="toc-item toc-level-1"><a class="toc-link" href="#intro"><span class="toc-title">Introduction</span><span class="toc-dots"></span><span class="toc-page" data-page-for="intro"></span></a></li>
        <li class="toc-item toc-level-2"><a class="toc-link" href="#setup"><span class="toc-title">Setup</span><span class="toc-dots"></span><span class="toc-page" data-page-for="setup"></span></a></li>
      </ul>
    </nav>
    `;

    const pageMap = new Map<string, number>([
      ["Introduction", 2],
      ["Setup", 4],
    ]);

    const tocEntries = [
      { id: "intro", text: "Introduction", level: 1 },
      { id: "setup", text: "Setup", level: 2 },
    ];

    const injected = injectTocPageNumbers(rawHtml, pageMap, tocEntries);
    expect(injected).toContain('data-page-for="intro">2</span>');
    expect(injected).toContain('data-page-for="setup">4</span>');
  });

  it("extracts page numbers correctly from a PDFDocument outline structure", async () => {
    const pdfDoc = await PDFDocument.create();
    const page1 = pdfDoc.addPage([600, 400]);
    const page2 = pdfDoc.addPage([600, 400]);

    // Build synthetic outlines dictionary in PDF catalog
    const context = pdfDoc.context;
    const item1Ref = context.nextRef();
    const item2Ref = context.nextRef();
    const outlinesRef = context.nextRef();

    const item1Dict = context.obj({
      Title: PDFString.of("Executive Summary"),
      Dest: [page1.ref, PDFName.of("XYZ"), 0, 400, 0],
      Next: item2Ref,
    });
    context.assign(item1Ref, item1Dict);

    const item2Dict = context.obj({
      Title: PDFString.of("Technical Architecture"),
      Dest: [page2.ref, PDFName.of("XYZ"), 0, 400, 0],
    });
    context.assign(item2Ref, item2Dict);

    const outlinesDict = context.obj({
      Type: PDFName.of("Outlines"),
      First: item1Ref,
      Last: item2Ref,
      Count: 2,
    });
    context.assign(outlinesRef, outlinesDict);

    pdfDoc.catalog.set(PDFName.of("Outlines"), outlinesRef);

    const map = extractPdfOutlinesMap(pdfDoc);
    expect(map.get("Executive Summary")).toBe(1);
    expect(map.get("Technical Architecture")).toBe(2);
  });

  it("builds a multi-page PDF document with Table of Contents target page numbers resolved", async () => {
    const md = `---
title: "Verification Document"
toc: true
---

# 1. Introduction
Page 1 content.

<div class="pagebreak"></div>

# 2. Methods
Page 2 content.
`;

    const doc = parseMarkdownDocument(md);
    const pdfBuf = await buildPdfDocument(doc, { toc: true });

    expect(pdfBuf).toBeInstanceOf(Buffer);
    expect(pdfBuf.length).toBeGreaterThan(2000);

    const loadedDoc = await PDFDocument.load(pdfBuf);
    expect(loadedDoc.getPageCount()).toBeGreaterThanOrEqual(3);
  });
});
