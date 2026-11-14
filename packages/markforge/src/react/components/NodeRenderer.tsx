import React from "react";
import type { MarkdownASTNode } from "../../core/parser.js";
import type { MarkforgeComponentOverrides } from "../types.js";
import { InlineRenderer } from "./InlineRenderer.js";
import { highlightCodeToHtml } from "../../core/syntax/syntaxHighlighter.js";
import { renderMathToHtml } from "../../core/math/mathRenderer.js";

export interface NodeRendererProps {
  nodes?: MarkdownASTNode[];
  tokens?: Record<string, unknown>;
  components?: MarkforgeComponentOverrides;
}

const CALLOUT_STYLES: Record<string, { bg: string; border: string; titleColor: string }> = {
  NOTE: { bg: "#ECFDFD", border: "#33CDCF", titleColor: "#009DA0" },
  TIP: { bg: "#ecfdf5", border: "#10b981", titleColor: "#10b981" },
  WARNING: { bg: "#fffbeb", border: "#f59e0b", titleColor: "#f59e0b" },
  CAUTION: { bg: "#fef2f2", border: "#ef4444", titleColor: "#ef4444" },
  IMPORTANT: { bg: "#f5f3ff", border: "#8b5cf6", titleColor: "#8b5cf6" },
};

export const NodeRenderer: React.FC<NodeRendererProps> = ({
  nodes = [],
  tokens,
  components,
}) => {
  return (
    <>
      {nodes.map((node, idx) => {
        const key = `${node.type}-${idx}`;

        // 1. Heading
        if (node.type === "heading") {
          const level = Math.min(Math.max(node.level || 1, 1), 6);
          const inner = (
            <InlineRenderer spans={node.inlines} tokens={tokens} components={components} />
          );

          if (components?.heading) {
            const CustomHeading = components.heading;
            return (
              <CustomHeading key={key} level={level} id={node.id} node={node}>
                {inner}
              </CustomHeading>
            );
          }

          const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
          return (
            <Tag key={key} id={node.id}>
              {inner}
            </Tag>
          );
        }

        // 2. Paragraph
        if (node.type === "paragraph") {
          const inner = (
            <InlineRenderer spans={node.inlines} tokens={tokens} components={components} />
          );

          if (components?.paragraph) {
            const CustomParagraph = components.paragraph;
            return (
              <CustomParagraph key={key} node={node}>
                {inner}
              </CustomParagraph>
            );
          }

          return <p key={key}>{inner}</p>;
        }

        // 3. Code Block
        if (node.type === "codeBlock") {
          const code = node.text || "";
          const language = node.language;
          const highlighted = highlightCodeToHtml(code, language);

          if (components?.codeBlock) {
            const CustomCodeBlock = components.codeBlock;
            return (
              <CustomCodeBlock
                key={key}
                code={code}
                language={language}
                highlightedHtml={highlighted}
                node={node}
              />
            );
          }

          return (
            <div key={key} className="code-block-wrapper">
              <pre>
                <code
                  className={language ? `language-${language}` : ""}
                  dangerouslySetInnerHTML={{ __html: highlighted }}
                />
              </pre>
            </div>
          );
        }

        // 4. Blockquote
        if (node.type === "blockquote") {
          const inner = node.inlines && node.inlines.length > 0 ? (
            <InlineRenderer spans={node.inlines} tokens={tokens} components={components} />
          ) : (
            <NodeRenderer nodes={node.children} tokens={tokens} components={components} />
          );

          if (components?.blockquote) {
            const CustomBlockquote = components.blockquote;
            return (
              <CustomBlockquote key={key} node={node}>
                {inner}
              </CustomBlockquote>
            );
          }

          return <blockquote key={key}>{inner}</blockquote>;
        }

        // 5. Callout (NOTE, TIP, IMPORTANT, WARNING, CAUTION)
        if (node.type === "callout") {
          const calloutType = node.calloutType || "NOTE";
          const cs = CALLOUT_STYLES[calloutType] ?? CALLOUT_STYLES.NOTE;
          const inner = (
            <InlineRenderer spans={node.inlines} tokens={tokens} components={components} />
          );

          if (components?.callout) {
            const CustomCallout = components.callout;
            return (
              <CustomCallout
                key={key}
                type={calloutType}
                node={node}
              >
                {inner}
              </CustomCallout>
            );
          }

          return (
            <div
              key={key}
              className={`callout callout-${calloutType.toLowerCase()}`}
              style={{
                borderLeft: `4px solid ${cs.border}`,
                background: cs.bg,
                borderRadius: "6px",
                padding: "1rem 1.2rem",
                margin: "1.2rem 0",
              }}
            >
              <div
                className="callout-title"
                style={{
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "0.4rem",
                  color: cs.titleColor,
                }}
              >
                {calloutType}
              </div>
              <div className="callout-body">{inner}</div>
            </div>
          );
        }

        // 6. Table
        if (node.type === "table" && node.children) {
          const tableContent = (
            <table>
              <tbody>
                {node.children.map((rowNode, rIdx) => (
                  <tr key={`tr-${rIdx}`}>
                    {(rowNode.children || []).map((cellNode, cIdx) => {
                      const CellTag = cellNode.isHeader ? "th" : "td";
                      return (
                        <CellTag key={`cell-${rIdx}-${cIdx}`}>
                          <InlineRenderer
                            spans={cellNode.inlines}
                            tokens={tokens}
                            components={components}
                          />
                        </CellTag>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          );

          if (components?.table) {
            const CustomTable = components.table;
            return (
              <CustomTable key={key} node={node}>
                {tableContent}
              </CustomTable>
            );
          }

          return (
            <div key={key} className="table-wrapper">
              {tableContent}
            </div>
          );
        }

        // 7. Mermaid Diagram
        if (node.type === "mermaid") {
          const code = node.text || "";

          if (components?.mermaid) {
            const CustomMermaid = components.mermaid;
            return <CustomMermaid key={key} code={code} node={node} />;
          }

          return (
            <div key={key} className="markforge-mermaid-container">
              <pre className="mermaid">{code}</pre>
            </div>
          );
        }

        // 8. Math Block
        if (node.type === "mathBlock") {
          const math = node.text || "";

          if (components?.math) {
            const CustomMath = components.math;
            return <CustomMath key={key} math={math} isBlock={true} />;
          }

          const renderedHtml = renderMathToHtml(math, true);
          return (
            <div
              key={key}
              className="math-block"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          );
        }

        // 9. Columns & Multi-column container
        if (node.type === "columns") {
          const count = node.columnsCount || 2;
          const gap = node.columnGap || "1.5rem";

          const columnsContent = (
            <div
              className="markforge-columns"
              style={
                {
                  "--cols": count,
                  "--col-gap": gap,
                } as React.CSSProperties
              }
            >
              {(node.children || []).map((colNode, cIdx) => (
                <div key={`col-${cIdx}`} className="markforge-col">
                  <NodeRenderer
                    nodes={colNode.children}
                    tokens={tokens}
                    components={components}
                  />
                </div>
              ))}
            </div>
          );

          if (components?.columns) {
            const CustomColumns = components.columns;
            return (
              <CustomColumns key={key} columnsCount={count} gap={gap}>
                {columnsContent}
              </CustomColumns>
            );
          }

          return <React.Fragment key={key}>{columnsContent}</React.Fragment>;
        }

        // 10. List (Ordered / Unordered)
        if (node.type === "list" && node.children) {
          const ListTag = node.ordered ? "ol" : "ul";
          return (
            <ListTag key={key}>
              {node.children.map((item, iIdx) => (
                <li key={`li-${iIdx}`}>
                  <InlineRenderer
                    spans={item.inlines}
                    tokens={tokens}
                    components={components}
                  />
                  {item.children && item.children.length > 0 && (
                    <NodeRenderer
                      nodes={item.children}
                      tokens={tokens}
                      components={components}
                    />
                  )}
                </li>
              ))}
            </ListTag>
          );
        }

        // 11. Thematic Break / Divider
        if (node.type === "thematicBreak") {
          return <hr key={key} />;
        }

        // 12. Page Break
        if (node.type === "pageBreak") {
          return (
            <div
              key={key}
              className="markforge-page-break"
              style={{
                breakBefore: "page",
                pageBreakBefore: "always",
                height: 0,
                margin: 0,
                padding: 0,
              }}
            />
          );
        }

        // 13. Footnote Definition
        if (node.type === "footnoteDef") {
          const fnId = node.footnoteId || "";
          return (
            <div key={key} id={`fn-${fnId}`} className="markforge-footnote-item">
              <span className="fn-num">[{fnId}] </span>
              <InlineRenderer
                spans={node.inlines}
                tokens={tokens}
                components={components}
              />
              <a href={`#fnref-${fnId}`} className="markforge-fnback">
                ↩
              </a>
            </div>
          );
        }

        return null;
      })}
    </>
  );
};
