import { spawnSync } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { pathToFileURL } from "node:url";
import { findChromeExecutable } from "../pdf/pdfBuilder.js";

/**
 * Renders Mermaid diagram definition into an SVG/PNG buffer for DOCX and HTML embedding.
 */
export async function renderMermaidToPng(
  mermaidCode: string,
  _baseDir: string = process.cwd()
): Promise<Buffer | null> {
  const chromePath = findChromeExecutable();
  if (!chromePath) {
    return null;
  }

  const tmpId = Math.random().toString(36).substring(2, 9);
  const tmpDir = os.tmpdir();
  const tmpHtml = path.join(tmpDir, `mermaid_${tmpId}.html`);
  const tmpScreenshot = path.join(tmpDir, `mermaid_${tmpId}.png`);
  const tmpProfile = path.join(tmpDir, `mermaid_prof_${tmpId}`);
  const isWin = process.platform === "win32";

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    body {
      margin: 0;
      padding: 16px;
      background: #ffffff;
      display: inline-block;
    }
    .mermaid {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
  </style>
</head>
<body>
  <div id="container" class="mermaid">
${mermaidCode}
  </div>
  <script>
    mermaid.initialize({
      startOnLoad: true,
      theme: 'neutral',
      themeVariables: {
        primaryColor: '#33CDCF',
        primaryTextColor: '#0F172A',
        primaryBorderColor: '#009DA0',
        lineColor: '#009DA0',
        secondaryColor: '#ECFDFD',
        tertiaryColor: '#F8FAFC'
      }
    });
  </script>
</body>
</html>`;

  try {
    fs.writeFileSync(tmpHtml, htmlContent, "utf-8");
    const fileUrl = pathToFileURL(tmpHtml).href;

    const res = spawnSync(
      chromePath,
      [
        "--headless=new",
        `--user-data-dir=${tmpProfile}`,
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-gpu",
        "--disable-sync",
        "--disable-extensions",
        ...(isWin ? [] : ["--no-sandbox", "--disable-setuid-sandbox"]),
        "--allow-file-access-from-files",
        "--disable-web-security",
        "--disable-software-rasterizer",
        "--window-size=1200,800",
        "--virtual-time-budget=5000",
        `--screenshot=${tmpScreenshot}`,
        fileUrl,
      ],
      { timeout: 15000, windowsHide: true }
    );

    if (res.status === 0 && fs.existsSync(tmpScreenshot)) {
      const buffer = fs.readFileSync(tmpScreenshot);
      return buffer;
    }
  } catch {
    // ignore
  } finally {
    try {
      if (fs.existsSync(tmpHtml)) fs.unlinkSync(tmpHtml);
      if (fs.existsSync(tmpScreenshot)) fs.unlinkSync(tmpScreenshot);
      if (fs.existsSync(tmpProfile)) fs.rmSync(tmpProfile, { recursive: true, force: true });
    } catch {
      // ignore
    }
  }

  return null;
}

