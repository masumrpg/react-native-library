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
.table-of-contents { background: var(--mf-card-bg); border: 1px solid var(--mf-border); border-radius: 8px; padding: 1.5rem 2rem; margin: 2rem 0; }
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
 * Default theme — full design system with Blu-by-BCA-Digital cyan palette.
 */
export const THEME_DEFAULT = `
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
  --mf-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  --mf-font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
body { background-color: var(--mf-bg); color: var(--mf-text); font-family: var(--mf-font-family); font-size: 15px; line-height: 1.65; margin: 0; padding: 2.5rem; }
.document-container { max-width: 860px; margin: 0 auto; }
h1, h2, h3, h4, h5, h6 { color: var(--mf-text); font-weight: 700; margin-top: 1.8rem; margin-bottom: 0.8rem; line-height: 1.25; }
h1 { font-size: 2.2rem; border-bottom: 2px solid #33CDCF; padding-bottom: 0.5rem; }
h2 { font-size: 1.6rem; color: #009DA0; border-bottom: 1px solid #CCFBF1; padding-bottom: 0.4rem; }
h3 { font-size: 1.3rem; }
h4 { font-size: 1.1rem; }
p  { margin: 0.8rem 0; }
`;

/**
 * Academic theme — serif typography for formal papers/reports.
 */
export const THEME_ACADEMIC = `
:root {
  --mf-bg: #ffffff;
  --mf-text: #1a1a1a;
  --mf-text-muted: #555;
  --mf-primary: #33CDCF;
  --mf-primary-dark: #009DA0;
  --mf-primary-light: #ECFDFD;
  --mf-border: #ccc;
  --mf-card-bg: #f9f9f9;
  --mf-code-bg: #1e1e1e;
  --mf-code-text: #d4d4d4;
  --mf-font-family: "Merriweather", "Georgia", "Times New Roman", serif;
  --mf-font-mono: "Courier New", Courier, monospace;
}
body { font-family: var(--mf-font-family); font-size: 16px; line-height: 1.8; padding: 3rem; color: var(--mf-text); }
.document-container { max-width: 780px; margin: 0 auto; text-align: justify; }
h1, h2, h3 { font-family: "Times New Roman", Times, serif; font-weight: bold; text-align: left; }
h1 { font-size: 2rem; border-bottom: 1px solid #000; padding-bottom: 0.3rem; }
h2 { font-size: 1.4rem; border-bottom: 1px solid #ccc; padding-bottom: 0.2rem; }
h3 { font-size: 1.2rem; }
p  { margin: 0.9rem 0; }
`;

export const THEMES: Record<string, string> = {
  default:   THEME_DEFAULT,
  academic:  THEME_ACADEMIC,
  github:    THEME_DEFAULT,
  corporate: THEME_DEFAULT,
  minimal:   THEME_DEFAULT,
  dracula:   THEME_DEFAULT,
};
