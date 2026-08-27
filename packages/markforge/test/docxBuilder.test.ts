import { describe, it, expect } from "bun:test";
import { parseMarkdownDocument } from "../src/core/parser.js";
import { buildDocxDocument, parseMarginToTwip } from "../src/core/docx/docxBuilder.js";

describe("docxBuilder > parseMarginToTwip", () => {
  it("converts cm, mm, in, pt to twip correctly", () => {
    expect(parseMarginToTwip("1in")).toBe(1440);
    expect(parseMarginToTwip("2.54cm")).toBe(1440);
    expect(parseMarginToTwip(720)).toBe(720);
    expect(parseMarginToTwip("10pt")).toBe(200);
  });
});

describe("docxBuilder > buildDocxDocument", () => {
  it("builds a binary DOCX document buffer with headings, tables, callouts, and lists", async () => {
    const md = `---
title: "Quarterly Audit"
subtitle: "Executive Summary"
author: "Ma'sum"
date: "2026-08-27"
orientation: "portrait"
---

# 1. Project Background

Here is a paragraph with **bold**, *italic*, and \`inline code\`.

> [!NOTE]
> Ensure all security guidelines are maintained.

> [!WARNING]
> Deprecated dependencies must be replaced immediately.

> Standard blockquote quote text.

| Metric | Target | Result |
| :--- | :---: | ---: |
| Code Coverage | 100% | 100% |
| Type Safety | Strict | Zero Any |

- [x] First item checked
- [ ] Second item pending

\`\`\`typescript
export const PI: number = 3.14159;
\`\`\`

---
`;

    const doc = parseMarkdownDocument(md);
    const buffer = await buildDocxDocument(doc, {
      orientation: "portrait",
      margins: { top: "2.5cm", bottom: "2.5cm" },
    });

    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(1000);
    // Standard docx starts with ZIP magic header 'PK' (0x50, 0x4B)
    expect(buffer[0]).toBe(0x50);
    expect(buffer[1]).toBe(0x4b);
  });
});
