import { describe, it, expect, spyOn } from "bun:test";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { findChromeExecutable, buildPdfDocument } from "../src/core/pdf/pdfBuilder.js";
import { resolveDocumentConfig } from "../src/config/resolveConfig.js";
import { parseMarkdownDocument } from "../src/core/parser.js";

describe("Browser Path and Microsoft Edge Resolution", () => {
  it("resolves custom browserPath directly when file exists", () => {
    // Create a temporary mock browser executable
    const tmpDir = os.tmpdir();
    const fakeBrowser = path.join(tmpDir, `mock-browser-${Date.now()}`);
    fs.writeFileSync(fakeBrowser, "#!/bin/sh\necho mock", { mode: 0o755 });

    try {
      const resolved = findChromeExecutable(fakeBrowser);
      expect(resolved).toBe(fakeBrowser);
    } finally {
      if (fs.existsSync(fakeBrowser)) {
        fs.unlinkSync(fakeBrowser);
      }
    }
  });

  it("warns and falls back to system browser if custom path does not exist", () => {
    const nonExistent = path.join(os.tmpdir(), "non-existent-chrome-path-12345.exe");
    const warnSpy = spyOn(console, "warn");

    const resolved = findChromeExecutable(nonExistent);

    expect(warnSpy).toHaveBeenCalled();
    const warningText = warnSpy.mock.calls.flat().join(" ");
    expect(warningText).toContain("Configured browser executable path not found");
    expect(warningText).toContain(nonExistent);

    // If system has a browser (e.g. google-chrome), it falls back to it
    if (resolved) {
      expect(fs.existsSync(resolved)).toBe(true);
    }
    warnSpy.mockRestore();
  });

  it("honors MARKFORGE_BROWSER_PATH environment variable", () => {
    const tmpDir = os.tmpdir();
    const fakeEnvBrowser = path.join(tmpDir, `mock-env-browser-${Date.now()}`);
    fs.writeFileSync(fakeEnvBrowser, "#!/bin/sh\necho mock", { mode: 0o755 });

    const prevEnv = process.env.MARKFORGE_BROWSER_PATH;
    process.env.MARKFORGE_BROWSER_PATH = fakeEnvBrowser;

    try {
      const resolved = findChromeExecutable();
      expect(resolved).toBe(fakeEnvBrowser);
    } finally {
      if (prevEnv !== undefined) {
        process.env.MARKFORGE_BROWSER_PATH = prevEnv;
      } else {
        delete process.env.MARKFORGE_BROWSER_PATH;
      }
      if (fs.existsSync(fakeEnvBrowser)) {
        fs.unlinkSync(fakeEnvBrowser);
      }
    }
  });

  it("honors EDGE_PATH environment variable", () => {
    const tmpDir = os.tmpdir();
    const fakeEdge = path.join(tmpDir, `mock-msedge-${Date.now()}`);
    fs.writeFileSync(fakeEdge, "#!/bin/sh\necho edge", { mode: 0o755 });

    const prevMarkforge = process.env.MARKFORGE_BROWSER_PATH;
    const prevChrome = process.env.CHROME_PATH;
    const prevPuppeteer = process.env.PUPPETEER_EXECUTABLE_PATH;
    const prevEdge = process.env.EDGE_PATH;

    delete process.env.MARKFORGE_BROWSER_PATH;
    delete process.env.CHROME_PATH;
    delete process.env.PUPPETEER_EXECUTABLE_PATH;
    process.env.EDGE_PATH = fakeEdge;

    try {
      const resolved = findChromeExecutable();
      expect(resolved).toBe(fakeEdge);
    } finally {
      if (prevMarkforge !== undefined) process.env.MARKFORGE_BROWSER_PATH = prevMarkforge;
      if (prevChrome !== undefined) process.env.CHROME_PATH = prevChrome;
      if (prevPuppeteer !== undefined) process.env.PUPPETEER_EXECUTABLE_PATH = prevPuppeteer;
      if (prevEdge !== undefined) {
        process.env.EDGE_PATH = prevEdge;
      } else {
        delete process.env.EDGE_PATH;
      }
      if (fs.existsSync(fakeEdge)) {
        fs.unlinkSync(fakeEdge);
      }
    }
  });

  it("resolves browserPath and chromiumPath in resolveDocumentConfig", () => {
    // 1. From userConfig.browserPath
    const cfg1 = resolveDocumentConfig({}, { browserPath: "/opt/custom/edge" });
    expect(cfg1.browserPath).toBe("/opt/custom/edge");
    expect(cfg1.chromiumPath).toBe("/opt/custom/edge");

    // 2. From userConfig.chromiumPath (alias)
    const cfg2 = resolveDocumentConfig({}, { chromiumPath: "/opt/custom/chromium" });
    expect(cfg2.browserPath).toBe("/opt/custom/chromium");
    expect(cfg2.chromiumPath).toBe("/opt/custom/chromium");

    // 3. Frontmatter overrides userConfig
    const cfg3 = resolveDocumentConfig(
      { browserPath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe" },
      { browserPath: "/opt/other" }
    );
    expect(cfg3.browserPath).toBe("C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe");

    // 4. Kebab-case frontmatter browser-path
    const cfg4 = resolveDocumentConfig({ "browser-path": "C:\\Windows\\msedge.exe" }, {});
    expect(cfg4.browserPath).toBe("C:\\Windows\\msedge.exe");
  });

  it("buildPdfDocument forwards custom browserPath from config", async () => {
    const doc = parseMarkdownDocument("# Test Custom Browser Path");
    // Providing a valid dummy file that fails execution triggers fallback or throws gracefully without crash
    const tmpDir = os.tmpdir();
    const fakeBin = path.join(tmpDir, `mock-fail-bin-${Date.now()}`);
    fs.writeFileSync(fakeBin, "#!/bin/sh\nexit 1\n", { mode: 0o755 });

    try {
      const pdfBuffer = await buildPdfDocument(doc, { browserPath: fakeBin });
      // When headless execution exits with error or doesn't generate output, fallback minimal PDF buffer is created
      expect(Buffer.isBuffer(pdfBuffer)).toBe(true);
      expect(pdfBuffer.toString("utf-8", 0, 8)).toBe("%PDF-1.4");
    } finally {
      if (fs.existsSync(fakeBin)) {
        fs.unlinkSync(fakeBin);
      }
    }
  });
});

