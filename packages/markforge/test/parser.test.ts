import { describe, it, expect } from "bun:test";
import { parseMarkdownDocument, parseInlineSpans, slugify } from "../src/core/parser.js";

describe("parser > parseInlineSpans", () => {
  it("parses plain text", () => {
    const spans = parseInlineSpans("Hello world");
    expect(spans).toHaveLength(1);
    expect(spans[0].type).toBe("text");
    expect(spans[0].content).toBe("Hello world");
  });

  it("parses bold and italic spans", () => {
    const spans = parseInlineSpans("This is **bold** and *italic* and ***bold italic***");
    expect(spans.some((s) => s.type === "bold" && s.content === "bold")).toBe(true);
    expect(spans.some((s) => s.type === "italic" && s.content === "italic")).toBe(true);
    expect(spans.some((s) => s.type === "bold" && s.children?.[0]?.type === "italic")).toBe(true);
  });

  it("parses inline code and strikethrough", () => {
    const spans = parseInlineSpans("Run `npm install` or ~~deprecated~~");
    expect(spans.some((s) => s.type === "code" && s.content === "npm install")).toBe(true);
    expect(spans.some((s) => s.type === "strikethrough" && s.content === "deprecated")).toBe(true);
  });

  it("parses links and images with dimensions", () => {
    const spans = parseInlineSpans(
      'Visit [Google](https://google.com "Search") or ![Logo](./logo.png){width=300px height=200px}'
    );
    const link = spans.find((s) => s.type === "link");
    expect(link).toBeDefined();
    expect(link?.url).toBe("https://google.com");
    expect(link?.title).toBe("Search");

    const img = spans.find((s) => s.type === "image");
    expect(img).toBeDefined();
    expect(img?.url).toBe("./logo.png");
    expect(img?.width).toBe("300px");
    expect(img?.height).toBe("200px");
  });

  it("parses inline HTML img tags", () => {
    const spans = parseInlineSpans('<img src="./diagram.png" width="400" alt="Diagram" />');
    const img = spans.find((s) => s.type === "image");
    expect(img).toBeDefined();
    expect(img?.url).toBe("./diagram.png");
    expect(img?.alt).toBe("Diagram");
    expect(img?.width).toBe("400");
  });
});

describe("parser > slugify", () => {
  it("converts heading text to valid URL anchor slugs", () => {
    expect(slugify("Hello World!")).toBe("hello-world");
    expect(slugify("Section 1.2: System Architecture")).toBe("section-12-system-architecture");
  });
});

describe("parser > parseMarkdownDocument", () => {
  it("extracts frontmatter metadata and parses structured AST nodes", () => {
    const markdown = `---
title: "Technical Spec"
author: "Ma'sum"
date: "2026-08-27"
theme: "academic"
---

<style>
.custom-header { color: blue; }
</style>

# Overview

This is an introduction paragraph.

> [!NOTE]
> This is a callout block with important notes.

> Simple blockquote here.

| Feature | Status | Priority |
| :--- | :---: | ---: |
| DOCX Engine | Done | High |
| PDF Engine | In Progress | Medium |

- [x] Task 1 completed
- [ ] Task 2 pending

\`\`\`typescript
const x: number = 42;
\`\`\`

---
`;

    const doc = parseMarkdownDocument(markdown);
    expect(doc.metadata.title).toBe("Technical Spec");
    expect(doc.metadata.author).toBe("Ma'sum");
    expect(doc.metadata.theme).toBe("academic");
    expect(doc.inlinedStyles).toContain(".custom-header { color: blue; }");

    expect(doc.nodes.some((n) => n.type === "heading" && n.level === 1 && n.text === "Overview")).toBe(true);
    expect(doc.nodes.some((n) => n.type === "callout" && n.calloutType === "NOTE")).toBe(true);
    expect(doc.nodes.some((n) => n.type === "blockquote")).toBe(true);
    expect(doc.nodes.some((n) => n.type === "table")).toBe(true);
    expect(doc.nodes.some((n) => n.type === "list")).toBe(true);
    expect(doc.nodes.some((n) => n.type === "codeBlock" && n.language === "typescript")).toBe(true);
    expect(doc.nodes.some((n) => n.type === "thematicBreak")).toBe(true);
  });
});
