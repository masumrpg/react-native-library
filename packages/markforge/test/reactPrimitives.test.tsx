import { describe, it, expect } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import {
  MarkforgeDocument,
  NodeRenderer,
  InlineRenderer,
  useMarkforge,
  type MarkforgeComponentOverrides,
} from "../src/react/index.js";
import { parseMarkdownDocument } from "../src/core/parser.js";

describe("React Headless Primitives & Components", () => {
  it("renders a basic Markdown document with headings, paragraphs, and lists", () => {
    const md = `
# Project Overview
This is a paragraph with **bold**, *italic*, and \`inline code\`.

- Item 1
- Item 2
- Item 3
`.trim();

    const html = renderToStaticMarkup(<MarkforgeDocument markdown={md} mode="continuous" />);

    expect(html).toContain("Project Overview");
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain("<em>italic</em>");
    expect(html).toContain("<code>inline code</code>");
    expect(html).toContain("<li>Item 1</li>");
    expect(html).toContain("<li>Item 2</li>");
    expect(html).toContain("<li>Item 3</li>");
    expect(html).toContain("markforge-mode-continuous");
  });

  it("supports mode='paginated' and partitions content across page breaks", () => {
    const md = `
# Page One
First page content.

<!-- pagebreak -->

# Page Two
Second page content.
`.trim();

    const html = renderToStaticMarkup(<MarkforgeDocument markdown={md} mode="paginated" />);

    expect(html).toContain("markforge-mode-paginated");
    expect(html).toContain("markforge-page-sheet");
    expect(html).toContain("Page One");
    expect(html).toContain("Page Two");
  });

  it("renders callouts and tables with styled containers", () => {
    const md = `
> [!NOTE]
> Please pay attention to this important note.

| Header A | Header B |
| :--- | :--- |
| Val 1 | Val 2 |
`.trim();

    const html = renderToStaticMarkup(<MarkforgeDocument markdown={md} />);

    expect(html).toContain("callout-note");
    expect(html).toContain("NOTE");
    expect(html).toContain("Please pay attention");
    expect(html).toContain("<table>");
    expect(html).toContain("Header A");
    expect(html).toContain("Val 1");
  });

  it("renders Mermaid diagram containers and Math KaTeX blocks", () => {
    const md = `
\`\`\`mermaid
flowchart TD
  A --> B
\`\`\`

$$
E = mc^2
$$
`.trim();

    const html = renderToStaticMarkup(<MarkforgeDocument markdown={md} />);

    expect(html).toContain("markforge-mermaid-container");
    expect(html).toContain('<pre class="mermaid">');
    expect(html).toContain("flowchart TD");
    expect(html).toContain("math-block");
    expect(html).toContain("katex");
  });

  it("applies watermark when configured", () => {
    const md = "# Watermarked Doc";
    const html = renderToStaticMarkup(
      <MarkforgeDocument markdown={md} watermark="CONFIDENTIAL" />
    );

    expect(html).toContain("markforge-watermark-overlay");
    expect(html).toContain("CONFIDENTIAL");
  });

  it("supports custom component overrides via `components` prop", () => {
    const md = `
# Custom Title
This is standard text.

> [!WARNING]
> Proceed with caution!
`.trim();

    const customComponents: MarkforgeComponentOverrides = {
      heading: ({ level, children }) => (
        <div className={`my-custom-heading-h${level}`}>
          <span>👉 </span>
          {children}
        </div>
      ),
      callout: ({ type, children }) => (
        <aside className={`my-custom-callout alert-${type}`}>
          <strong>CUSTOM ALERT: </strong>
          {children}
        </aside>
      ),
    };

    const html = renderToStaticMarkup(
      <MarkforgeDocument markdown={md} components={customComponents} />
    );

    expect(html).toContain('class="my-custom-heading-h1"');
    expect(html).toContain("👉");
    expect(html).toContain('class="my-custom-callout alert-WARNING"');
    expect(html).toContain("CUSTOM ALERT:");
  });

  it("renders InlineRenderer and NodeRenderer directly with AST", () => {
    const ast = parseMarkdownDocument("## Direct Heading\n\nA **paragraph** directly rendered.");

    const html = renderToStaticMarkup(
      <div className="custom-wrapper">
        <NodeRenderer nodes={ast.nodes} />
      </div>
    );

    expect(html).toContain('<h2 id="direct-heading">Direct Heading</h2>');
    expect(html).toContain("<p>A <strong>paragraph</strong> directly rendered.</p>");

    const spans = [
      { type: "text" as const, content: "Hello " },
      { type: "bold" as const, content: "World" },
    ];
    const inlineHtml = renderToStaticMarkup(
      <span>
        <InlineRenderer spans={spans} />
      </span>
    );
    expect(inlineHtml).toContain("<strong>World</strong>");
  });

  it("calculates TOC, statistics, and metadata via useMarkforge hook", () => {
    const md = `---
title: "Quarterly Report"
author: "Finance Team"
---

# Section One
Text content with some words to compute word count.

## Section Two
Another subsection with more content.
`.trim();

    const Consumer = () => {
      const { toc, stats, metadata } = useMarkforge({ markdown: md });
      return (
        <div>
          <h1 id="meta-title">{String(metadata.title)}</h1>
          <span id="words">{stats.words}</span>
          <span id="headings">{stats.headingsCount}</span>
          <ul id="toc-list">
            {toc.map((t) => (
              <li key={t.id}>{t.text}</li>
            ))}
          </ul>
        </div>
      );
    };

    const html = renderToStaticMarkup(<Consumer />);
    expect(html).toContain("Quarterly Report");
    expect(html).toContain("Section One");
    expect(html).toContain("Section Two");
    expect(html).toContain('<span id="headings">2</span>');
  });
});
