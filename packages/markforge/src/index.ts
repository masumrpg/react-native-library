export { compileMarkdown, compileMarkdown as markforge, formatServerTimestamp } from "./core/engine.js";
export { parseMarkdownDocument, parseInlineSpans, slugify } from "./core/parser.js";
export type {
  MarkdownNodeType,
  MarkdownInlineSpan,
  MarkdownASTNode,
  ParsedMarkdownDocument,
} from "./core/parser.js";

export { buildDocxDocument, parseMarginToTwip } from "./core/docx/docxBuilder.js";
export { buildHtmlDocument, escapeHtml, renderInlinesToHtml } from "./core/html/htmlBuilder.js";
export { buildPdfDocument, injectPagedMediaStyles, findChromeExecutable } from "./core/pdf/pdfBuilder.js";
export { resolveImage, inlineHtmlImages, getMimeType } from "./core/imageResolver.js";
export type { ResolvedImage } from "./core/imageResolver.js";
export { tokenizeCodeLine, highlightCodeToHtml, SYNTAX_COLORS } from "./core/syntax/syntaxHighlighter.js";
export type { SyntaxToken } from "./core/syntax/syntaxHighlighter.js";
export { renderMermaidToPng } from "./core/mermaid/mermaidRenderer.js";
export { THEMES, THEME_DEFAULT, THEME_ACADEMIC } from "./core/html/htmlThemes.js";

export { defineConfig } from "./config/defineConfig.js";
export { loadConfig, DEFAULT_CONFIG } from "./config/loadConfig.js";
export type {
  MarkforgeConfig,
  MarkforgeFormat,
  MarkforgeTheme,
  DocumentOrientation,
  PaperSize,
  PageMargins,
  HeaderFooterItem,
  FrontmatterMetadata,
  WatermarkOptions,
  GeneratedOutputFile,
  CompilationResult,
} from "./config/types.js";

export { MARKFORGE_VERSION, getMarkforgeVersion } from "./version.js";
