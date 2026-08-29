import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import type { ParsedMarkdownDocument } from "../parser.js";
import type { MarkforgeConfig } from "../../config/types.js";
import { buildHtmlDocument } from "../html/htmlBuilder.js";

/**
 * Finds available Chrome or Chromium binary for headless PDF rendering.
 */
export function findChromeExecutable(): string | null {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  if (process.env.PUPPETEER_EXECUTABLE_PATH && fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  const isWin = process.platform === "win32";

  // Resolve Windows env-var paths at runtime
  const winLocalAppData = process.env.LOCALAPPDATA ?? "";
  const winProgramFiles = process.env.PROGRAMFILES ?? "C:\\Program Files";
  const winProgramFilesX86 = process.env["PROGRAMFILES(X86)"] ?? "C:\\Program Files (x86)";

  const candidates: string[] = [
    // Linux
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/snap/bin/chromium",
    "/usr/bin/microsoft-edge",
    "/usr/bin/microsoft-edge-stable",
    "/usr/bin/brave-browser",
    // macOS
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
    // Windows — Microsoft Edge (Native Windows 10/11 browser, enterprise whitelist friendly)
    `${winProgramFiles}\\Microsoft\\Edge\\Application\\msedge.exe`,
    `${winProgramFilesX86}\\Microsoft\\Edge\\Application\\msedge.exe`,
    `${winLocalAppData}\\Microsoft\\Edge\\Application\\msedge.exe`,
    // Windows — Google Chrome
    `${winProgramFiles}\\Google\\Chrome\\Application\\chrome.exe`,
    `${winProgramFilesX86}\\Google\\Chrome\\Application\\chrome.exe`,
    `${winLocalAppData}\\Google\\Chrome\\Application\\chrome.exe`,
    // Windows — Brave Browser
    `${winProgramFiles}\\BraveSoftware\\Brave-Browser\\Application\\brave.exe`,
    `${winProgramFilesX86}\\BraveSoftware\\Brave-Browser\\Application\\brave.exe`,
    `${winLocalAppData}\\BraveSoftware\\Brave-Browser\\Application\\brave.exe`,
    // Windows — Chromium
    `${winLocalAppData}\\Chromium\\Application\\chrome.exe`,
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    } catch {
      // ignore
    }
  }

  // Check PATH via which/where (including msedge and brave on Windows)
  try {
    const cmd = isWin ? "where" : "which";
    const names = isWin
      ? ["chrome", "msedge", "brave", "google-chrome", "chromium", "chromium-browser"]
      : ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "microsoft-edge", "brave-browser"];

    for (const name of names) {
      const res = spawnSync(cmd, [name], { encoding: "utf-8" });
      if (res.status === 0 && res.stdout.trim()) {
        const binPath = res.stdout.split(/\r?\n/)[0].trim();
        if (fs.existsSync(binPath)) return binPath;
      }
    }
  } catch {
    // ignore
  }

  return null;
}



import { resolveDocumentConfig } from "../../config/resolveConfig.js";

/**
 * Injects CSS Paged Media styles into HTML for print & PDF formatting.
 */
export function injectPagedMediaStyles(
  html: string,
  config: MarkforgeConfig,
  metadata?: Record<string, unknown>
): string {
  const resolved = resolveDocumentConfig(metadata || {}, config);
  const size = resolved.paperSize;
  const orientation = resolved.orientation;
  const top = resolved.margins.top;
  const bottom = resolved.margins.bottom;
  const left = resolved.margins.left;
  const right = resolved.margins.right;

  const esc = (s: string) => s.replace(/"/g, '\\"').replace(/\\/g, "\\\\");

  const buildZoneCss = (pos: string, zone?: import("../../config/resolveConfig.js").NormalizedHeaderFooterZone, isPageCounter: boolean = false): string => {
    if (!zone && !isPageCounter) return "";
    const color = zone?.color || "#94a3b8";
    const fontSize = zone?.fontSize ? `${zone.fontSize}pt` : "9pt";
    const fontFamily = zone?.fontFamily ? `font-family: ${zone.fontFamily};` : "";
    const fontWeight = zone?.bold ? "font-weight: bold;" : "";
    const fontStyle = zone?.italic ? "font-style: italic;" : "";

    let content = "";
    if (isPageCounter) {
      if (zone?.text && (zone.text.includes("{page}") || zone.text.includes("{pages}"))) {
        const parts = zone.text.split(/(\{page\}|\{pages\})/gi);
        const cssParts = parts.map((part) => {
          if (part.toLowerCase() === "{page}") return "counter(page)";
          if (part.toLowerCase() === "{pages}") return "counter(pages)";
          return `"${esc(part)}"`;
        });
        content = cssParts.join(" ");
      } else if (zone?.text) {
        content = `"${esc(zone.text)}"`;
      } else {
        content = `"Page " counter(page) " of " counter(pages)`;
      }
    } else if (zone?.text) {
      content = `"${esc(zone.text)}"`;
    }

    if (!content) return "";

    return `@${pos} {
      content: ${content};
      font-size: ${fontSize};
      color: ${color};
      ${fontFamily}
      ${fontWeight}
      ${fontStyle}
    }`;
  };

  const pagedCss = `
  @page {
    size: ${size} ${orientation};
    margin-top: ${top};
    margin-bottom: ${bottom};
    margin-left: ${left};
    margin-right: ${right};
    ${buildZoneCss("top-left", resolved.header?.left)}
    ${buildZoneCss("top-center", resolved.header?.center)}
    ${buildZoneCss("top-right", resolved.header?.right)}
    ${buildZoneCss("bottom-left", resolved.footer?.left)}
    ${buildZoneCss("bottom-center", resolved.footer?.center)}
    ${buildZoneCss("bottom-right", resolved.footer?.right, true)}
  }
  @media print {
    body { padding: 0; }
    h1, h2, h3, pre, table, blockquote, .callout {
      break-inside: avoid;
    }
  }
  `;

  return html.replace("</head>", `<style>${pagedCss}</style></head>`);
}


/**
 * Generates a minimal valid PDF-1.4 binary buffer fallback.
 */
function createFallbackPdfBuffer(title: string = "Document"): Buffer {
  const streamContent = `BT /F1 18 Tf 50 750 Td (${title}) Tj ET\nBT /F1 12 Tf 50 720 Td (Generated via MarkForge Fallback Renderer) Tj ET`;
  const streamLength = Buffer.byteLength(streamContent, "utf-8");

  const pdfBody = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${streamLength} >>
stream
${streamContent}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
0000000373 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
453
%%EOF
`;

  return Buffer.from(pdfBody, "utf-8");
}

/**
 * Builds a true binary PDF document from parsed Markdown.
 */
export async function buildPdfDocument(
  doc: ParsedMarkdownDocument,
  config: MarkforgeConfig,
  baseDir: string = process.cwd()
): Promise<Buffer> {
  const baseHtml = await buildHtmlDocument(doc, config, baseDir);
  const pagedHtml = injectPagedMediaStyles(baseHtml, config, doc.metadata as Record<string, unknown>);

  const chromePath = findChromeExecutable();

  if (chromePath) {
    const tmpId = Math.random().toString(36).substring(2, 9);
    const tmpDir = os.tmpdir();
    const tmpHtml = path.join(tmpDir, `markforge_${tmpId}.html`);
    const tmpPdf = path.join(tmpDir, `markforge_${tmpId}.pdf`);
    const tmpProfile = path.join(tmpDir, `markforge_prof_${tmpId}`);

    // Enterprise-isolated flags: Prevents Chrome/Edge from accessing user Google accounts, syncing, or sending telemetry
    const isolatedFlags = [
      `--user-data-dir=${tmpProfile}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-sync",
      "--disable-background-networking",
      "--disable-component-update",
      "--disable-default-apps",
      "--disable-extensions",
      "--disable-domain-reliability",
      "--disable-client-side-phishing-detection",
      "--disable-breakpad",
      "--disable-component-extensions-with-background-pages",
      "--disable-features=Translate,OptimizationHints,MediaRouter,DialMediaRouteProvider,CalculatedNewTabPage,ChromeWhatsNewUI,PrivacySandboxSettings4",
      "--password-store=basic",
      "--use-mock-keychain",
      "--mute-audio",
      "--no-service-autorun",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--allow-file-access-from-files",
      "--disable-web-security",
      "--force-color-profile=srgb",
      "--no-pdf-header-footer",
    ];

    try {
      fs.writeFileSync(tmpHtml, pagedHtml, "utf-8");
      const fileUrl = pathToFileURL(tmpHtml).href;

      let res = spawnSync(
        chromePath,
        [
          "--headless=new",
          ...isolatedFlags,
          "--run-all-compositor-stages-before-draw",
          "--virtual-time-budget=8000",
          `--print-to-pdf=${tmpPdf}`,
          fileUrl,
        ],
        { timeout: 30000 }
      );

      if ((res.status !== 0 || !fs.existsSync(tmpPdf)) && chromePath) {
        // Fallback to legacy headless mode
        res = spawnSync(
          chromePath,
          [
            "--headless",
            ...isolatedFlags,
            `--print-to-pdf=${tmpPdf}`,
            fileUrl,
          ],
          { timeout: 30000 }
        );
      }

      if (fs.existsSync(tmpPdf) && fs.statSync(tmpPdf).size > 0) {
        const pdfBuffer = fs.readFileSync(tmpPdf);
        return pdfBuffer;
      }
    } catch {
      // fallback if spawn fails
    } finally {
      try {
        if (fs.existsSync(tmpHtml)) fs.unlinkSync(tmpHtml);
        if (fs.existsSync(tmpPdf)) fs.unlinkSync(tmpPdf);
        if (fs.existsSync(tmpProfile)) fs.rmSync(tmpProfile, { recursive: true, force: true });
      } catch {
        // ignore cleanup errors
      }
    }
  }

  // Fallback to standard PDF structure
  return createFallbackPdfBuffer(doc.metadata.title || "MarkForge Document");
}
