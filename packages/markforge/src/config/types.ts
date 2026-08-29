export enum OutputFormat {
  DOCX = "docx",
  PDF = "pdf",
  HTML = "html",
  PNG = "png",
}

export type MarkforgeFormat = "docx" | "pdf" | "html" | "png" | OutputFormat;

export interface ThemeProps {
  /**
   * Primary brand accent color (e.g. "#33CDCF", "#2563EB", "#7C3AED", "#E11D48").
   * @default "#33CDCF"
   */
  primaryColor?: string;

  /**
   * Dark primary tone for headings, active links, and prominent badges.
   * @default "#009DA0"
   */
  primaryDark?: string;

  /**
   * Light primary background tint for callouts and active pills.
   * @default "#ECFDFD"
   */
  primaryLight?: string;

  /**
   * Document page background color.
   * @default "#FFFFFF"
   */
  backgroundColor?: string;

  /**
   * Primary body copy text color.
   * @default "#0F172A"
   */
  textColor?: string;

  /**
   * Muted secondary text color for subtitles, dates, and footers.
   * @default "#64748B"
   */
  textMuted?: string;

  /**
   * Border color for tables, dividers, and card containers.
   * @default "#E2E8F0"
   */
  borderColor?: string;

  /**
   * Background color for cards, table headers, and blockquotes.
   * @default "#F8FAFC"
   */
  cardBackground?: string;

  /**
   * Background color for code blocks.
   * @default "#0F172A"
   */
  codeBackground?: string;

  /**
   * Text color for code blocks.
   * @default "#F8FAFC"
   */
  codeText?: string;

  /**
   * Primary body and heading font family.
   * @default "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
   */
  fontFamily?: string;

  /**
   * Monospace font family for code blocks and inline code.
   * @default "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
   */
  fontMono?: string;

  /**
   * Optional custom raw CSS styles appended directly to the stylesheet.
   */
  customCss?: string;
}

export enum Theme {
  CORPORATE = "corporate",
}

export type MarkforgeTheme = Theme | ThemeProps | "corporate" | (string & {});

export enum Orientation {
  PORTRAIT = "portrait",
  LANDSCAPE = "landscape",
}

export type DocumentOrientation = "portrait" | "landscape" | Orientation;

export enum PaperSizeEnum {
  A4 = "A4",
  LETTER = "Letter",
  LEGAL = "Legal",
  A3 = "A3",
  A5 = "A5",
}

export type PaperSize = "A4" | "Letter" | "Legal" | "A3" | "A5" | PaperSizeEnum;

export enum SyntaxTheme {
  GITHUB_DARK = "github-dark",
  GITHUB_LIGHT = "github-light",
  DRACULA = "dracula",
  MONOKAI = "monokai",
  NORD = "nord",
}

export enum WatermarkPosition {
  DIAGONAL = "diagonal",
  CENTER = "center",
  TOP_RIGHT = "top-right",
  BOTTOM_RIGHT = "bottom-right",
}

export interface PageMargins {
  top?: string | number;
  bottom?: string | number;
  left?: string | number;
  right?: string | number;
}

export interface HeaderFooterSlot {
  /**
   * Header or footer template text (supports tokens like {title}, {author}, {version}, {date}, {company}, {page}, {pages}).
   */
  text: string;

  /**
   * Custom text color for this zone (e.g. "#0D998D", "#94A3B8").
   */
  color?: string;

  /**
   * Custom font size in points (e.g. 9, 10).
   */
  fontSize?: number;

  /**
   * Custom font family for this zone (e.g. "Segoe UI", "Inter").
   */
  fontFamily?: string;

  /**
   * Whether to render this zone in bold weight.
   */
  bold?: boolean;

  /**
   * Whether to render this zone in italics.
   */
  italic?: boolean;
}

export interface HeaderFooterItem {
  left?: string | HeaderFooterSlot;
  center?: string | HeaderFooterSlot;
  right?: string | HeaderFooterSlot;
  font?: string;
  size?: number;
  color?: string;
  divider?: boolean;
  dividerColor?: string;
}

export interface WatermarkOptions {
  text: string;
  color?: string;
  opacity?: number;
  fontSize?: number;
  rotate?: number;
  position?: "diagonal" | "center" | "top-right" | "bottom-right" | WatermarkPosition;
}

/**
 * Pure document metadata dictionary (author, title, date, version, etc.).
 */
export interface DocumentMetadata {
  title?: string;
  subtitle?: string;
  author?: string | string[];
  date?: string;
  version?: string;
  company?: string;
  lang?: string;
  coverPage?: boolean;
  [key: string]: unknown;
}

export type SignatureAlign = "left" | "center" | "right" | "space-between";
export type SignatureStyle = "line" | "box" | "clean";

export interface SignatureItem {
  /**
   * Title or sign-off label above signature (e.g. "Prepared by", "Approved by", "Acknowledged by").
   */
  title?: string;

  /**
   * Signatory person name (supports metadata tokens like {author}, {company}).
   */
  name: string;

  /**
   * Signatory job title, role, or department (e.g. "Lead System Architect", "Chief Technology Officer").
   */
  role?: string;

  /**
   * Signature date string or template (e.g. "2026-08-29", "{date}", or true for auto-formatted current date).
   */
  date?: string | boolean;

  /**
   * Optional signature image path, URL, or Base64 data URI (stamp, digital seal, or handwritten signature).
   */
  image?: string;

  /**
   * Height reserved for physical handwriting signature (e.g. 60, "60px", "1.5cm").
   * @default 60
   */
  signatureHeight?: number | string;
}

export interface SignatureBlockConfig {
  /**
   * List of 1 to 4 signature slots.
   */
  items: SignatureItem[];

  /**
   * Horizontal alignment of the signature block.
   * @default "right" for 1 item, "space-between" for >= 2 items
   */
  align?: SignatureAlign;

  /**
   * Visual layout style of the signature block:
   * - "line": Traditional signature with a horizontal separator line above name.
   * - "box": Formal bordered rectangular approval card.
   * - "clean": Minimalist blank vertical space without borders.
   * @default "line"
   */
  style?: SignatureStyle;

  /**
   * Border or divider line color.
   * @default "#CBD5E1"
   */
  borderColor?: string;

  /**
   * Color of the signature title / label.
   * @default "#64748B"
   */
  titleColor?: string;

  /**
   * Color of the signatory name.
   * @default "#0F172A"
   */
  nameColor?: string;

  /**
   * Color of the role and date text.
   * @default "#64748B"
   */
  roleColor?: string;

  /**
   * Vertical spacing before the signature block (e.g. "2.5rem", 480).
   * @default "2.5rem"
   */
  spacingBefore?: number | string;
}

/**
 * Document visual & layout options (theme, orientation, margins, headers, footers, etc.).
 */
export interface DocumentLayoutConfig {
  /**
   * Built-in visual theme name.
   * @default "default"
   */
  theme?: MarkforgeTheme;

  /**
   * Page orientation.
   * @default "portrait"
   */
  orientation?: DocumentOrientation;

  /**
   * Standard paper size.
   * @default "A4"
   */
  paperSize?: PaperSize;

  /**
   * Custom page margins.
   */
  margins?: PageMargins;

  /**
   * Running header template configuration.
   */
  header?: HeaderFooterItem;

  /**
   * Running footer template configuration.
   */
  footer?: HeaderFooterItem;

  /**
   * Whether to automatically generate a Table of Contents (TOC).
   * @default false
   */
  toc?: boolean;

  /**
   * Document signature and approval block at the bottom of the document.
   * Supports 1-4 signature items, flexible alignment, and multiple styles ("line", "box", "clean").
   */
  signatures?: SignatureBlockConfig | SignatureItem[];

  /**
   * Optional watermark configuration to display across pages.
   * @default false
   */
  watermark?: string | WatermarkOptions | false;

  /**
   * Path(s) to custom CSS stylesheets to inject into the document.
   */
  css?: string | string[];

  /**
   * Code syntax highlighting theme.
   * @default "github-dark"
   */
  syntaxTheme?:
    | "github-dark"
    | "github-light"
    | "dracula"
    | "monokai"
    | "nord"
    | SyntaxTheme
    | (string & {});
}

/**
 * Complete metadata extracted from Markdown frontmatter.
 * Combines document metadata and layout overrides.
 */
export type FrontmatterMetadata = DocumentMetadata & DocumentLayoutConfig;

/**
 * Top-level MarkForge configuration (from config file, CLI, or API).
 * Clean, 100% intuitive, and zero-duplicate architecture.
 */
export interface MarkforgeConfig extends DocumentLayoutConfig {
  /**
   * Target format(s) to compile markdown to.
   * @default ["docx", "pdf"]
   */
  to?: MarkforgeFormat | MarkforgeFormat[];

  /**
   * Output directory where compiled documents will be saved.
   * Defaults to the same directory as the input file.
   */
  outputDir?: string;

  /**
   * Default document metadata (title, author, date, etc.) used when not provided in frontmatter.
   */
  metadata?: DocumentMetadata;

  /**
   * Whether to embed all images (local and remote) directly into the document.
   * @default true
   */
  embedImages?: boolean;

  /**
   * Whether to generate standalone self-contained HTML bundle.
   * @default true
   */
  bundleHtml?: boolean;

  /**
   * Watch files and automatically recompile on changes.
   * @default false
   */
  watch?: boolean;

  /**
   * Start local HTTP preview server.
   * @default false
   */
  serve?: boolean;

  /**
   * Port for the local preview server.
   * @default 4000
   */
  port?: number;

  /**
   * Automatically open the document in the default browser upon compilation.
   * @default false
   */
  open?: boolean;
}

export interface GeneratedOutputFile {
  format: MarkforgeFormat;
  filePath: string;
  fileName: string;
  sizeBytes: number;
}

export interface CompilationResult {
  inputFile: string;
  durationMs: number;
  metadata: FrontmatterMetadata;
  files: GeneratedOutputFile[];
  errors: string[];
}
