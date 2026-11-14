import React, { useMemo, useEffect, useRef } from "react";
import type { MarkforgeDocumentProps } from "../types.js";
import { parseMarkdownDocument, type MarkdownASTNode } from "../../core/parser.js";
import { resolveDocumentConfig, normalizeWatermark } from "../../config/resolveConfig.js";
import { generateThemeCss, THEME_COMPONENTS } from "../../core/html/htmlThemes.js";
import { KATEX_INLINE_CSS } from "../../core/math/mathRenderer.js";
import { NodeRenderer } from "./NodeRenderer.js";

/**
 * Splits AST nodes into visual pages divided by 'pageBreak' nodes or explicit page breaks.
 */
function partitionNodesIntoPages(nodes: MarkdownASTNode[]): MarkdownASTNode[][] {
  const pages: MarkdownASTNode[][] = [];
  let currentPage: MarkdownASTNode[] = [];

  for (const node of nodes) {
    if (node.type === "pageBreak") {
      pages.push(currentPage);
      currentPage = [];
    } else {
      currentPage.push(node);
    }
  }

  pages.push(currentPage);
  return pages;
}

export const MarkforgeDocument: React.FC<MarkforgeDocumentProps> = ({
  markdown,
  ast: externalAst,
  theme = "corporate",
  mode = "continuous",
  zoom = 1.0,
  showCoverPage = true,
  showBackCover = true,
  showTableOfContents = false,
  watermark: customWatermark,
  components,
  className = "",
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Parse AST if not provided externally
  const ast = useMemo(() => {
    if (externalAst) return externalAst;
    return parseMarkdownDocument(markdown || "");
  }, [markdown, externalAst]);

  // 2. Resolve document config & tokens
  const resolvedConfig = useMemo(() => {
    const rawTheme = typeof theme === "string" ? theme : theme;
    return resolveDocumentConfig(ast.metadata, { theme: rawTheme });
  }, [ast.metadata, theme]);

  // 3. Resolve Theme CSS & KaTeX styles
  const themeCss = useMemo(() => {
    return generateThemeCss(theme);
  }, [theme]);

  // 4. Resolve watermark configuration
  const watermark = useMemo(() => {
    if (customWatermark !== undefined) {
      return normalizeWatermark(customWatermark);
    }
    return resolvedConfig.watermark;
  }, [customWatermark, resolvedConfig.watermark]);

  // 5. Partition pages for paginated mode
  const pages = useMemo(() => {
    if (mode === "paginated") {
      return partitionNodesIntoPages(ast.nodes);
    }
    return [ast.nodes];
  }, [ast.nodes, mode]);

  // 6. Client-side Mermaid auto-runner when mounted in browser
  useEffect(() => {
    if (typeof window === "undefined") return;

    const el = containerRef.current;
    if (!el) return;

    const mermaidPreNodes = el.querySelectorAll("pre.mermaid");
    if (mermaidPreNodes.length === 0) return;

    // If mermaid is already loaded on window, run it
    const win = window as unknown as {
      mermaid?: {
        run: (options?: { nodes?: NodeListOf<Element> | Element[] }) => Promise<void>;
      };
    };

    if (win.mermaid && typeof win.mermaid.run === "function") {
      win.mermaid.run({ nodes: Array.from(mermaidPreNodes) }).catch(() => {
        // ignore mermaid rendering warning
      });
    }
  }, [ast]);

  // Render Cover Page
  const renderCover = () => {
    if (!showCoverPage || !resolvedConfig.coverPage?.enabled) return null;

    if (components?.coverPage) {
      const CustomCover = components.coverPage;
      return <CustomCover config={resolvedConfig} />;
    }

    const cover = resolvedConfig.coverPage;
    return (
      <div
        className={`markforge-cover cover-${cover.preset || "corporate-split"} ${mode === "paginated" ? "markforge-page-sheet" : ""}`}
        style={{
          background: cover.bgGradient || "#FFFFFF",
          color: cover.textColor || "#0F172A",
        }}
      >
        {cover.logo && (
          <div className="cover-logo">
            <img src={cover.logo} alt="Logo" style={{ maxHeight: cover.logoHeight || "80px" }} />
          </div>
        )}
        {cover.badge && (
          <div
            className="cover-badge"
            style={{
              backgroundColor: cover.badgeColor,
              color: cover.badgeTextColor,
            }}
          >
            {cover.badge}
          </div>
        )}
        <div className="cover-body">
          <h1 className="cover-title" style={{ color: cover.titleColor }}>
            {cover.title}
          </h1>
          {cover.subtitle && (
            <div className="cover-subtitle" style={{ color: cover.subtitleColor }}>
              {cover.subtitle}
            </div>
          )}
          <div className="cover-meta">
            {cover.company && (
              <div className="cover-meta-item">
                <span className="cover-meta-label">Organization:</span>
                <span className="cover-meta-value">{cover.company}</span>
              </div>
            )}
            {cover.author && (
              <div className="cover-meta-item">
                <span className="cover-meta-label">Author:</span>
                <span className="cover-meta-value">{cover.author}</span>
              </div>
            )}
            {cover.version && (
              <div className="cover-meta-item">
                <span className="cover-meta-label">Version:</span>
                <span className="cover-meta-value">{cover.version}</span>
              </div>
            )}
            {cover.date && (
              <div className="cover-meta-item">
                <span className="cover-meta-label">Date:</span>
                <span className="cover-meta-value">{cover.date}</span>
              </div>
            )}
          </div>
        </div>
        {cover.footerText && <div className="cover-footer-text">{cover.footerText}</div>}
      </div>
    );
  };

  // Render Table of Contents
  const renderToc = () => {
    if (!showTableOfContents || !ast.tocEntries || ast.tocEntries.length === 0) return null;

    return (
      <nav className="table-of-contents" aria-label="Table of Contents">
        <h2 className="toc-header">Table of Contents</h2>
        <ul className="toc-list">
          {ast.tocEntries.map((item, idx) => (
            <li key={`toc-${idx}`} className={`toc-item toc-level-${item.level}`}>
              <a href={`#${item.id}`} className="toc-link">
                <span className="toc-title">{item.text}</span>
                <span className="toc-dots" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  // Render Back Cover
  const renderBack = () => {
    if (!showBackCover || !resolvedConfig.backCover?.enabled) return null;

    if (components?.backCover) {
      const CustomBackCover = components.backCover;
      return <CustomBackCover config={resolvedConfig} />;
    }

    const back = resolvedConfig.backCover;
    return (
      <div
        className={`markforge-back-cover cover-${back.preset || "corporate"} ${mode === "paginated" ? "markforge-page-sheet" : ""}`}
        style={{
          background: back.bgGradient || "#0F172A",
          color: back.textColor || "#F8FAFC",
        }}
      >
        <div className="back-cover-body">
          {back.title && <h2 className="back-cover-title">{back.title}</h2>}
          {back.subtitle && <p className="back-cover-subtitle">{back.subtitle}</p>}
          {back.email && (
            <div className="back-cover-item">
              <span>Email: </span>
              <a href={`mailto:${back.email}`}>{back.email}</a>
            </div>
          )}
          {back.phone && (
            <div className="back-cover-item">
              <span>Phone: </span>
              <span>{back.phone}</span>
            </div>
          )}
          {back.website && (
            <div className="back-cover-item">
              <span>Website: </span>
              <a href={back.website}>{back.website}</a>
            </div>
          )}
        </div>
        {back.copyright && <div className="back-cover-footer">{back.copyright}</div>}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`markforge-root markforge-theme-${typeof theme === "string" ? theme : "custom"} markforge-mode-${mode} ${className}`}
      style={{
        transform: zoom !== 1.0 ? `scale(${zoom})` : undefined,
        transformOrigin: "top center",
        ...style,
      }}
    >
      {/* Injected Theme and Component Styles */}
      <style>{`
        ${THEME_COMPONENTS}
        ${themeCss}
        ${KATEX_INLINE_CSS}

        /* Paginated A4 Canvas Styles */
        .markforge-mode-paginated {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          padding: 2rem 0;
          background: var(--mf-page-bg, #e2e8f0);
          min-height: 100vh;
        }

        .markforge-mode-paginated .markforge-page-sheet {
          width: 210mm;
          min-height: 297mm;
          box-sizing: border-box;
          background: #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
          border-radius: 2px;
          padding: 20mm 18mm;
          position: relative;
          color: var(--mf-text, #0f172a);
          overflow: hidden;
        }

        /* Continuous Canvas Styles */
        .markforge-mode-continuous {
          max-width: 900px;
          margin: 0 auto;
          padding: 2.5rem 2rem;
          background: var(--mf-bg, #ffffff);
          color: var(--mf-text, #0f172a);
          position: relative;
        }

        /* Watermark styling */
        .markforge-watermark-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          overflow: hidden;
        }

        .markforge-watermark-text {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: 5rem;
          font-weight: 800;
          color: rgba(148, 163, 184, 0.12);
          transform: rotate(-35deg);
          user-select: none;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          white-space: nowrap;
        }
      `}</style>

      {/* Watermark Overlay */}
      {watermark?.text ? (
        <div className="markforge-watermark-overlay" aria-hidden="true">
          <span
            className="markforge-watermark-text"
            style={{
              color: watermark.color,
              opacity: watermark.opacity,
            }}
          >
            {watermark.text}
          </span>
        </div>
      ) : null}

      {/* 1. Cover Page */}
      {renderCover()}

      {/* 2. Table of Contents */}
      {renderToc()}

      {/* 3. Document Body Content */}
      {mode === "paginated" ? (
        pages.map((pageNodes, pIdx) => (
          <article key={`page-${pIdx}`} className="markforge-page-sheet">
            <NodeRenderer
              nodes={pageNodes}
              tokens={ast.metadata}
              components={components}
            />
          </article>
        ))
      ) : (
        <article className="markforge-document-body">
          <NodeRenderer
            nodes={ast.nodes}
            tokens={ast.metadata}
            components={components}
          />
        </article>
      )}

      {/* 4. Back Cover */}
      {renderBack()}
    </div>
  );
};
