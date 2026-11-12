import { spawnSync } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { pathToFileURL } from "node:url";
import { findChromeExecutable } from "../pdf/pdfBuilder.js";
import { resolveMermaidConfig } from "./mermaidTheme.js";
import type { ThemeProps, MermaidConfig } from "../../config/types.js";
import { THEME_PRESETS } from "../../config/types.js";

/**
 * Renders Mermaid diagram definition into an SVG/PNG buffer for DOCX and HTML embedding.
 */
export async function renderMermaidToPng(
  mermaidCode: string,
  _baseDir: string = process.cwd(),
  customBrowserPath?: string,
  themeProps?: ThemeProps,
  userOptions?: MermaidConfig
): Promise<Buffer | null> {
  const chromePath = findChromeExecutable(customBrowserPath);
  if (!chromePath) {
    return null;
  }

  const activeThemeProps = themeProps || THEME_PRESETS.corporate;
  const mermaidConfig = resolveMermaidConfig(activeThemeProps, userOptions);

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
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
    mermaid.initialize(${JSON.stringify(mermaidConfig, null, 2)});
  </script>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 24px;
      background: #ffffff;
      display: inline-block;
      font-family: ${activeThemeProps.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'};
    }
    .mermaid-card {
      display: inline-block;
      padding: 20px;
      background: #ffffff;
      border: 1px solid ${activeThemeProps.borderColor || "#E2E8F0"};
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }
    pre.mermaid, .mermaid {
      display: flex;
      justify-content: center;
      align-items: center;
      background: transparent;
      border: none;
      margin: 0;
      padding: 0;
    }
    svg {
      max-width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
  <div class="mermaid-card">
    <pre class="mermaid">
${mermaidCode}
    </pre>
  </div>
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
        "--disable-software-rasterizer",
        "--window-size=1920,1200",
        "--device-scale-factor=2",
        "--virtual-time-budget=6000",
        `--screenshot=${tmpScreenshot}`,
        fileUrl,
      ],
      { timeout: 20000, windowsHide: true }
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
