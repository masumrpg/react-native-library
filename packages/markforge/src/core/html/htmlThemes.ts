export interface ThemeDefinition {
  name: string;
  css: string;
}

/**
 * Shared component styles — always injected regardless of chosen theme.
 * Covers: callouts, blockquotes, code blocks, tables, images, TOC, document header, print.
 */
export const THEME_COMPONENTS = `
/* Fallback CSS variables — overridden by each named theme's :root block */
:root {
  --mf-bg: #ffffff;
  --mf-text: #0f172a;
  --mf-text-muted: #64748b;
  --mf-primary: #33CDCF;
  --mf-primary-dark: #009DA0;
  --mf-primary-light: #ECFDFD;
  --mf-border: #e2e8f0;
  --mf-card-bg: #f8fafc;
  --mf-code-bg: #0f172a;
  --mf-code-text: #f8fafc;
  --mf-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --mf-font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

/* Document header */
.document-header { margin-bottom: 2.5rem; padding-bottom: 1.5rem; border-bottom: 2px solid var(--mf-border); }
.document-title { font-size: 2.5rem; font-weight: 800; margin: 0 0 0.5rem 0; }
.document-subtitle { font-size: 1.25rem; color: var(--mf-text-muted); margin: 0 0 1rem 0; }
.document-meta { font-size: 0.9rem; color: var(--mf-text-muted); display: flex; gap: 1.5rem; flex-wrap: wrap; }

/* Table of Contents */
.table-of-contents {
  background: var(--mf-card-bg);
  border: 1px solid var(--mf-border);
  border-radius: 8px;
  padding: 1.5rem 2rem;
  margin: 2rem 0;
  page-break-after: always; break-after: page;
}
.table-of-contents .toc-header,
.table-of-contents h2 {
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--mf-text-muted);
  margin: 0 0 1.25rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--mf-border);
}
.table-of-contents ul,
.table-of-contents .toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.table-of-contents li,
.table-of-contents .toc-item {
  padding: 0.35rem 0;
  margin: 0;
}
.table-of-contents .toc-link {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  text-decoration: none;
  color: var(--mf-text);
  font-size: 0.95rem;
  line-height: 1.4;
}
.table-of-contents .toc-link:hover {
  color: var(--mf-primary-dark);
}
.table-of-contents .toc-level-1 {
  font-weight: 600;
}
.table-of-contents .toc-level-2 {
  font-weight: 500;
  padding-left: 1.25rem;
  opacity: 0.95;
}
.table-of-contents .toc-level-3 {
  font-weight: 400;
  padding-left: 2.5rem;
  opacity: 0.85;
}
.table-of-contents .toc-title {
  flex-shrink: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 80%;
}
.table-of-contents .toc-dots {
  flex-grow: 1;
  border-bottom: 1.5px dotted var(--mf-border, #94a3b8);
  margin: 0 0.5rem 0.25rem 0.5rem;
  min-width: 1.5rem;
  opacity: 0.65;
}
.table-of-contents .toc-page {
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  color: var(--mf-primary-dark);
  text-align: right;
  min-width: 1.5rem;
}

/* Links */
a { color: var(--mf-primary-dark); font-weight: 600; text-decoration: none; }
a:hover { text-decoration: underline; }

/* Blockquote */
blockquote { border-left: 4px solid var(--mf-primary); background-color: var(--mf-card-bg); margin: 1.2rem 0; padding: 0.8rem 1.2rem; border-radius: 0 8px 8px 0; color: #334155; font-style: italic; }

/* Callout / Alert Boxes */
.callout { border-left: 4px solid var(--mf-primary); background: var(--mf-card-bg); border-radius: 6px; padding: 1rem 1.2rem; margin: 1.2rem 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.callout-title { font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem; }
.callout-NOTE      { border-color: #33CDCF; background: #ECFDFD; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.callout-NOTE      .callout-title { color: #009DA0; }
.callout-TIP       { border-color: #10b981; background: #ecfdf5; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.callout-TIP       .callout-title { color: #10b981; }
.callout-WARNING   { border-color: #f59e0b; background: #fffbeb; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.callout-WARNING   .callout-title { color: #f59e0b; }
.callout-CAUTION   { border-color: #ef4444; background: #fef2f2; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.callout-CAUTION   .callout-title { color: #ef4444; }
.callout-IMPORTANT { border-color: #8b5cf6; background: #f5f3ff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.callout-IMPORTANT .callout-title { color: #8b5cf6; }

/* Inline Code */
code { font-family: var(--mf-font-mono); font-size: 0.88em; background-color: #f1f5f9; padding: 0.2em 0.4em; border-radius: 4px; color: #0f172a; }

/* Code Blocks */
pre { background-color: var(--mf-code-bg); color: var(--mf-code-text); padding: 1.2rem; border-radius: 8px; overflow-x: auto; font-family: var(--mf-font-mono); font-size: 0.9rem; line-height: 1.5; margin: 1.2rem 0; }
pre code { background-color: transparent; color: inherit; padding: 0; }

/* Tables */
table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.95rem; }
th, td { border: 1px solid var(--mf-border); padding: 0.75rem 1rem; text-align: left; }
th { background-color: var(--mf-card-bg); font-weight: 600; color: #0f172a; }
tr:nth-child(even) { background-color: var(--mf-card-bg); }

/* Images */
img { max-width: 100%; height: auto; border-radius: 6px; margin: 1rem 0; }

/* Dividers */
hr { border: none; border-top: 1px solid var(--mf-border); margin: 2rem 0; }

/* Print / PDF */
@media print {
  body { padding: 0; }
  .document-container { max-width: 100%; }
  h1, h2, h3, h4, h5, h6 { break-after: avoid; page-break-after: avoid; break-inside: avoid; }
  pre, table, blockquote, .callout { break-inside: avoid; }
  /* Remove scrollbars — PDF has no scrolling */
  pre { overflow: visible; white-space: pre-wrap; overflow-wrap: break-word; word-break: break-word; }
  code { overflow-wrap: break-word; word-break: break-word; }
}
`;

/**
 * Flagship corporate theme — full design system with Blu-by-BCA-Digital cyan palette.
 */
export const THEME_CORPORATE = `
:root {
  --mf-bg: #ffffff;
  --mf-text: #0f172a;
  --mf-text-muted: #64748b;
  --mf-primary: #33CDCF;
  --mf-primary-dark: #009DA0;
  --mf-primary-light: #ECFDFD;
  --mf-border: #e2e8f0;
  --mf-card-bg: #f8fafc;
  --mf-code-bg: #0f172a;
  --mf-code-text: #f8fafc;
  --mf-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --mf-font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
body { background-color: var(--mf-bg); color: var(--mf-text); font-family: var(--mf-font-family); font-size: 15px; line-height: 1.65; margin: 0; padding: 2.5rem; }
.document-container { max-width: 860px; margin: 0 auto; position: relative; z-index: 1; }
h1, h2, h3, h4, h5, h6 { color: var(--mf-primary-dark); font-weight: 700; margin-top: 1.8rem; margin-bottom: 0.8rem; line-height: 1.25; }
h1 { font-size: 2.2rem; color: var(--mf-primary-dark); border-bottom: 2.5px solid var(--mf-primary); padding-bottom: 0.5rem; }
h2 { font-size: 1.6rem; color: var(--mf-primary-dark); border-bottom: 1px solid #CCFBF1; padding-bottom: 0.4rem; }
h3 { font-size: 1.3rem; color: var(--mf-primary-dark); }
h4 { font-size: 1.1rem; color: var(--mf-primary-dark); }
h5 { font-size: 1.0rem; color: var(--mf-primary-dark); }
h6 { font-size: 0.9rem; color: var(--mf-primary-dark); }
p  { margin: 0.8rem 0; }
`;

export const THEME_DEFAULT = THEME_CORPORATE;

export const THEME_ACADEMIC = `
:root {
  --mf-bg: #ffffff;
  --mf-text: #1a1a1a;
  --mf-text-muted: #555555;
  --mf-primary: #1e3a8a;
  --mf-primary-dark: #0f172a;
  --mf-primary-light: #f1f5f9;
  --mf-border: #cbd5e1;
  --mf-card-bg: #f8fafc;
  --mf-code-bg: #1e1e1e;
  --mf-code-text: #d4d4d4;
  --mf-font-family: Georgia, Cambria, "Times New Roman", Times, serif;
  --mf-font-mono: "Courier New", Courier, monospace;
}
body { background-color: var(--mf-bg); color: var(--mf-text); font-family: var(--mf-font-family); font-size: 15px; line-height: 1.75; margin: 0; padding: 2.5rem; text-align: justify; }
.document-container { max-width: 800px; margin: 0 auto; position: relative; z-index: 1; }
h1, h2, h3, h4, h5, h6 { color: var(--mf-primary-dark); font-family: var(--mf-font-family); font-weight: 700; margin-top: 2rem; margin-bottom: 0.8rem; line-height: 1.3; text-align: left; }
h1 { font-size: 2.2rem; color: var(--mf-primary-dark); border-bottom: 2px solid var(--mf-primary); padding-bottom: 0.5rem; }
h2 { font-size: 1.6rem; color: var(--mf-primary-dark); border-bottom: 1px solid var(--mf-border); padding-bottom: 0.4rem; }
h3 { font-size: 1.3rem; color: var(--mf-primary-dark); }
h4 { font-size: 1.1rem; color: var(--mf-primary-dark); }
h5 { font-size: 1.0rem; color: var(--mf-primary-dark); }
h6 { font-size: 0.9rem; color: var(--mf-primary-dark); }
p  { margin: 0.9rem 0; }
`;

export const THEME_GITHUB = `
:root {
  --mf-bg: #ffffff;
  --mf-text: #1f2328;
  --mf-text-muted: #656d76;
  --mf-primary: #0969da;
  --mf-primary-dark: #0550ae;
  --mf-primary-light: #ddf4ff;
  --mf-border: #d0d7de;
  --mf-card-bg: #f6f8fa;
  --mf-code-bg: #f6f8fa;
  --mf-code-text: #1f2328;
  --mf-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
  --mf-font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
body { background-color: var(--mf-bg); color: var(--mf-text); font-family: var(--mf-font-family); font-size: 15px; line-height: 1.6; margin: 0; padding: 2.5rem; }
.document-container { max-width: 896px; margin: 0 auto; position: relative; z-index: 1; }
h1, h2, h3, h4, h5, h6 { color: var(--mf-text); font-weight: 600; margin-top: 1.6rem; margin-bottom: 0.8rem; line-height: 1.25; }
h1 { font-size: 2rem; border-bottom: 1px solid var(--mf-border); padding-bottom: 0.3em; }
h2 { font-size: 1.5rem; border-bottom: 1px solid var(--mf-border); padding-bottom: 0.3em; }
h3 { font-size: 1.25rem; }
h4 { font-size: 1.0rem; }
h5 { font-size: 0.875rem; }
h6 { font-size: 0.85rem; color: var(--mf-text-muted); }
p  { margin: 0.8rem 0; }
`;

export const THEME_MINIMAL = `
:root {
  --mf-bg: #ffffff;
  --mf-text: #18181b;
  --mf-text-muted: #71717a;
  --mf-primary: #18181b;
  --mf-primary-dark: #09090b;
  --mf-primary-light: #f4f4f5;
  --mf-border: #e4e4e7;
  --mf-card-bg: #fafafa;
  --mf-code-bg: #f4f4f5;
  --mf-code-text: #18181b;
  --mf-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --mf-font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
body { background-color: var(--mf-bg); color: var(--mf-text); font-family: var(--mf-font-family); font-size: 15px; line-height: 1.7; margin: 0; padding: 2.5rem; }
.document-container { max-width: 760px; margin: 0 auto; position: relative; z-index: 1; }
h1, h2, h3, h4, h5, h6 { color: var(--mf-primary-dark); font-weight: 600; letter-spacing: -0.02em; margin-top: 2rem; margin-bottom: 0.6rem; line-height: 1.3; }
h1 { font-size: 2.1rem; }
h2 { font-size: 1.5rem; }
h3 { font-size: 1.25rem; }
h4 { font-size: 1.05rem; }
h5 { font-size: 0.95rem; }
h6 { font-size: 0.85rem; }
p  { margin: 0.8rem 0; }
`;

export const THEMES: Record<string, string> = {
  corporate: THEME_CORPORATE,
  default:   THEME_CORPORATE,
  academic:  THEME_ACADEMIC,
  github:    THEME_GITHUB,
  minimal:   THEME_MINIMAL,
};

import type { MarkforgeTheme } from "../../config/types.js";
import { Theme } from "../../config/types.js";

/**
 * Resolves theme CSS based on preset name or custom ThemeProps object.
 */
export function generateThemeCss(theme?: MarkforgeTheme): string {
  if (!theme || theme === "corporate" || theme === "default" || theme === Theme.CORPORATE || theme === Theme.DEFAULT) {
    return THEME_CORPORATE;
  }

  // If user passes a custom ThemeProps object
  if (typeof theme === "object") {
    const bg = theme.backgroundColor || "#ffffff";
    const text = theme.textColor || "#0f172a";
    const textMuted = theme.textMuted || "#64748b";
    const primary = theme.primaryColor || "#33CDCF";
    const primaryDark = theme.primaryDark || primary;
    const primaryLight = theme.primaryLight || "#ECFDFD";
    const border = theme.borderColor || "#e2e8f0";
    const cardBg = theme.cardBackground || "#f8fafc";
    const codeBg = theme.codeBackground || "#0f172a";
    const codeText = theme.codeText || "#f8fafc";
    const font = theme.fontFamily || "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    const fontMono = theme.fontMono || "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

    return `
:root {
  --mf-bg: ${bg};
  --mf-text: ${text};
  --mf-text-muted: ${textMuted};
  --mf-primary: ${primary};
  --mf-primary-dark: ${primaryDark};
  --mf-primary-light: ${primaryLight};
  --mf-border: ${border};
  --mf-card-bg: ${cardBg};
  --mf-code-bg: ${codeBg};
  --mf-code-text: ${codeText};
  --mf-font-family: ${font};
  --mf-font-mono: ${fontMono};
}
body { background-color: var(--mf-bg); color: var(--mf-text); font-family: var(--mf-font-family); font-size: 15px; line-height: 1.65; margin: 0; padding: 2.5rem; }
.document-container { max-width: 860px; margin: 0 auto; position: relative; z-index: 1; }
h1, h2, h3, h4, h5, h6 { color: var(--mf-primary-dark); font-weight: 700; margin-top: 1.8rem; margin-bottom: 0.8rem; line-height: 1.25; }
h1 { font-size: 2.2rem; color: var(--mf-primary-dark); border-bottom: 2.5px solid var(--mf-primary); padding-bottom: 0.5rem; }
h2 { font-size: 1.6rem; color: var(--mf-primary-dark); border-bottom: 1px solid var(--mf-border); padding-bottom: 0.4rem; }
h3 { font-size: 1.3rem; color: var(--mf-primary-dark); }
h4 { font-size: 1.1rem; color: var(--mf-primary-dark); }
h5 { font-size: 1.0rem; color: var(--mf-primary-dark); }
h6 { font-size: 0.9rem; color: var(--mf-primary-dark); }
p  { margin: 0.8rem 0; }
${theme.customCss || ""}
`;
  }

  const normalized = typeof theme === "string" ? theme.toLowerCase() : "";
  if (normalized && THEMES[normalized]) {
    return THEMES[normalized];
  }

  return THEME_CORPORATE;
}
