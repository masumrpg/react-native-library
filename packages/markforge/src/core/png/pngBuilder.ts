import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import type { ParsedMarkdownDocument } from "../parser.js";
import type { MarkforgeConfig } from "../../config/types.js";
import { buildHtmlDocument } from "../html/htmlBuilder.js";
import { findChromeExecutable } from "../pdf/pdfBuilder.js";

/**
 * Builds a high-resolution PNG document image buffer using headless Chromium screenshot.
 */
export async function buildPngDocument(
  doc: ParsedMarkdownDocument,
  config?: MarkforgeConfig,
  baseDir?: string
): Promise<Buffer> {
  const htmlContent = await buildHtmlDocument(doc, config, baseDir);
  const chromePath = findChromeExecutable();

  if (!chromePath) {
    throw new Error(
      "Headless Chrome / Chromium / Edge executable not found for PNG document export. " +
        "Please install Google Chrome, Chromium, or Microsoft Edge, or set CHROME_PATH environment variable."
    );
  }

  const tmpHtml = path.join(
    os.tmpdir(),
    `markforge-png-${Date.now()}-${Math.random().toString(36).slice(2)}.html`
  );
  const tmpPng = path.join(
    os.tmpdir(),
    `markforge-png-${Date.now()}-${Math.random().toString(36).slice(2)}.png`
  );

  try {
    fs.writeFileSync(tmpHtml, htmlContent, "utf-8");
    const fileUrl = pathToFileURL(tmpHtml).href;

    const spawnResult = spawnSync(
      chromePath,
      [
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--hide-scrollbars",
        "--force-device-scale-factor=2",
        "--window-size=1200,1600",
        `--screenshot=${tmpPng}`,
        fileUrl,
      ],
      { timeout: 30000, windowsHide: true }
    );

    if (spawnResult.error) {
      throw new Error(`Failed to execute Chromium for PNG export: ${spawnResult.error.message}`);
    }

    if (!fs.existsSync(tmpPng) || fs.statSync(tmpPng).size === 0) {
      throw new Error("Chromium PNG export failed to generate output screenshot file.");
    }

    return fs.readFileSync(tmpPng);
  } finally {
    try {
      if (fs.existsSync(tmpHtml)) fs.unlinkSync(tmpHtml);
      if (fs.existsSync(tmpPng)) fs.unlinkSync(tmpPng);
    } catch {}
  }
}
