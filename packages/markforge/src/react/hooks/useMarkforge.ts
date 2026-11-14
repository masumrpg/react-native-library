import { useMemo } from "react";
import { parseMarkdownDocument } from "../../core/parser.js";
import { resolveDocumentConfig } from "../../config/resolveConfig.js";
import type { UseMarkforgeOptions, UseMarkforgeReturn, DocumentStats, TocItem } from "../types.js";
import { buildHtmlDocument } from "../../core/html/htmlBuilder.js";

/**
 * Calculates readable document statistics from raw markdown and AST.
 */
function computeDocumentStats(markdown: string, toc: TocItem[]): DocumentStats {
  const cleanText = markdown
    .replace(/^---[\s\S]*?---/, "") // strip frontmatter
    .replace(/```[\s\S]*?```/g, "") // strip code blocks
    .replace(/<[^>]*>/g, "") // strip html tags
    .trim();

  const characters = cleanText.length;
  const words = cleanText ? (cleanText.match(/\b\S+\b/g)?.length ?? 0) : 0;
  const estimatedReadingMinutes = Math.max(1, Math.ceil(words / 200));

  // Count explicit page breaks in markdown
  const explicitBreaks = (markdown.match(/<!--\s*pagebreak\s*-->/gi) || []).length;
  const wordsBasedPages = Math.max(1, Math.ceil(words / 350));
  const estimatedPages = Math.max(wordsBasedPages, explicitBreaks + 1);

  return {
    words,
    characters,
    estimatedReadingMinutes,
    headingsCount: toc.length,
    estimatedPages,
  };
}

/**
 * Headless hook to parse Markdown, resolve configuration, extract Table of Contents,
 * compute document statistics, and provide programmatic export helpers.
 */
export function useMarkforge(options: UseMarkforgeOptions): UseMarkforgeReturn {
  const { markdown, theme, configOverrides } = options;

  const ast = useMemo(() => {
    return parseMarkdownDocument(markdown || "");
  }, [markdown]);

  const resolvedConfig = useMemo(() => {
    const rawConfig = {
      ...(configOverrides || {}),
      ...(theme && typeof theme === "string" ? { theme } : {}),
      ...(theme && typeof theme === "object" ? { theme } : {}),
    };
    return resolveDocumentConfig(ast.metadata, rawConfig);
  }, [ast.metadata, theme, configOverrides]);

  const toc: TocItem[] = useMemo(() => {
    return (ast.tocEntries || []).map((item) => ({
      id: item.id,
      text: item.text,
      level: item.level,
    }));
  }, [ast.tocEntries]);

  const stats = useMemo(() => {
    return computeDocumentStats(markdown || "", toc);
  }, [markdown, toc]);

  const exportHtml = async (_filename?: string): Promise<string> => {
    return buildHtmlDocument(ast, resolvedConfig);
  };

  const exportDocx = async (_filename?: string): Promise<Blob | null> => {
    // Dynamic import to keep pure web bundles lightweight
    try {
      const { buildDocxDocument } = await import("../../core/docx/docxBuilder.js");
      const buffer = await buildDocxDocument(ast, resolvedConfig);
      return new Blob([new Uint8Array(buffer)], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
    } catch {
      return null;
    }
  };

  const exportPdf = async (_filename?: string): Promise<Blob | null> => {
    if (typeof window !== "undefined") {
      // In browser environment, trigger native print / PDF dialog
      window.print();
      return null;
    }

    try {
      const { buildPdfDocument } = await import("../../core/pdf/pdfBuilder.js");
      const buffer = await buildPdfDocument(ast, resolvedConfig);
      return new Blob([new Uint8Array(buffer)], { type: "application/pdf" });
    } catch {
      return null;
    }
  };

  return {
    ast,
    toc,
    stats,
    metadata: ast.metadata,
    resolvedConfig,
    footnotes: ast.footnoteDefs,
    exportPdf,
    exportDocx,
    exportHtml,
  };
}
