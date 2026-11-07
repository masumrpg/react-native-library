import { describe, it, expect } from "bun:test";
import { injectPagedMediaStyles } from "../src/core/pdf/pdfBuilder.js";
import { buildHtmlDocument } from "../src/core/html/htmlBuilder.js";
import { buildDocxDocument } from "../src/core/docx/docxBuilder.js";
import { parseMarkdownDocument } from "../src/core/parser.js";

describe("Feature Activation: Dividers, Proofing, Watermarks, and Colors", () => {
  it("injects border-bottom on header and border-top on footer in PDF paged media styles", () => {
    const css = injectPagedMediaStyles("<html><body>test</body></html>", {
      header: {
        center: "Document Title",
        divider: true,
        dividerColor: "#009DA0",
      },
      footer: {
        right: "Page {page}",
        divider: true,
        dividerColor: "#E2E8F0",
      },
    });

    expect(css).toContain("border-bottom: 1px solid #009DA0");
    expect(css).toContain("border-top: 1px solid #E2E8F0");
  });

  it("applies watermark positions in HTML generator script", async () => {
    const doc = parseMarkdownDocument("# Test Doc");
    const htmlCenter = await buildHtmlDocument(doc, {
      watermark: {
        text: "DRAFT",
        position: "center",
      },
    });
    expect(htmlCenter).toContain("var position = 'center'");

    const htmlTopRight = await buildHtmlDocument(doc, {
      watermark: {
        text: "CONFIDENTIAL",
        position: "top-right",
      },
    });
    expect(htmlTopRight).toContain("var position = 'top-right'");
  });

  it("applies custom titleColor, subtitleColor, and accentColor on cover page in HTML", async () => {
    const doc = parseMarkdownDocument(`---
title: My Title
subtitle: My Subtitle
coverPage:
  enabled: true
  preset: modern
  titleColor: "#E11D48"
  subtitleColor: "#475569"
  accentColor: "#F59E0B"
---
# Document Content`);

    const html = await buildHtmlDocument(doc);
    expect(html).toContain('style="color: #E11D48;"');
    expect(html).toContain('style="color: #475569;"');
    expect(html).toContain("border-top: 8px solid #F59E0B");
  });

  it("generates a valid binary DOCX buffer with watermark and language proofing configured", async () => {
    const doc = parseMarkdownDocument(`---
title: Word Document Proofing
lang: id-ID
watermark: "RAHASIA"
---
# Bab 1: Pendahuluan
Dokumen ini menggunakan bahasa Indonesia dan watermark rahasia.`);

    const docxBuffer = await buildDocxDocument(doc, {
      lang: "id-ID",
      watermark: {
        text: "RAHASIA",
        position: "diagonal",
      },
    });

    expect(docxBuffer).toBeDefined();
    expect(docxBuffer.length).toBeGreaterThan(5000);
    // Standard OpenXML ZIP signature 50 4B 03 04 (PK..)
    expect(docxBuffer.subarray(0, 4).toString("hex")).toBe("504b0304");
  });
});
