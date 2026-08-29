export { compileMarkdown, compileMarkdown as markforge, formatServerTimestamp } from "./core/engine.js";
export { parseMarkdownDocument, parseMarkdown, parseInlineSpans, slugify } from "./core/parser.js";
export type {
  MarkdownNodeType,
  MarkdownInlineSpan,
  MarkdownASTNode,
  ParsedMarkdownDocument,
  FootnoteDefinition,
} from "./core/parser.js";

export { buildDocxDocument, parseMarginToTwip } from "./core/docx/docxBuilder.js";
export { buildHtmlDocument, escapeHtml, renderInlinesToHtml, renderNodesToHtml, renderCoverPageHtml, renderBackCoverHtml } from "./core/html/htmlBuilder.js";
export { buildPdfDocument, injectPagedMediaStyles, findChromeExecutable } from "./core/pdf/pdfBuilder.js";
export { resolveImage, inlineHtmlImages, getMimeType } from "./core/imageResolver.js";
export type { ResolvedImage } from "./core/imageResolver.js";
export { tokenizeCodeLine, highlightCodeToHtml, SYNTAX_COLORS } from "./core/syntax/syntaxHighlighter.js";
export type { SyntaxToken } from "./core/syntax/syntaxHighlighter.js";
export { renderMermaidToPng } from "./core/mermaid/mermaidRenderer.js";
export { renderMathToHtml, KATEX_INLINE_CSS } from "./core/math/mathRenderer.js";
export { THEMES, THEME_DEFAULT, THEME_CORPORATE, generateThemeCss } from "./core/html/htmlThemes.js";

export { startPreviewServer } from "./server/previewServer.js";
export type { PreviewServerOptions, PreviewServerInstance } from "./server/previewServer.js";

export { defineConfig } from "./config/defineConfig.js";
export { loadConfig, DEFAULT_CONFIG } from "./config/loadConfig.js";
export {
  resolveDocumentConfig,
  replaceDocumentTokens,
  normalizeWatermark,
  normalizeSignatures,
  normalizeHeaderFooter,
  normalizeHeaderFooterSlot,
  normalizeCoverPage,
  normalizeBackCover,
  normalizeNumberHeadings,
  normalizeSecurity,
  PAPER_DIMENSIONS_TWIP,
} from "./config/resolveConfig.js";
export type {
  ResolvedDocumentConfig,
  NormalizedMargins,
  NormalizedWatermark,
  NormalizedHeaderFooter,
  NormalizedHeaderFooterZone,
  NormalizedSignatureItem,
  NormalizedSignatureBlock,
  NormalizedCoverPage,
  NormalizedBackCover,
  NormalizedNumberHeadings,
  NormalizedSecurity,
} from "./config/resolveConfig.js";
export {
  OutputFormat,
  Theme,
  Orientation,
  PaperSizeEnum,
  SyntaxTheme,
  WatermarkPosition,
} from "./config/types.js";
export type {
  ThemeProps,
  HeaderFooterSlot,
  MarkforgeConfig,
  MarkforgeFormat,
  MarkforgeTheme,
  DocumentOrientation,
  PaperSize,
  PageMargins,
  HeaderFooterItem,
  DocumentMetadata,
  DocumentLayoutConfig,
  FrontmatterMetadata,
  WatermarkOptions,
  SignatureAlign,
  SignatureStyle,
  SignatureItem,
  SignatureBlockConfig,
  CoverPagePreset,
  CoverPageConfig,
  BackCoverPreset,
  BackCoverSocial,
  BackCoverConfig,
  NumberHeadingsConfig,
  SecurityConfig,
  PdfPermissions,
  GeneratedOutputFile,
  CompilationResult,
} from "./config/types.js";

export { MARKFORGE_VERSION, getMarkforgeVersion } from "./version.js";
