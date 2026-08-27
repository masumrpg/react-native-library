import { describe, it, expect } from "bun:test";
import { parseMarkdownDocument } from "../src/core/parser.js";
import { buildPdfDocument, injectPagedMediaStyles } from "../src/core/pdf/pdfBuilder.js";

describe("pdfBuilder", () => {
  it("injects @page CSS styles into HTML", () => {
    const rawHtml = `<html><head><title>Test</title></head><body><p>Hello</p></body></html>`;
    const paged = injectPagedMediaStyles(rawHtml, {
      orientation: "landscape",
      paperSize: "A4",
      margins: { top: "3cm" },
    });

    expect(paged).toContain("@page");
    expect(paged).toContain("size: A4 landscape");
    expect(paged).toContain("margin-top: 3cm");
    expect(paged).toContain("@bottom-right");
  });

  it("builds a real binary PDF buffer", async () => {
    const doc = parseMarkdownDocument("# PDF Spec\nThis is a PDF test document.");
    const buffer = await buildPdfDocument(doc, { orientation: "portrait" });

    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(100);
    expect(buffer.subarray(0, 5).toString("utf-8")).toBe("%PDF-");
  });
});
