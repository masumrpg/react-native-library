import { describe, it, expect } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import { resolveImage, getMimeType, inlineHtmlImages } from "../src/core/imageResolver.js";

describe("imageResolver", () => {
  it("detects correct MIME types", () => {
    expect(getMimeType("test.png")).toBe("image/png");
    expect(getMimeType("photo.jpg")).toBe("image/jpeg");
    expect(getMimeType("vector.svg")).toBe("image/svg+xml");
    expect(getMimeType("anim.gif")).toBe("image/gif");
  });

  it("resolves base64 data URIs directly into buffers", async () => {
    const dataUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const resolved = await resolveImage(dataUri);

    expect(resolved).not.toBeNull();
    expect(resolved?.mimeType).toBe("image/png");
    expect(resolved?.buffer).toBeInstanceOf(Buffer);
    expect(resolved?.dataUri).toBe(dataUri);
  });

  it("resolves local existing files", async () => {
    const tmpDir = path.resolve(process.cwd(), ".temp/markforge-test");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const tmpFile = path.join(tmpDir, "test.png");
    fs.writeFileSync(tmpFile, Buffer.from("dummy-image-data"));

    const resolved = await resolveImage("./test.png", tmpDir);
    expect(resolved).not.toBeNull();
    expect(resolved?.mimeType).toBe("image/png");
    expect(resolved?.dataUri.startsWith("data:image/png;base64,")).toBe(true);

    // cleanup
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("inlines image tags in HTML with Base64 data URIs", async () => {
    const tmpDir = path.resolve(process.cwd(), ".temp/markforge-test-html");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const tmpFile = path.join(tmpDir, "icon.png");
    fs.writeFileSync(tmpFile, Buffer.from("icon-bytes"));

    const html = `<p>Test <img src="./icon.png" alt="icon" /> text</p>`;
    const inlined = await inlineHtmlImages(html, tmpDir);

    expect(inlined.includes("data:image/png;base64,")).toBe(true);

    // cleanup
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});
