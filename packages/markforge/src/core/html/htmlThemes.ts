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
.table-of-contents { background: var(--mf-card-bg); border: 1px solid var(--mf-border); border-radius: 8px; padding: 1.5rem 2rem; margin: 2rem 0; page-break-after: always; break-after: page; }
.table-of-contents h2 { font-size: 1rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--mf-text-muted); margin: 0 0 1rem 0; }
.table-of-contents ul { list-style: none; padding: 0; margin: 0; }
.table-of-contents li { padding: 0.25rem 0; }
.table-of-contents a { color: var(--mf-primary-dark); text-decoration: none; }
.table-of-contents a:hover { text-decoration: underline; }

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
  pre, table, blockquote, .callout { break-inside: avoid; }
  /* Remove scrollbars — PDF has no scrolling */
  pre { overflow: visible; white-space: pre-wrap; word-break: break-all; }
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

export const THEMES: Record<string, string> = {
  corporate: THEME_CORPORATE,
  default:   THEME_CORPORATE,
};

import type { MarkforgeTheme } from "../../config/types.js";
import { Theme } from "../../config/types.js";

/**
 * Resolves theme CSS based on preset name or custom ThemeProps object.
 */
export function generateThemeCss(theme?: MarkforgeTheme): string {
  if (!theme || theme === "corporate" || theme === "default" || theme === Theme.CORPORATE) {
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

  if (typeof theme === "string" && THEMES[theme]) {
    return THEMES[theme];
  }

  return THEME_CORPORATE;
}
