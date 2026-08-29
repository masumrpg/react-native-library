import katex from "katex";

export interface MathRenderResult {
  html: string;
  isBlock: boolean;
  rawLatex: string;
}

/**
 * Renders a LaTeX math formula into clean HTML/MathML markup using KaTeX.
 */
export function renderMathToHtml(latex: string, displayMode: boolean = false): string {
  try {
    return katex.renderToString(latex.trim(), {
      displayMode,
      throwOnError: false,
      output: "htmlAndMathml",
      strict: false,
    });
  } catch {
    // Fallback if KaTeX encounters parsing error
    return `<span class="katex-fallback">${latex}</span>`;
  }
}

/**
 * Minimal inlined KaTeX CSS required for rendering formulas without external network requests.
 */
export const KATEX_INLINE_CSS = `
.katex { font: normal 1.21em KaTeX_Main, Times New Roman, serif; line-height: 1.2; text-indent: 0; text-rendering: auto; border-color: currentColor; }
.katex * { -ms-high-contrast-adjust: none !important; }
.katex .katex-html { display: inline-block; }
.katex .katex-mathml { clip: rect(1px, 1px, 1px, 1px); border: 0; height: 1px; overflow: hidden; padding: 0; position: absolute; width: 1px; }
.katex-display { display: block; margin: 1em 0; text-align: center; }
.katex-display > .katex { display: inline-block; text-align: initial; }
.katex .base { position: relative; white-space: nowrap; width: min-content; }
.katex .strut { display: inline-block; }
.katex .mord { display: inline-block; }
.katex .mbin { display: inline-block; }
.katex .mrel { display: inline-block; }
.katex .mopen { display: inline-block; }
.katex .mclose { display: inline-block; }
.katex .mpunct { display: inline-block; }
.katex .minner { display: inline-block; }
.katex .mop { display: inline-block; }
.katex .frac-line { width: 100%; border-bottom-style: solid; }
.katex .vlist-t { display: inline-table; table-layout: fixed; }
.katex .vlist-r { display: table-row; }
.katex .vlist { display: table-cell; vertical-align: bottom; position: relative; }
.katex .msupsub { text-align: left; }
.katex .sqrt > .root { margin-left: 0.27777778em; margin-right: -0.55555556em; }
`;
