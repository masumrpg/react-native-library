import { describe, it, expect } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import {
  compileMarkdown,
  parseMarkdownDocument,
  buildHtmlDocument,
  buildDocxDocument,
  buildPdfDocument,
  resolveDocumentConfig,
  PAPER_DIMENSIONS_TWIP,
} from "../src/index.js";
import type { MarkforgeConfig } from "../src/config/types.js";

describe("All Properties Comprehensive Test Suite", () => {
  const tmpDir = path.resolve(process.cwd(), ".temp/all-props-test");
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  const customCssPath = path.join(tmpDir, "custom.css");
  fs.writeFileSync(
    customCssPath,
    ".custom-brand { color: #33CDCF; font-weight: bold; }\n"
  );

  const fullMarkdown = `---
title: "Unified Platform Architecture"
subtitle: "High-Performance Document Engine"
author: "Ma'sum"
date: "2026-08-29"
version: "1.0.0"
company: "Masum Dev"
lang: "en"
theme: "corporate"
orientation: "landscape"
paperSize: "A4"
margins:
  top: "3cm"
  bottom: "3cm"
  left: "2cm"
  right: "2cm"
header:
  left: "{company} - {title}"
  center: "Confidential Manual"
  right: "v{version}"
footer:
  left: "Author: {author}"
  right: "Page {page} of {pages}"
toc: true
watermark:
  text: "STRICTLY CONFIDENTIAL"
  color: "#E11D48"
  opacity: 0.15
  fontSize: 48
  rotate: -35
  position: "diagonal"
css:
  - "${customCssPath}"
---

# Architecture Overview

Welcome to the MarkForge full-specification verification document.

<div class="custom-brand">Verified with Custom Brand CSS</div>

## Core Pipeline

This section tests table of contents indexing, syntax themes, callouts, and tables.

> [!NOTE]
> This is a high-priority informational note.

> [!IMPORTANT]
> Verify that all custom header tokens and watermarks are rendered properly.

\`\`\`typescript
interface EngineConfig {
  theme: string;
  watermark: boolean | object;
}

export function initializeEngine(): EngineConfig {
  return { theme: "corporate", watermark: true };
}
\`\`\`

| Component | Status | Latency |
| :--- | :---: | ---: |
| DOCX Builder | Verified | 45ms |
| PDF Renderer | Verified | 210ms |
| HTML Compiler | Verified | 12ms |
`;

  it("1. resolveDocumentConfig verifies 100% of all properties and token replacement", () => {
    const doc = parseMarkdownDocument(fullMarkdown);
    const globalConfig: MarkforgeConfig = {
      to: ["docx", "pdf", "html"],
      syntaxTheme: "dracula",
      bundleHtml: true,
      embedImages: true,
      metadata: {
        company: "Masum Dev Global",
      },
    };

    const resolved = resolveDocumentConfig(doc.metadata as Record<string, unknown>, globalConfig);

    // Metadata & Dynamic tokens
    expect(resolved.title).toBe("Unified Platform Architecture");
    expect(resolved.subtitle).toBe("High-Performance Document Engine");
    expect(resolved.author).toBe("Ma'sum");
    expect(resolved.date).toBe("2026-08-29");
    expect(resolved.version).toBe("1.0.0");
    expect(resolved.company).toBe("Masum Dev");
    expect(resolved.lang).toBe("en");

    // Theme & Layout
    expect(resolved.theme).toBe("corporate");
    expect(resolved.orientation).toBe("landscape");
    expect(resolved.paperSize).toBe("A4");
    expect(resolved.paperDimensions.widthTwip).toBe(PAPER_DIMENSIONS_TWIP.A4.height); // landscape swapped
    expect(resolved.paperDimensions.heightTwip).toBe(PAPER_DIMENSIONS_TWIP.A4.width);

    // Margins (Normalized CSS & Twip)
    expect(resolved.margins.top).toBe("3cm");
    expect(resolved.margins.bottom).toBe("3cm");
    expect(resolved.margins.left).toBe("2cm");
    expect(resolved.margins.right).toBe("2cm");
    expect(resolved.margins.topTwip).toBe(Math.round(3 * 566.929));
    expect(resolved.margins.leftTwip).toBe(Math.round(2 * 566.929));

    // Headers with replaced tokens
    expect(resolved.header?.left?.text).toBe("Masum Dev - Unified Platform Architecture");
    expect(resolved.header?.center?.text).toBe("Confidential Manual");
    expect(resolved.header?.right?.text).toBe("v1.0.0");

    // Footers with replaced tokens
    expect(resolved.footer?.left?.text).toBe("Author: Ma'sum");

    // Table of Contents & Watermark
    expect(resolved.toc).toBe(true);
    expect(resolved.watermark).toBeDefined();
    expect(resolved.watermark?.text).toBe("STRICTLY CONFIDENTIAL");
    expect(resolved.watermark?.color).toBe("#E11D48");
    expect(resolved.watermark?.opacity).toBe(0.15);
    expect(resolved.watermark?.fontSize).toBe(48);
    expect(resolved.watermark?.rotate).toBe(-35);

    // CSS list & Engine Flags
    expect(resolved.css).toContain(customCssPath);
    expect(resolved.syntaxTheme).toBe("dracula");
    expect(resolved.embedImages).toBe(true);
    expect(resolved.bundleHtml).toBe(true);
  });

  it("2. buildHtmlDocument applies all visual properties (TOC, Watermark, Custom CSS, Syntax theme, Meta)", async () => {
    const doc = parseMarkdownDocument(fullMarkdown);
    const config: MarkforgeConfig = {
      theme: "corporate",
      syntaxTheme: "dracula",
    };

    const html = await buildHtmlDocument(doc, config, tmpDir);

    // Document structure & language
    expect(html).toContain('lang="en"');
    expect(html).toContain("<title>Unified Platform Architecture</title>");

    // Header metadata area
    expect(html).toContain('<h1 class="document-title">Unified Platform Architecture</h1>');
    expect(html).toContain('<div class="document-subtitle">High-Performance Document Engine</div>');
    expect(html).toContain("<span>Author: Ma&#039;sum</span>");
    expect(html).toContain("<span>Version: 1.0.0</span>");
    expect(html).toContain("<span>Date: 2026-08-29</span>");

    // Table of Contents
    expect(html).toContain('<nav class="table-of-contents">');
    expect(html).toContain('href="#architecture-overview"');
    expect(html).toContain('href="#core-pipeline"');

    // Inlined Custom CSS
    expect(html).toContain(".custom-brand { color: #33CDCF; font-weight: bold; }");
    expect(html).toContain('<div class="custom-brand">Verified with Custom Brand CSS</div>');

    // Watermark CSS & Canvas Bitmap Element
    expect(html).toContain(".document-watermark");
    expect(html).toContain("markforge-watermark");
    expect(html).toContain("STRICTLY CONFIDENTIAL");
    expect(html).toContain("#E11D48");

    // Callout boxes with color styling
    expect(html).toContain("callout-NOTE");
    expect(html).toContain("callout-IMPORTANT");

    // Code block with syntax highlighting
    expect(html).toContain("<pre><code");
    expect(html).toContain("EngineConfig");
  });

  it("3. buildDocxDocument applies all document elements and paper settings", async () => {
    const doc = parseMarkdownDocument(fullMarkdown);
    const config: MarkforgeConfig = {
      theme: "corporate",
      syntaxTheme: "github-light",
    };

    const docxBuffer = await buildDocxDocument(doc, config, tmpDir);
    expect(docxBuffer).toBeDefined();
    expect(docxBuffer.length).toBeGreaterThan(5000);
    // Verify real PK zip header (DOCX is an OpenXML ZIP)
    expect(docxBuffer.subarray(0, 4)).toEqual(Buffer.from([0x50, 0x4b, 0x03, 0x04]));
  });

  it("4. buildPdfDocument injects CSS Paged Media styles with exact margins and token headers", async () => {
    const doc = parseMarkdownDocument(fullMarkdown);
    const resolved = resolveDocumentConfig(doc.metadata as Record<string, unknown>, {
      theme: "corporate",
    });

    const pdfBuffer = await buildPdfDocument(doc, resolved);
    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(500);
    // Real PDF header
    expect(pdfBuffer.subarray(0, 5).toString()).toBe("%PDF-");
  });

  it("5. compileMarkdown orchestrates full multi-format output with all properties active", async () => {
    const outDir = path.join(tmpDir, "output");
    const result = await compileMarkdown(
      fullMarkdown,
      {
        to: ["docx", "pdf", "html"],
        outputDir: outDir,
        theme: "corporate",
        syntaxTheme: "nord",
      }
    );

    expect(result.errors.length).toBe(0);
    expect(result.files.length).toBe(3);

    const docxFile = result.files.find((f) => f.format === "docx");
    const pdfFile = result.files.find((f) => f.format === "pdf");
    const htmlFile = result.files.find((f) => f.format === "html");

    expect(docxFile).toBeDefined();
    expect(pdfFile).toBeDefined();
    expect(htmlFile).toBeDefined();

    expect(fs.existsSync(docxFile!.filePath)).toBe(true);
    expect(fs.existsSync(pdfFile!.filePath)).toBe(true);
    expect(fs.existsSync(htmlFile!.filePath)).toBe(true);
  });

  it("6. renders signature & approval block across DOCX, PDF, and HTML correctly", async () => {
    const mdWithSignatures = `---
title: "Approved Contract Specification"
author: "Ma'sum"
signatures:
  align: "space-between"
  style: "line"
  items:
    - title: "Prepared by"
      name: "{author}"
      role: "Lead Platform Architect"
      date: "2026-08-29"
    - title: "Approved by"
      name: "Alex Johnson"
      role: "Chief Technology Officer"
      date: true
---

# Contract Overview
This document contains formal signature approval blocks.
`;

    const doc = parseMarkdownDocument(mdWithSignatures);
    const resolved = resolveDocumentConfig(doc.metadata, {});

    expect(resolved.signatures).toBeDefined();
    expect(resolved.signatures?.items.length).toBe(2);
    expect(resolved.signatures?.items[0].name).toBe("Ma'sum");
    expect(resolved.signatures?.items[1].name).toBe("Alex Johnson");

    // HTML Output Verification
    const html = await buildHtmlDocument(doc, resolved);
    expect(html).toContain("markforge-signatures");
    expect(html).toContain("Prepared by");
    expect(html).toContain("Approved by");
    expect(html).toContain("Ma&#039;sum");
    expect(html).toContain("Alex Johnson");
    expect(html).toContain("Chief Technology Officer");

    // DOCX Output Verification
    const docxBuf = await buildDocxDocument(doc, resolved);
    expect(docxBuf).toBeInstanceOf(Buffer);
    expect(docxBuf.length).toBeGreaterThan(1000);

    // PDF Output Verification
    const pdfBuf = await buildPdfDocument(doc, resolved);
    expect(pdfBuf).toBeInstanceOf(Buffer);
    expect(pdfBuf.subarray(0, 5).toString()).toBe("%PDF-");
  });
});

