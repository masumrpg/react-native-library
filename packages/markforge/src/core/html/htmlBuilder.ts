import * as fs from "node:fs";
import * as path from "node:path";
import { type ParsedMarkdownDocument, type MarkdownInlineSpan, type MarkdownASTNode, applyHeadingNumbering } from "../parser.js";
import type { MarkforgeConfig } from "../../config/types.js";
import { resolveImage } from "../imageResolver.js";
import { generateThemeCss, THEME_COMPONENTS } from "./htmlThemes.js";
import { highlightCodeToHtml } from "../syntax/syntaxHighlighter.js";
import {
  resolveDocumentConfig,
  replaceDocumentTokens,
  type NormalizedCoverPage,
  type NormalizedBackCover,
  type ResolvedDocumentConfig,
} from "../../config/resolveConfig.js";
import { renderMathToHtml, KATEX_INLINE_CSS } from "../math/mathRenderer.js";

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
 * Renders inline Markdown spans (bold, italic, links, images, footnotes, math, etc.) to HTML with token replacement.
 */
export async function renderInlinesToHtml(
  spans: MarkdownInlineSpan[] = [],
  baseDir: string = process.cwd(),
  tokens?: Record<string, unknown>
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
      const inner = span.children ? await renderInlinesToHtml(span.children, baseDir, tokens) : escapeHtml(tokens ? replaceDocumentTokens(span.content, tokens) : span.content);
      const title = span.title ? ` title="${escapeHtml(span.title)}"` : "";
      result += `<a href="${escapeHtml(span.url)}"${title}>${inner}</a>`;
      continue;
    }

    if (span.type === "bold") {
      const inner = span.children ? await renderInlinesToHtml(span.children, baseDir, tokens) : escapeHtml(tokens ? replaceDocumentTokens(span.content, tokens) : span.content);
      result += `<strong>${inner}</strong>`;
      continue;
    }

    if (span.type === "italic") {
      const inner = span.children ? await renderInlinesToHtml(span.children, baseDir, tokens) : escapeHtml(tokens ? replaceDocumentTokens(span.content, tokens) : span.content);
      result += `<em>${inner}</em>`;
      continue;
    }

    if (span.type === "strikethrough") {
      const inner = span.children ? await renderInlinesToHtml(span.children, baseDir, tokens) : escapeHtml(tokens ? replaceDocumentTokens(span.content, tokens) : span.content);
      result += `<del>${inner}</del>`;
      continue;
    }

    if (span.type === "code") {
      result += `<code>${escapeHtml(span.content)}</code>`;
      continue;
    }

    if (span.type === "mathInline") {
      result += renderMathToHtml(span.content, false);
      continue;
    }

    if (span.type === "footnoteRef") {
      const id = escapeHtml(span.footnoteId || span.content);
      result += `<sup><a href="#fn-${id}" id="fnref-${id}" class="markforge-fnref">[${escapeHtml(span.content)}]</a></sup>`;
      continue;
    }

    if (span.type === "htmlInline") {
      result += span.content;
      continue;
    }

    const content = tokens ? replaceDocumentTokens(span.content, tokens) : span.content;
    result += escapeHtml(content);
  }

  return result;
}

/**
 * Renders an AST node array to HTML.
 */
export async function renderNodesToHtml(
  nodes: MarkdownASTNode[],
  resolved: ResolvedDocumentConfig,
  baseDir: string = process.cwd(),
  tokens?: Record<string, unknown>
): Promise<string> {
  let bodyHtml = "";
  const tokenCtx = tokens || (resolved as unknown as Record<string, unknown>);

  for (const node of nodes) {
    if (node.type === "heading") {
      const inner = await renderInlinesToHtml(node.inlines, baseDir, tokenCtx);
      bodyHtml += `  <h${node.level} id="${node.id}">${inner}</h${node.level}>\n`;
      continue;
    }

    if (node.type === "paragraph") {
      const inner = await renderInlinesToHtml(node.inlines, baseDir, tokenCtx);
      bodyHtml += `  <p>${inner}</p>\n`;
      continue;
    }

    if (node.type === "mathBlock") {
      bodyHtml += `  <div class="math-block">${renderMathToHtml(node.text || "", true)}</div>\n`;
      continue;
    }

    if (node.type === "columns") {
      const cols = node.columnsCount || 2;
      const gap = node.columnGap || "1.5rem";
      let colChildrenHtml = "";

      for (const col of node.children || []) {
        const colInner = await renderNodesToHtml(col.children || [], resolved, baseDir, tokenCtx);
        colChildrenHtml += `    <div class="markforge-col">\n${colInner}    </div>\n`;
      }

      bodyHtml += `  <div class="markforge-columns" style="--cols: ${cols}; --col-gap: ${gap};">\n${colChildrenHtml}  </div>\n`;
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
      const inner = await renderInlinesToHtml(node.inlines, baseDir, tokenCtx);
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
      const inner = await renderInlinesToHtml(node.inlines, baseDir, tokenCtx);
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
          const inner = await renderInlinesToHtml(cell.inlines, baseDir, tokenCtx);
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
        const inner = await renderInlinesToHtml(item.inlines, baseDir, tokenCtx);
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

  return bodyHtml;
}

/**
 * Renders the Cover Page HTML and returns { html, css }.
 */
export async function renderCoverPageHtml(
  cover: NormalizedCoverPage,
  baseDir: string = process.cwd()
): Promise<{ html: string; css: string }> {
  let logoHtml = "";
  if (cover.logo) {
    const resolvedLogo = await resolveImage(cover.logo, baseDir);
    const src = resolvedLogo ? resolvedLogo.dataUri : cover.logo;
    const widthStyle = cover.logoWidth
      ? `max-width: ${typeof cover.logoWidth === "number" ? cover.logoWidth + "px" : cover.logoWidth}; max-height: 80px; width: auto; height: auto;`
      : "max-height: 60px; max-width: 180px; width: auto; height: auto;";
    logoHtml = `<div class="cover-logo"><img src="${src}" alt="Logo" style="${widthStyle} object-fit: contain;" /></div>`;
  }

  const badgeHtml = cover.badge
    ? `<div class="cover-badge" style="${cover.badgeColor ? `background-color: ${cover.badgeColor};` : ""}${cover.badgeTextColor ? `color: ${cover.badgeTextColor};` : ""}">${escapeHtml(cover.badge)}</div>`
    : "";

  const titleHtml = `<h1 class="cover-title">${escapeHtml(cover.title)}</h1>`;
  const subtitleHtml = cover.subtitle ? `<div class="cover-subtitle">${escapeHtml(cover.subtitle)}</div>` : "";

  const metaItems: string[] = [];
  if (cover.company) metaItems.push(`<div class="cover-meta-item"><span class="cover-meta-label">Organization:</span> <span class="cover-meta-value">${escapeHtml(cover.company)}</span></div>`);
  if (cover.author) metaItems.push(`<div class="cover-meta-item"><span class="cover-meta-label">Author:</span> <span class="cover-meta-value">${escapeHtml(cover.author)}</span></div>`);
  if (cover.version) metaItems.push(`<div class="cover-meta-item"><span class="cover-meta-label">Version:</span> <span class="cover-meta-value">${escapeHtml(cover.version)}</span></div>`);
  if (cover.date) metaItems.push(`<div class="cover-meta-item"><span class="cover-meta-label">Date:</span> <span class="cover-meta-value">${escapeHtml(cover.date)}</span></div>`);

  const metaHtml = metaItems.length > 0 ? `<div class="cover-meta">${metaItems.join("\n")}</div>` : "";
  const footerHtml = cover.footerText ? `<div class="cover-footer-text">${escapeHtml(cover.footerText)}</div>` : "";

  const css = `
  .markforge-cover {
    min-height: 100vh;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 4rem 3.5rem;
    page-break-after: always;
    break-after: page;
    position: relative;
    z-index: 2;
    background: ${cover.bgGradient || "#FFFFFF"};
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    color: ${cover.textColor || "#0F172A"};
  }
  .markforge-cover.cover-modern {
    border-top: 8px solid #0D998D;
  }
  .markforge-cover.cover-corporate-split {
    border-left: 12px solid #0D998D;
  }
  .markforge-cover.cover-card {
    background: #F8FAFC;
  }
  .cover-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
  }
  .cover-badge {
    display: inline-block;
    padding: 0.35rem 0.85rem;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background-color: #ECFDFD;
    color: #0D998D;
    border-radius: 4px;
    border: 1px solid #33CDCF;
  }
  .cover-body {
    margin: auto 0;
  }
  .cover-title {
    font-size: 2.8rem;
    font-weight: 800;
    line-height: 1.15;
    margin: 0 0 1rem 0;
    color: inherit;
  }
  .cover-subtitle {
    font-size: 1.35rem;
    font-weight: 400;
    color: #64748B;
    margin: 0 0 2rem 0;
    line-height: 1.4;
  }
  .cover-meta {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    border-top: 1.5px solid #E2E8F0;
    padding-top: 1.5rem;
    max-width: 480px;
  }
  .cover-meta-item {
    font-size: 0.92rem;
    display: flex;
    gap: 0.75rem;
  }
  .cover-meta-label {
    font-weight: 600;
    color: #64748B;
    min-width: 110px;
  }
  .cover-meta-value {
    font-weight: 500;
    color: #0F172A;
  }
  .cover-bottom {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-size: 0.82rem;
    color: #94A3B8;
  }
  @media print {
    .markforge-cover {
      page-break-after: always;
      break-after: page;
      height: 100vh;
      min-height: 100vh;
      max-height: 100vh;
      box-sizing: border-box;
      overflow: hidden;
      margin: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
  `;

  const html = `  <section class="markforge-cover cover-${cover.preset}">
    <div class="cover-top">
      ${logoHtml}
      ${badgeHtml}
    </div>
    <div class="cover-body">
      ${titleHtml}
      ${subtitleHtml}
      ${metaHtml}
    </div>
    <div class="cover-bottom">
      ${footerHtml}
    </div>
  </section>\n`;

  return { html, css };
}

/**
 * Renders the Back Cover / Closing Page HTML & CSS.
 */
export async function renderBackCoverHtml(
  backCover: NormalizedBackCover,
  baseDir: string = process.cwd()
): Promise<{ html: string; css: string }> {
  let logoHtml = "";
  if (backCover.logo) {
    const resolved = await resolveImage(backCover.logo, baseDir);
    const src = resolved ? resolved.dataUri : backCover.logo;
    const widthStyle = backCover.logoWidth
      ? `style="width: ${typeof backCover.logoWidth === "number" ? `${backCover.logoWidth}px` : backCover.logoWidth}; max-width: 100%;"`
      : `style="max-width: 160px; height: auto;"`;
    logoHtml = `<div class="back-logo"><img src="${src}" alt="Brand Logo" ${widthStyle} /></div>`;
  }

  const badgeHtml = backCover.badge
    ? `<div class="back-badge" style="${backCover.badgeColor ? `background-color: ${backCover.badgeColor};` : ""}${backCover.badgeTextColor ? `color: ${backCover.badgeTextColor};` : ""}">${escapeHtml(backCover.badge)}</div>`
    : "";

  const titleHtml = `<h1 class="back-title">${escapeHtml(backCover.title)}</h1>`;
  const subtitleHtml = backCover.subtitle ? `<div class="back-subtitle">${escapeHtml(backCover.subtitle)}</div>` : "";

  const contactItems: string[] = [];
  if (backCover.company) contactItems.push(`<div class="back-contact-item"><span class="back-contact-label">Organization:</span> <span class="back-contact-value">${escapeHtml(backCover.company)}</span></div>`);
  if (backCover.address) contactItems.push(`<div class="back-contact-item"><span class="back-contact-label">Address:</span> <span class="back-contact-value">${escapeHtml(backCover.address)}</span></div>`);
  if (backCover.email) contactItems.push(`<div class="back-contact-item"><span class="back-contact-label">Email:</span> <a href="mailto:${escapeHtml(backCover.email)}" class="back-contact-link">${escapeHtml(backCover.email)}</a></div>`);
  if (backCover.phone) contactItems.push(`<div class="back-contact-item"><span class="back-contact-label">Phone:</span> <span class="back-contact-value">${escapeHtml(backCover.phone)}</span></div>`);
  if (backCover.website) contactItems.push(`<div class="back-contact-item"><span class="back-contact-label">Website:</span> <a href="${escapeHtml(backCover.website)}" target="_blank" class="back-contact-link">${escapeHtml(backCover.website)}</a></div>`);

  if (backCover.social) {
    for (const [network, url] of Object.entries(backCover.social)) {
      if (url) {
        contactItems.push(`<div class="back-contact-item"><span class="back-contact-label">${escapeHtml(network.toUpperCase())}:</span> <a href="${escapeHtml(url)}" target="_blank" class="back-contact-link">${escapeHtml(url)}</a></div>`);
      }
    }
  }

  const contactHtml = contactItems.length > 0 ? `<div class="back-contact-grid">${contactItems.join("\n")}</div>` : "";
  const copyrightHtml = backCover.copyright ? `<div class="back-copyright">${escapeHtml(backCover.copyright)}</div>` : "";

  const isDark = backCover.preset === "corporate";
  const css = `
  .markforge-back-cover {
    min-height: 100vh;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 4rem 3.5rem;
    page-break-before: always;
    break-before: page;
    position: relative;
    z-index: 2;
    background: ${backCover.bgGradient || (isDark ? "#0F172A" : "#FFFFFF")};
    color: ${backCover.textColor || (isDark ? "#F8FAFC" : "#0F172A")};
  }
  .markforge-back-cover.back-modern {
    border-bottom: 8px solid #0D998D;
  }
  .markforge-back-cover.back-corporate {
    border-left: 12px solid #33CDCF;
  }
  .markforge-back-cover.back-card {
    background: #F8FAFC;
  }
  .back-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
  }
  .back-badge {
    display: inline-block;
    padding: 0.35rem 0.85rem;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background-color: #ECFDFD;
    color: #0D998D;
    border-radius: 4px;
    border: 1px solid #33CDCF;
  }
  .back-body {
    margin: auto 0;
  }
  .back-title {
    font-size: 2.6rem;
    font-weight: 800;
    line-height: 1.15;
    margin: 0 0 0.75rem 0;
    color: inherit;
  }
  .back-subtitle {
    font-size: 1.25rem;
    font-weight: 400;
    color: ${isDark ? "#94A3B8" : "#64748B"};
    margin: 0 0 2rem 0;
    line-height: 1.4;
  }
  .back-contact-grid {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    border-top: 1.5px solid ${isDark ? "#334155" : "#E2E8F0"};
    padding-top: 1.5rem;
    max-width: 540px;
  }
  .back-contact-item {
    font-size: 0.92rem;
    display: flex;
    gap: 0.75rem;
  }
  .back-contact-label {
    font-weight: 600;
    color: ${isDark ? "#94A3B8" : "#64748B"};
    min-width: 110px;
  }
  .back-contact-link {
    color: #0D998D;
    text-decoration: none;
    font-weight: 600;
  }
  .back-contact-link:hover {
    text-decoration: underline;
  }
  .back-copyright {
    font-size: 0.82rem;
    color: ${isDark ? "#64748B" : "#94A3B8"};
    border-top: 1px solid ${isDark ? "#1E293B" : "#F1F5F9"};
    padding-top: 1rem;
    margin-top: 2rem;
  }
  @media print {
    .markforge-back-cover {
      page: back-cover-page;
      page-break-before: always;
      break-before: page;
      page-break-after: avoid;
      break-after: avoid;
      min-height: 100vh;
      height: 100vh;
      max-height: 100vh;
      margin: 0;
      box-sizing: border-box;
      overflow: hidden;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
  `;

  const html = `  <section class="markforge-back-cover back-${backCover.preset}">
    <div class="back-top">
      ${logoHtml}
      ${badgeHtml}
    </div>
    <div class="back-body">
      ${titleHtml}
      ${subtitleHtml}
      ${contactHtml}
    </div>
    ${copyrightHtml}
  </section>\n`;

  return { html, css };
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

  // Multi-Columns and Footnotes CSS
  const extraCss = `
  .markforge-columns {
    display: grid;
    grid-template-columns: repeat(var(--cols, 2), minmax(0, 1fr));
    gap: var(--col-gap, 1.5rem);
    margin: 1.5rem 0;
  }
  .markforge-col {
    min-width: 0;
  }
  .markforge-fnref {
    text-decoration: none;
    font-size: 0.8em;
    vertical-align: super;
    color: #0D998D;
    font-weight: 700;
  }
  .markforge-footnotes {
    margin-top: 3rem;
    padding-top: 1rem;
    font-size: 0.88rem;
    color: #64748B;
  }
  .markforge-footnotes hr {
    border: 0;
    border-top: 1px solid #E2E8F0;
    margin-bottom: 1rem;
  }
  .markforge-fn-return {
    text-decoration: none;
    color: #0D998D;
  }
  .math-block {
    margin: 1.5rem 0;
    text-align: center;
    overflow-x: auto;
  }
  `;

  let coverHtml = "";
  let coverCss = "";
  if (resolved.coverPage && resolved.coverPage.enabled) {
    const coverRes = await renderCoverPageHtml(resolved.coverPage, baseDir);
    coverHtml = coverRes.html;
    coverCss = coverRes.css;
  }

  let backHtml = "";
  let backCss = "";
  if (resolved.backCover && resolved.backCover.enabled) {
    const backRes = await renderBackCoverHtml(resolved.backCover, baseDir);
    backHtml = backRes.html;
    backCss = backRes.css;
  }

  let bodyHtml = "";

  // 1. Header Area if title exists and NO cover page
  if (resolved.title && !resolved.coverPage?.enabled) {
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

  // 1.5 Apply heading numbering if configured
  if (resolved.numberHeadings?.enabled !== false && resolved.numberHeadings) {
    applyHeadingNumbering(doc.nodes, doc.tocEntries, resolved.numberHeadings);
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

  // 3. Render AST Nodes with dynamic token interpolation
  const mergedTokens: Record<string, unknown> = {
    ...config.metadata,
    ...doc.metadata,
    ...(resolved as unknown as Record<string, unknown>),
    title: resolved.title,
    subtitle: resolved.subtitle,
    author: resolved.author,
    version: resolved.version,
    date: resolved.date,
    company: resolved.company,
  };
  const nodesHtml = await renderNodesToHtml(doc.nodes, resolved, baseDir, mergedTokens);
  bodyHtml += `  <main class="markforge-content-body">\n${nodesHtml}  </main>\n`;

  // 3.5 Footnotes Section
  let footnotesHtml = "";
  if (doc.footnoteDefs && doc.footnoteDefs.length > 0) {
    let fnListHtml = "";
    for (const def of doc.footnoteDefs) {
      const defInner = await renderInlinesToHtml(def.inlines, baseDir, mergedTokens);
      fnListHtml += `    <li id="fn-${escapeHtml(def.id)}">${defInner} <a href="#fnref-${escapeHtml(def.id)}" class="markforge-fn-return">&#8617;</a></li>\n`;
    }
    footnotesHtml = `\n  <footer class="markforge-footnotes">\n    <hr />\n    <ol>\n${fnListHtml}    </ol>\n  </footer>\n`;
  }

  // 4. Watermark if enabled
  let watermarkCss = "";
  let watermarkHtml = "";
  if (resolved.watermark) {
    const wm = resolved.watermark;
    watermarkCss = `
  .document-watermark {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    user-select: none;
    -webkit-user-select: none;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .document-container {
    position: relative;
    z-index: 1;
  }
  @media print {
    .document-watermark {
      display: none !important;
    }
  }
  `;

    watermarkHtml = `  <div id="markforge-watermark" class="document-watermark" aria-hidden="true"></div>
  <script>
  (function() {
    try {
      var canvas = document.createElement('canvas');
      var dpr = 2;
      var width = 1200;
      var height = 1600;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      var ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.translate(width / 2, height / 2);
        ctx.rotate((-Math.abs(${wm.rotate || 45}) * Math.PI) / 180);
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

  // 5. Signatures
  let signaturesHtml = "";
  let signaturesCss = "";

  if (resolved.signatures && resolved.signatures.items.length > 0) {
    const sig = resolved.signatures;
    const numItems = sig.items.length;

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
${KATEX_INLINE_CSS}
${extraCss}
${coverCss}
${backCss}
${customCss}
${inlinedCss}
${watermarkCss}
${signaturesCss}
  </style>
</head>
<body>
${watermarkHtml}${coverHtml}  <div class="document-container">
${bodyHtml}${footnotesHtml}${signaturesHtml}  </div>
  ${mermaidScript}
${backHtml}</body>
</html>`;
}
