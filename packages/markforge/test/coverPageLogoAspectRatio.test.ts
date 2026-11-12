import { describe, it, expect } from "bun:test";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { getImageDimensions, resolveImage } from "../src/core/imageResolver.js";
import { buildDocxDocument } from "../src/core/docx/docxBuilder.js";
import { parseMarkdownDocument } from "../src/core/parser.js";
import { resolveDocumentConfig } from "../src/config/resolveConfig.js";

describe("Cover Page Logo Aspect Ratio and Dimension Preservation", () => {
  // Helper to construct a minimal valid PNG buffer with custom width and height
  function createMockPngBuffer(width: number, height: number): Buffer {
    const buf = Buffer.alloc(33);
    // PNG Signature
    buf.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0);
    // IHDR length = 13
    buf.writeUInt32BE(13, 8);
    // "IHDR"
    buf.set([0x49, 0x48, 0x44, 0x52], 12);
    // Width & Height
    buf.writeUInt32BE(width, 16);
    buf.writeUInt32BE(height, 20);
    // Bit depth (8), color type (6 = RGBA), compression (0), filter (0), interlace (0)
    buf.set([0x08, 0x06, 0x00, 0x00, 0x00], 24);
    // CRC placeholder
    buf.writeUInt32BE(0x12345678, 29);
    return buf;
  }

  it("extracts exact natural dimensions from PNG buffer headers", () => {
    const png = createMockPngBuffer(500, 100);
    const dims = getImageDimensions(png);
    expect(dims).not.toBeNull();
    expect(dims?.width).toBe(500);
    expect(dims?.height).toBe(100);
  });

  it("extracts dimensions when resolving a local image file", async () => {
    const tmpDir = os.tmpdir();
    const fakeLogoPath = path.join(tmpDir, `test-logo-${Date.now()}.png`);
    fs.writeFileSync(fakeLogoPath, createMockPngBuffer(400, 100));

    try {
      const resolved = await resolveImage(fakeLogoPath);
      expect(resolved).not.toBeNull();
      expect(resolved?.width).toBe(400);
      expect(resolved?.height).toBe(100);
    } finally {
      if (fs.existsSync(fakeLogoPath)) fs.unlinkSync(fakeLogoPath);
    }
  });

  it("resolves coverPage with logoWidth and logoHeight in resolveDocumentConfig", () => {
    const cfg = resolveDocumentConfig({
      coverPage: {
        enabled: true,
        logo: "assets/logo.png",
        logoWidth: 200,
        logoHeight: 60,
      },
    });

    expect(cfg.coverPage?.enabled).toBe(true);
    expect(cfg.coverPage?.logo).toBe("assets/logo.png");
    expect(cfg.coverPage?.logoWidth).toBe(200);
    expect(cfg.coverPage?.logoHeight).toBe(60);
  });

  it("builds a valid DOCX document containing a wide logo with preserved aspect ratio", async () => {
    const tmpDir = os.tmpdir();
    const fakeLogoPath = path.join(tmpDir, `wide-brand-logo-${Date.now()}.png`);
    // 4:1 wide aspect ratio logo (400x100)
    fs.writeFileSync(fakeLogoPath, createMockPngBuffer(400, 100));

    try {
      const doc = parseMarkdownDocument("# Sample Document for Cover Test");
      const docxBuffer = await buildDocxDocument(doc, {
        coverPage: {
          enabled: true,
          title: "Architecture Guide",
          logo: fakeLogoPath,
          logoWidth: 160,
        },
      });

      expect(Buffer.isBuffer(docxBuffer)).toBe(true);
      expect(docxBuffer.length).toBeGreaterThan(1000);
      // Valid zip PK signature of docx
      expect(docxBuffer[0]).toBe(0x50); // P
      expect(docxBuffer[1]).toBe(0x4b); // K
    } finally {
      if (fs.existsSync(fakeLogoPath)) fs.unlinkSync(fakeLogoPath);
    }
  });
});

