import React from "react";
import type { MarkdownInlineSpan } from "../../core/parser.js";
import { renderMathToHtml } from "../../core/math/mathRenderer.js";
import type { MarkforgeComponentOverrides } from "../types.js";
import { replaceDocumentTokens } from "../../config/resolveConfig.js";

export interface InlineRendererProps {
  spans?: MarkdownInlineSpan[];
  tokens?: Record<string, unknown>;
  components?: MarkforgeComponentOverrides;
}

export const InlineRenderer: React.FC<InlineRendererProps> = ({
  spans = [],
  tokens,
  components,
}) => {
  return (
    <>
      {spans.map((span, idx) => {
        const key = `${span.type}-${idx}`;

        if (span.type === "bold") {
          const inner = span.children && span.children.length > 0 ? (
            <InlineRenderer spans={span.children} tokens={tokens} components={components} />
          ) : tokens ? (
            replaceDocumentTokens(span.content, tokens)
          ) : (
            span.content
          );
          return <strong key={key}>{inner}</strong>;
        }

        if (span.type === "italic") {
          const inner = span.children && span.children.length > 0 ? (
            <InlineRenderer spans={span.children} tokens={tokens} components={components} />
          ) : tokens ? (
            replaceDocumentTokens(span.content, tokens)
          ) : (
            span.content
          );
          return <em key={key}>{inner}</em>;
        }

        if (span.type === "strikethrough") {
          const inner = span.children && span.children.length > 0 ? (
            <InlineRenderer spans={span.children} tokens={tokens} components={components} />
          ) : tokens ? (
            replaceDocumentTokens(span.content, tokens)
          ) : (
            span.content
          );
          return <del key={key}>{inner}</del>;
        }

        if (span.type === "code") {
          return <code key={key}>{span.content}</code>;
        }

        if (span.type === "link" && span.url) {
          const inner = span.children && span.children.length > 0 ? (
            <InlineRenderer spans={span.children} tokens={tokens} components={components} />
          ) : tokens ? (
            replaceDocumentTokens(span.content, tokens)
          ) : (
            span.content
          );

          return (
            <a key={key} href={span.url} title={span.title}>
              {inner}
            </a>
          );
        }

        if (span.type === "image" && span.url) {
          return (
            <img
              key={key}
              src={span.url}
              alt={span.alt || ""}
              title={span.title}
              width={span.width}
              height={span.height}
            />
          );
        }

        if (span.type === "mathInline") {
          if (components?.math) {
            const CustomMath = components.math;
            return <CustomMath key={key} math={span.content} isBlock={false} />;
          }
          const html = renderMathToHtml(span.content, false);
          return (
            <span
              key={key}
              className="markforge-math-inline"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }

        if (span.type === "footnoteRef") {
          const id = span.footnoteId || span.content;
          return (
            <sup key={key}>
              <a href={`#fn-${id}`} id={`fnref-${id}`} className="markforge-fnref">
                [{span.content}]
              </a>
            </sup>
          );
        }

        if (span.type === "htmlInline") {
          return <span key={key} dangerouslySetInnerHTML={{ __html: span.content }} />;
        }

        const textContent = tokens ? replaceDocumentTokens(span.content, tokens) : span.content;
        return <React.Fragment key={key}>{textContent}</React.Fragment>;
      })}
    </>
  );
};

