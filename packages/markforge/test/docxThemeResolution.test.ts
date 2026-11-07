import { describe, it, expect } from "bun:test";
import { buildDocxDocument } from "../src/core/docx/docxBuilder.js";
import { Theme } from "../src/config/types.js";
import { parseMarkdownDocument } from "../src/core/parser.js";

describe("docxBuilder theme preset synchronization", () => {
  it("builds DOCX document applying preset theme without falling back to hardcoded cyan", async () => {
    const sampleDoc = parseMarkdownDocument("# Sample Heading\n\nSample text content.");
    const academicBuffer = await buildDocxDocument(sampleDoc, { theme: "academic" });
    expect(Buffer.isBuffer(academicBuffer)).toBe(true);
    expect(academicBuffer.length).toBeGreaterThan(1000);

    const githubBuffer = await buildDocxDocument(sampleDoc, { theme: Theme.GITHUB });
    expect(Buffer.isBuffer(githubBuffer)).toBe(true);
    expect(githubBuffer.length).toBeGreaterThan(1000);

    const minimalBuffer = await buildDocxDocument(sampleDoc, { theme: Theme.MINIMAL });
    expect(Buffer.isBuffer(minimalBuffer)).toBe(true);
    expect(minimalBuffer.length).toBeGreaterThan(1000);
  });

  it("builds DOCX document with mustache page counter in footer", async () => {
    const docWithMustache = parseMarkdownDocument("# Mustache Page\n\nDocument body.");
    const docxBuffer = await buildDocxDocument(docWithMustache, {
      footer: {
        right: "Page {{page}} of {{pages}}",
      },
    });
    expect(Buffer.isBuffer(docxBuffer)).toBe(true);
    expect(docxBuffer.length).toBeGreaterThan(1000);
  });
});

