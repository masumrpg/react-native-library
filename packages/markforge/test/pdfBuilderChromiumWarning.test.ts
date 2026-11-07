import { describe, it, expect, spyOn } from "bun:test";
import { buildPdfDocument, createFallbackPdfBuffer, findChromeExecutable } from "../src/core/pdf/pdfBuilder.js";
import { DEFAULT_CONFIG } from "../src/config/loadConfig.js";
import { parseMarkdownDocument } from "../src/core/parser.js";

describe("pdfBuilder Chromium error handling and fallback", () => {
  it("creates a valid minimal fallback PDF buffer starting with %PDF-1.4", () => {
    const buffer = createFallbackPdfBuffer("Test Document");
    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.toString("utf-8", 0, 8)).toBe("%PDF-1.4");
    expect(buffer.toString("utf-8")).toContain("Test Document");
  });

  it("emits an explicit warning when Chromium executable is missing", async () => {
    const doc = parseMarkdownDocument("# Sample Warning Test");

    const chromePath = findChromeExecutable();
    if (!chromePath) {
      // In headless environment where Chrome is absent
      const warnSpy = spyOn(console, "warn");
      const pdfBuffer = await buildPdfDocument(doc, DEFAULT_CONFIG);

      expect(warnSpy).toHaveBeenCalled();
      const warningMessage = warnSpy.mock.calls.flat().join(" ");
      expect(warningMessage).toContain("Headless Chrome / Chromium / Edge executable not found for PDF document export");
      expect(warningMessage).toContain("CHROME_PATH");

      expect(Buffer.isBuffer(pdfBuffer)).toBe(true);
      expect(pdfBuffer.toString("utf-8", 0, 8)).toBe("%PDF-1.4");
      warnSpy.mockRestore();
    }
  });
});

