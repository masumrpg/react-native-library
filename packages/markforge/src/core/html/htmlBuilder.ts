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

  // 4. Watermark if enabled
  let watermarkCss = "";
  let watermarkHtml = "";
  if (resolved.watermark) {
    const wm = resolved.watermark;
    watermarkCss = `
  .document-watermark {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(${wm.rotate}deg);
    font-size: ${wm.fontSize}pt;
    font-weight: 900;
    color: ${wm.color};
    opacity: ${wm.opacity};
    pointer-events: none;
    z-index: 0;
    user-select: none;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    white-space: nowrap;
  }
  .document-container {
    position: relative;
    z-index: 1;
  }
  `;
    watermarkHtml = `  <div class="document-watermark">${escapeHtml(wm.text)}</div>\n`;
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
  </style>
</head>
<body>
${watermarkHtml}  <div class="document-container">
${bodyHtml}  </div>
  ${mermaidScript}
</body>
</html>`;
}
