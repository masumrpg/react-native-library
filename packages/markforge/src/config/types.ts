export type MarkforgeFormat = "docx" | "pdf" | "html" | "png";

export type MarkforgeTheme =
  | "default"
  | "academic"
  | "github"
  | "corporate"
  | "minimal"
  | "dracula"
  | (string & {});

export type DocumentOrientation = "portrait" | "landscape";

export type PaperSize = "A4" | "Letter" | "Legal" | "A3" | "A5";

export interface PageMargins {
  top?: string | number;
  bottom?: string | number;
  left?: string | number;
  right?: string | number;
}

export interface HeaderFooterItem {
  left?: string;
  center?: string;
  right?: string;
  font?: string;
  size?: number;
  color?: string;
  divider?: boolean;
}

export interface WatermarkOptions {
  text: string;
  color?: string;
  opacity?: number;
  fontSize?: number;
  rotate?: number;
  position?: "diagonal" | "center" | "top-right" | "bottom-right";
}

export interface FrontmatterMetadata {
  title?: string;
  subtitle?: string;
  author?: string | string[];
  date?: string;
  version?: string;
  theme?: MarkforgeTheme;
  orientation?: DocumentOrientation;
  paperSize?: PaperSize;
  margins?: PageMargins;
  header?: HeaderFooterItem;
  footer?: HeaderFooterItem;
  toc?: boolean;
  watermark?: string | WatermarkOptions | false;
  css?: string | string[];
  coverPage?: boolean;
  lang?: string;
  [key: string]: unknown;
}

export interface MarkforgeConfig {
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
   * Built-in visual theme name.
   * @default "default"
   */
  theme?: MarkforgeTheme;

  /**
   * Path(s) to custom CSS stylesheets to inject into the document.
   */
  css?: string | string[];

  /**
   * Page orientation.
   * @default "portrait"
   */
  orientation?: DocumentOrientation;

  /**
   * Paper size.
   * @default "A4"
   */
  paperSize?: PaperSize;

  /**
   * Custom page margins.
   */
  margins?: PageMargins;

  /**
   * Header template configuration.
   */
  header?: HeaderFooterItem;

  /**
   * Footer template configuration.
   */
  footer?: HeaderFooterItem;

  /**
   * Whether to automatically generate a Table of Contents (TOC).
   * @default false
   */
  toc?: boolean;

  /**
   * Optional watermark configuration to display across pages.
   * By default, no watermark is displayed.
   */
  watermark?: string | WatermarkOptions | false;

  /**
   * Whether to embed all images (local and remote) directly into the document.
   * @default true
   */
  embedImages?: boolean;

  /**
   * Custom metadata overrides for title, author, date, etc.
   */
  metadata?: Partial<FrontmatterMetadata>;

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

  /**
   * Whether to generate standalone self-contained HTML bundle.
   * @default true
   */
  bundleHtml?: boolean;

  /**
   * Code syntax highlighting theme.
   * @default "github-dark"
   */
  syntaxTheme?: string;
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
