import * as fs from "node:fs";
import * as path from "node:path";
import type { ParsedMarkdownDocument, MarkdownInlineSpan } from "../parser.js";
import type { MarkforgeConfig } from "../../config/types.js";
import { resolveImage } from "../imageResolver.js";
import { generateThemeCss, THEME_COMPONENTS } from "./htmlThemes.js";
import { highlightCodeToHtml } from "../syntax/syntaxHighlighter.js";
import { resolveDocumentConfig } from "../../config/resolveConfig.js";

/**
 * Escapes HTML characters safely.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Converts Markdown inline spans to HTML markup.
 */
export async function renderInlinesToHtml(
  spans: MarkdownInlineSpan[] = [],
  baseDir: string = process.cwd()
): Promise<string> {
  let result = "";

  for (const span of spans) {
    if (span.type === "image" && span.url) {
      const resolved = await resolveImage(span.url, baseDir);
      const src = resolved ? resolved.dataUri : span.url;
      const alt = escapeHtml(span.alt || "");
      const title = span.title ? ` title="${escapeHtml(span.title)}"` : "";
      const width = span.width ? ` width="${span.width}"` : "";
      const height = span.height ? ` height="${span.height}"` : "";

      result += `<img src="${src}" alt="${alt}"${title}${width}${height} />`;
      continue;
    }

    if (span.type === "link" && span.url) {
      const inner = span.children ? await renderInlinesToHtml(span.children, baseDir) : escapeHtml(span.content);
      const title = span.title ? ` title="${escapeHtml(span.title)}"` : "";
      result += `<a href="${escapeHtml(span.url)}"${title}>${inner}</a>`;
      continue;
    }

    if (span.type === "bold") {
      const inner = span.children ? await renderInlinesToHtml(span.children, baseDir) : escapeHtml(span.content);
      result += `<strong>${inner}</strong>`;
      continue;
    }

    if (span.type === "italic") {
      const inner = span.children ? await renderInlinesToHtml(span.children, baseDir) : escapeHtml(span.content);
      result += `<em>${inner}</em>`;
      continue;
    }

    if (span.type === "strikethrough") {
      const inner = span.children ? await renderInlinesToHtml(span.children, baseDir) : escapeHtml(span.content);
      result += `<del>${inner}</del>`;
      continue;
    }

    if (span.type === "code") {
      result += `<code>${escapeHtml(span.content)}</code>`;
      continue;
    }

    if (span.type === "htmlInline") {
      result += span.content;
      continue;
    }

    result += escapeHtml(span.content);
  }

  return result;
}

/**
 * Builds standalone self-contained HTML from a parsed Markdown document.
 */
export async function buildHtmlDocument(
  doc: ParsedMarkdownDocument,
  config: MarkforgeConfig,
  baseDir: string = process.cwd()
): Promise<string> {
  const resolved = resolveDocumentConfig(doc.metadata as Record<string, unknown>, config);
  const baseThemeCss = generateThemeCss(resolved.theme);

  // Load custom external CSS if provided
  let customCss = "";
  for (const cssPath of resolved.css) {
    const fullCssPath = path.isAbsolute(cssPath) ? cssPath : path.resolve(baseDir, cssPath);
    if (fs.existsSync(fullCssPath)) {
      customCss += `\n/* Custom CSS: ${cssPath} */\n` + fs.readFileSync(fullCssPath, "utf-8");
    }
  }

  // Collect inlined <style> blocks from markdown
  const inlinedCss = doc.inlinedStyles.join("\n");

  let bodyHtml = "";

  // 1. Header Area if title exists
  if (resolved.title) {
    bodyHtml += `  <header class="document-header">\n`;
    bodyHtml += `    <h1 class="document-title">${escapeHtml(resolved.title)}</h1>\n`;
    if (resolved.subtitle) {
      bodyHtml += `    <div class="document-subtitle">${escapeHtml(resolved.subtitle)}</div>\n`;
    }
    if (resolved.author || resolved.date || resolved.version) {
      bodyHtml += `    <div class="document-meta">\n`;
      if (resolved.author) {
        bodyHtml += `      <span>Author: ${escapeHtml(resolved.author)}</span>\n`;
      }
      if (resolved.version) {
        bodyHtml += `      <span>Version: ${escapeHtml(resolved.version)}</span>\n`;
      }
      if (resolved.date) {
        bodyHtml += `      <span>Date: ${escapeHtml(resolved.date)}</span>\n`;
      }
      bodyHtml += `    </div>\n`;
    }
    bodyHtml += `  </header>\n`;
  }

  // 2. Table of Contents if enabled
  if (resolved.toc && doc.tocEntries.length > 0) {
    bodyHtml += `  <nav class="table-of-contents">\n`;
    bodyHtml += `    <h2>Table of Contents</h2>\n    <ul>\n`;
    for (const entry of doc.tocEntries) {
      const indent = "  ".repeat(entry.level);
      bodyHtml += `    ${indent}<li><a href="#${entry.id}">${escapeHtml(entry.text)}</a></li>\n`;
    }
    bodyHtml += `    </ul>\n  </nav>\n`;
  }

  // 3. Render AST Nodes
  for (const node of doc.nodes) {
    if (node.type === "heading") {
      const inner = await renderInlinesToHtml(node.inlines, baseDir);
      bodyHtml += `  <h${node.level} id="${node.id}">${inner}</h${node.level}>\n`;
      continue;
    }

    if (node.type === "paragraph") {
      const inner = await renderInlinesToHtml(node.inlines, baseDir);
      bodyHtml += `  <p>${inner}</p>\n`;
      continue;
    }

    if (node.type === "codeBlock") {
      const lang = node.language || "";
      const langClass = lang ? ` class="language-${escapeHtml(lang)}"` : "";
      const highlighted = highlightCodeToHtml(node.text || "", lang, resolved.syntaxTheme);
      bodyHtml += `  <pre><code${langClass}>${highlighted}</code></pre>\n`;
      continue;
    }

    if (node.type === "mermaid") {
      bodyHtml += `  <div class="mermaid">\n${escapeHtml(node.text || "")}\n  </div>\n`;
      continue;
    }

    if (node.type === "callout") {
      const inner = await renderInlinesToHtml(node.inlines, baseDir);
      // Inline styles ensure colors render in Chromium PDF (no background-graphics needed)
      const CALLOUT_STYLES: Record<string, { bg: string; border: string; titleColor: string }> = {
        NOTE:      { bg: "#ECFDFD", border: "#33CDCF", titleColor: "#009DA0" },
        TIP:       { bg: "#ecfdf5", border: "#10b981", titleColor: "#10b981" },
        WARNING:   { bg: "#fffbeb", border: "#f59e0b", titleColor: "#f59e0b" },
        CAUTION:   { bg: "#fef2f2", border: "#ef4444", titleColor: "#ef4444" },
        IMPORTANT: { bg: "#f5f3ff", border: "#8b5cf6", titleColor: "#8b5cf6" },
      };
      const cs = CALLOUT_STYLES[node.calloutType ?? "NOTE"] ?? CALLOUT_STYLES["NOTE"];
      bodyHtml += `  <div class="callout callout-${node.calloutType}" style="border-left:4px solid ${cs.border};background:${cs.bg};border-radius:6px;padding:1rem 1.2rem;margin:1.2rem 0;">\n`;
      bodyHtml += `    <div class="callout-title" style="font-weight:700;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.4rem;color:${cs.titleColor};">${node.calloutType}</div>\n`;
      bodyHtml += `    <div class="callout-body">${inner}</div>\n`;
      bodyHtml += `  </div>\n`;
      continue;
    }

    if (node.type === "blockquote") {
      const inner = await renderInlinesToHtml(node.inlines, baseDir);
      bodyHtml += `  <blockquote>${inner}</blockquote>\n`;
      continue;
    }

    if (node.type === "table" && node.children) {
      bodyHtml += `  <table>\n`;
      for (const row of node.children) {
        bodyHtml += `    <tr>\n`;
        for (const cell of row.children || []) {
          const tag = cell.isHeader ? "th" : "td";
          const align = cell.align ? ` align="${cell.align}"` : "";
          const inner = await renderInlinesToHtml(cell.inlines, baseDir);
          bodyHtml += `      <${tag}${align}>${inner}</${tag}>\n`;
        }
        bodyHtml += `    </tr>\n`;
      }
      bodyHtml += `  </table>\n`;
      continue;
    }

    if (node.type === "list" && node.children) {
      const tag = node.ordered ? "ol" : "ul";
      bodyHtml += `  <${tag}>\n`;
      for (const item of node.children) {
        const inner = await renderInlinesToHtml(item.inlines, baseDir);
        bodyHtml += `    <li>${inner}</li>\n`;
      }
      bodyHtml += `  </${tag}>\n`;
      continue;
    }

    if (node.type === "thematicBreak") {
      bodyHtml += `  <hr />\n`;
      continue;
    }

    if (node.type === "htmlBlock") {
      bodyHtml += `  ${node.text}\n`;
      continue;
    }
  }

  // 4. Watermark if enabled (Rendered as PNG bitmap raster via Canvas to guarantee 100% unselectable PDF text across all pages)
  let watermarkCss = "";
  let watermarkHtml = "";
  if (resolved.watermark) {
    const wm = resolved.watermark;
    watermarkCss = `
  .document-watermark {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 0;
    user-select: none;
    -webkit-user-select: none;
  }
  .document-container {
    position: relative;
    z-index: 1;
  }
  @media print {
    .document-watermark {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
  `;

    watermarkHtml = `  <div id="markforge-watermark" class="document-watermark" aria-hidden="true"></div>
  <script>
  (function() {
    try {
      var canvas = document.createElement('canvas');
      var dpr = 3;
      var width = 800;
      var height = 1100;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      var ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.translate(width / 2, height / 2);
        ctx.rotate((${wm.rotate} * Math.PI) / 180);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '900 ${wm.fontSize * 1.5}px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '${wm.color}';
        ctx.globalAlpha = ${wm.opacity};
        try { ctx.letterSpacing = '0.15em'; } catch(e) {}
        ctx.fillText(${JSON.stringify(wm.text.toUpperCase())}, 0, 0);
        var dataUrl = canvas.toDataURL('image/png');
        var wmEl = document.getElementById('markforge-watermark');
        if (wmEl) {
          wmEl.style.backgroundImage = 'url("' + dataUrl + '")';
          wmEl.style.backgroundRepeat = 'no-repeat';
          wmEl.style.backgroundPosition = 'center center';
          wmEl.style.backgroundSize = 'contain';
        }
      }
    } catch(err) {}
  })();
  </script>\n`;
  }

  let signaturesHtml = "";
  let signaturesCss = "";

  if (resolved.signatures && resolved.signatures.items.length > 0) {
    const sig = resolved.signatures;
    const numItems = sig.items.length;

    let justifyCss = "flex-end";
    if (sig.align === "left") justifyCss = "flex-start";
    else if (sig.align === "center") justifyCss = "center";
    else if (sig.align === "space-between") justifyCss = "space-between";

    signaturesCss = `
  .markforge-signatures {
    margin-top: ${sig.spacingBefore};
    display: grid;
    grid-template-columns: ${
      numItems === 1
        ? sig.align === "left"
          ? "minmax(200px, 280px) 1fr"
          : sig.align === "center"
          ? "1fr minmax(200px, 280px) 1fr"
          : "1fr minmax(200px, 280px)"
        : `repeat(${numItems}, minmax(0, 1fr))`
    };
    gap: 2rem;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .markforge-signature-card {
    ${numItems === 1 && sig.align === "center" ? "grid-column: 2;" : ""}
    ${numItems === 1 && sig.align === "right" ? "grid-column: 2;" : ""}
    display: flex;
    flex-direction: column;
    ${sig.style === "box" ? `border: 1px solid ${sig.borderColor}; border-radius: 6px; padding: 14px 18px; background-color: var(--mf-card-bg, #F8FAFC);` : ""}
  }
  .markforge-sig-title {
    font-size: 0.85rem;
    color: ${sig.titleColor};
    font-weight: 600;
    margin-bottom: 6px;
  }
  .markforge-sig-space {
    height: var(--sig-height, 60px);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 6px;
  }
  .markforge-sig-space img {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
  }
  .markforge-sig-line {
    ${sig.style === "line" ? `border-bottom: 1.5px solid ${sig.borderColor}; margin-bottom: 8px;` : ""}
  }
  .markforge-sig-name {
    font-size: 0.95rem;
    font-weight: 700;
    color: ${sig.nameColor};
  }
  .markforge-sig-role {
    font-size: 0.82rem;
    color: ${sig.roleColor};
    margin-top: 2px;
  }
  .markforge-sig-date {
    font-size: 0.78rem;
    color: ${sig.roleColor};
    margin-top: 2px;
  }
  @media print {
    .markforge-signatures {
      page-break-inside: avoid;
      break-inside: avoid;
    }
  }
  `;

    const itemCards = sig.items.map((item) => {
      const titleHtml = item.title ? `<div class="markforge-sig-title">${escapeHtml(item.title)}</div>` : "";
      let signSpaceHtml = "";
      if (item.image) {
        signSpaceHtml = `<div class="markforge-sig-space" style="--sig-height: ${item.signatureHeight}px;"><img src="${escapeHtml(item.image)}" alt="Signature" /></div>`;
      } else {
        signSpaceHtml = `<div class="markforge-sig-space" style="--sig-height: ${item.signatureHeight}px;"></div>`;
      }
      const lineHtml = sig.style === "line" ? `<div class="markforge-sig-line"></div>` : "";
      const nameHtml = `<div class="markforge-sig-name">${escapeHtml(item.name)}</div>`;
      const roleHtml = item.role ? `<div class="markforge-sig-role">${escapeHtml(item.role)}</div>` : "";
      const dateHtml = item.date ? `<div class="markforge-sig-date">Date: ${escapeHtml(item.date)}</div>` : "";

      return `    <div class="markforge-signature-card">
      ${titleHtml}
      ${signSpaceHtml}
      ${lineHtml}
      ${nameHtml}
      ${roleHtml}
      ${dateHtml}
    </div>`;
    }).join("\n");

    signaturesHtml = `\n  <div class="markforge-signatures">\n${itemCards}\n  </div>\n`;
  }

  const hasMermaid = doc.nodes.some((n) => n.type === "mermaid");
  const mermaidScript = hasMermaid
    ? `<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
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
  </script>`
    : "";

  return `<!DOCTYPE html>
<html lang="${resolved.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(resolved.title)}</title>
  <style>
${THEME_COMPONENTS}
${baseThemeCss}
${customCss}
${inlinedCss}
${watermarkCss}
${signaturesCss}
  </style>
</head>
<body>
${watermarkHtml}  <div class="document-container">
${bodyHtml}${signaturesHtml}  </div>
  ${mermaidScript}
</body>
</html>`;
}
