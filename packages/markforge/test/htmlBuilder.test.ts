import { describe, it, expect } from "bun:test";
import { parseMarkdownDocument } from "../src/core/parser.js";
import { buildHtmlDocument, escapeHtml, renderInlinesToHtml } from "../src/core/html/htmlBuilder.js";

describe("htmlBuilder", () => {
  it("escapes html special characters", () => {
    expect(escapeHtml("<script>alert('xss')</script>")).toBe("&lt;script&gt;alert(&#039;xss&#039;)&lt;/script&gt;");
  });

  it("renders inlines to HTML", async () => {
    const html = await renderInlinesToHtml([
      { type: "bold", content: "bold" },
      { type: "text", content: " and " },
      { type: "code", content: "code" },
    ]);
    expect(html).toBe("<strong>bold</strong> and <code>code</code>");
  });

  it("builds a complete self-contained HTML document with TOC, themes, and callouts", async () => {
    const md = `---
title: "Document Title"
author: "Author Name"
toc: true
---

# Introduction

Paragraph with [Link](https://masumdev.com).

> [!TIP]
> Use Turborepo for fast builds.

| Col A | Col B |
| :--- | ---: |
| Value 1 | 100 |
`;

    const doc = parseMarkdownDocument(md);
    const html = await buildHtmlDocument(doc, { toc: true, theme: "academic" });

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<title>Document Title</title>");
    expect(html).toContain("Table of Contents");
    expect(html).toContain("callout callout-TIP");
    expect(html).toContain("<table>");
    expect(html).toContain('<h1 id="introduction">');
  });
});
