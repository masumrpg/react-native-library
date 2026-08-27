import * as fs from "node:fs";
import * as path from "node:path";
import type { ParsedMarkdownDocument, MarkdownInlineSpan } from "../parser.js";
import type { MarkforgeConfig } from "../../config/types.js";
import { resolveImage } from "../imageResolver.js";
import { THEMES, THEME_COMPONENTS } from "./htmlThemes.js";
import { highlightCodeToHtml } from "../syntax/syntaxHighlighter.js";

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
  const metadata = { ...config.metadata, ...doc.metadata };
  const themeName = metadata.theme || config.theme || "default";
  const baseThemeCss = THEMES[themeName] || THEMES.default;

  // Load custom external CSS if provided
  let customCss = "";
  if (config.css) {
    const cssList = Array.isArray(config.css) ? config.css : [config.css];
    for (const cssPath of cssList) {
      const fullCssPath = path.isAbsolute(cssPath) ? cssPath : path.resolve(baseDir, cssPath);
      if (fs.existsSync(fullCssPath)) {
        customCss += `\n/* Custom CSS: ${cssPath} */\n` + fs.readFileSync(fullCssPath, "utf-8");
      }
    }
  }

  // Collect inlined <style> blocks from markdown
  const inlinedCss = doc.inlinedStyles.join("\n");

  let bodyHtml = "";

  // 1. Header Area if metadata exists
  if (metadata.title) {
    bodyHtml += `  <header class="document-header">\n`;
    bodyHtml += `    <h1 class="document-title">${escapeHtml(metadata.title)}</h1>\n`;
    if (metadata.subtitle) {
      bodyHtml += `    <div class="document-subtitle">${escapeHtml(metadata.subtitle)}</div>\n`;
    }
    if (metadata.author || metadata.date) {
      bodyHtml += `    <div class="document-meta">\n`;
      if (metadata.author) {
        const authors = Array.isArray(metadata.author) ? metadata.author.join(", ") : metadata.author;
        bodyHtml += `      <span>Author: ${escapeHtml(authors)}</span>\n`;
      }
      if (metadata.date) {
        bodyHtml += `      <span>Date: ${escapeHtml(metadata.date)}</span>\n`;
      }
      bodyHtml += `    </div>\n`;
    }
    bodyHtml += `  </header>\n`;
  }

  // 2. Table of Contents if enabled
  if (config.toc || metadata.toc) {
    if (doc.tocEntries.length > 0) {
      bodyHtml += `  <nav class="table-of-contents">\n`;
      bodyHtml += `    <h2>Table of Contents</h2>\n    <ul>\n`;
      for (const entry of doc.tocEntries) {
        const indent = "  ".repeat(entry.level);
        bodyHtml += `    ${indent}<li><a href="#${entry.id}">${escapeHtml(entry.text)}</a></li>\n`;
      }
      bodyHtml += `    </ul>\n  </nav>\n`;
    }
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
      const highlighted = highlightCodeToHtml(node.text || "", lang);
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
        if (row.children) {
          for (let colIdx = 0; colIdx < row.children.length; colIdx++) {
            const cell = row.children[colIdx];
            const tag = row.isHeader ? "th" : "td";
            const align = node.align?.[colIdx] ? ` style="text-align: ${node.align[colIdx]}"` : "";
            const cellInner = await renderInlinesToHtml(cell.inlines, baseDir);
            bodyHtml += `      <${tag}${align}>${cellInner}</${tag}>\n`;
          }
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
        const itemInner = await renderInlinesToHtml(item.inlines, baseDir);
        let prefix = "";
        if (item.checked !== undefined) {
          prefix = `<input type="checkbox" disabled ${item.checked ? "checked" : ""}/> `;
        }
        bodyHtml += `    <li>${prefix}${itemInner}</li>\n`;
      }
      bodyHtml += `  </${tag}>\n`;
      continue;
    }

    if (node.type === "htmlBlock") {
      bodyHtml += `  ${node.rawHtml}\n`;
      continue;
    }

    if (node.type === "thematicBreak") {
      bodyHtml += `  <hr />\n`;
      continue;
    }
  }

  // Watermark support (only when explicitly configured)
  const wmConfig = config.watermark ?? metadata.watermark;
  let watermarkHtml = "";
  let watermarkCss = "";
  if (wmConfig) {
    const wmText = typeof wmConfig === "string" ? wmConfig : wmConfig.text;
    const opacity = typeof wmConfig === "object" && wmConfig.opacity !== undefined ? wmConfig.opacity : 0.12;
    const rotate = typeof wmConfig === "object" && wmConfig.rotate !== undefined ? wmConfig.rotate : -45;
    const color = typeof wmConfig === "object" && wmConfig.color ? wmConfig.color : "#94A3B8";
    const fontSize = typeof wmConfig === "object" && wmConfig.fontSize ? `${wmConfig.fontSize}pt` : "52pt";

    watermarkCss = `
  .document-watermark {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(${rotate}deg);
    font-size: ${fontSize};
    font-weight: 800;
    color: ${color};
    opacity: ${opacity};
    pointer-events: none;
    user-select: none;
    z-index: 9999;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    white-space: nowrap;
  }
  `;
    watermarkHtml = `  <div class="document-watermark">${escapeHtml(wmText)}</div>\n`;
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

  const documentTitle = metadata.title || "MarkForge Document";

  return `<!DOCTYPE html>
<html lang="${metadata.lang || "en"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(documentTitle)}</title>
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
