import type React from "react";
import type {
  ParsedMarkdownDocument,
  MarkdownASTNode,
  FootnoteDefinition,
} from "../core/parser.js";
import type { ThemeProps, WatermarkOptions, FrontmatterMetadata } from "../config/types.js";
import type { ResolvedDocumentConfig } from "../config/resolveConfig.js";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface DocumentStats {
  words: number;
  characters: number;
  estimatedReadingMinutes: number;
  headingsCount: number;
  estimatedPages: number;
}

export type MarkforgeComponentOverrides = {
  heading?: React.ComponentType<{
    level: number;
    id?: string;
    children: React.ReactNode;
    node: MarkdownASTNode;
  }>;
  paragraph?: React.ComponentType<{
    children: React.ReactNode;
    node: MarkdownASTNode;
  }>;
  codeBlock?: React.ComponentType<{
    code: string;
    language?: string;
    highlightedHtml?: string;
    node: MarkdownASTNode;
  }>;
  blockquote?: React.ComponentType<{
    children: React.ReactNode;
    node: MarkdownASTNode;
  }>;
  callout?: React.ComponentType<{
    type: "NOTE" | "TIP" | "IMPORTANT" | "WARNING" | "CAUTION";
    title?: string;
    children: React.ReactNode;
    node: MarkdownASTNode;
  }>;
  table?: React.ComponentType<{
    node: MarkdownASTNode;
    children: React.ReactNode;
  }>;
  mermaid?: React.ComponentType<{
    code: string;
    node: MarkdownASTNode;
  }>;
  math?: React.ComponentType<{
    math: string;
    isBlock: boolean;
    renderedHtml?: string;
  }>;
  columns?: React.ComponentType<{
    columnsCount: number;
    gap?: string;
    children: React.ReactNode;
  }>;
  coverPage?: React.ComponentType<{
    config: ResolvedDocumentConfig;
  }>;
  backCover?: React.ComponentType<{
    config: ResolvedDocumentConfig;
  }>;
};

export interface MarkforgeDocumentProps {
  /**
   * Raw Markdown or MDX string.
   */
  markdown?: string;
  /**
   * Pre-parsed Markdown AST document. If provided, skips internal parsing.
   */
  ast?: ParsedMarkdownDocument;
  /**
   * Theme name ('corporate', 'academic', 'github', 'minimal') or custom theme configuration.
   */
  theme?: ThemeProps | string;
  /**
   * Layout mode:
   * - "continuous": Default web continuous scrolling.
   * - "paginated": Visual simulated A4 printed sheets with drop shadows and page numbers.
   */
  mode?: "continuous" | "paginated";
  /**
   * Zoom factor (e.g. 1.0 for 100%, 0.75 for 75%, 1.25 for 125%). Default is 1.0.
   */
  zoom?: number;
  /**
   * Whether to render the visual cover page if configured in frontmatter/config.
   */
  showCoverPage?: boolean;
  /**
   * Whether to render the visual back cover / closing page.
   */
  showBackCover?: boolean;
  /**
   * Whether to render the inline Table of Contents block.
   */
  showTableOfContents?: boolean;
  /**
   * Watermark text or detailed watermark configuration.
   */
  watermark?: string | WatermarkOptions | false;
  /**
   * Pluggable component overrides to customize any Markdown element.
   */
  components?: MarkforgeComponentOverrides;
  /**
   * Additional root container CSS class name.
   */
  className?: string;
  /**
   * Additional inline styles on the root container.
   */
  style?: React.CSSProperties;
}

export interface UseMarkforgeOptions {
  markdown: string;
  theme?: ThemeProps | string;
  configOverrides?: Record<string, unknown>;
}

export interface UseMarkforgeReturn {
  ast: ParsedMarkdownDocument;
  toc: TocItem[];
  stats: DocumentStats;
  metadata: FrontmatterMetadata;
  resolvedConfig: ResolvedDocumentConfig;
  footnotes: FootnoteDefinition[];
  exportPdf: (filename?: string) => Promise<Blob | null>;
  exportDocx: (filename?: string) => Promise<Blob | null>;
  exportHtml: (filename?: string) => Promise<string>;
}

export interface UseMarkforgeTocOptions {
  rootSelector?: string;
  headingSelector?: string;
  offsetPx?: number;
}

export interface UseMarkforgeTocReturn {
  activeId: string | null;
  scrollToHeading: (id: string) => void;
}
