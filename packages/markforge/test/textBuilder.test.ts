import { describe, it, expect } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import {
  parseMarkdown,
  buildTextDocument,
  compileMarkdown,
  OutputFormat,
} from "../src/index.js";

describe("Plain Text (.txt) Document Builder", () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "markforge_txt_test_"));

  it("renders cover page, headings, and paragraphs in structured plain text", async () => {
    const md = `---
title: "Technical Specification"
subtitle: "High-Performance Publishing Engine"
author: "Ma'sum"
company: "Masum Dev Technologies"
date: "2026-09-03"
version: "0.5.0"
coverPage:
  enabled: true
  badge: "INTERNAL USE ONLY"
  footerText: "Proprietary Architecture"
---

# Introduction

MarkForge compiles Markdown documents into high quality DOCX, PDF, HTML, and TXT files.

## Background

The system is designed for modern development teams requiring cross-platform documentation.
`;

    const doc = parseMarkdown(md);
    const txt = await buildTextDocument(doc, {
      coverPage: { enabled: true, badge: "INTERNAL USE ONLY", footerText: "Proprietary Architecture" },
    });

    expect(txt).toContain("TECHNICAL SPECIFICATION");
    expect(txt).toContain("High-Performance Publishing Engine");
    expect(txt).toContain("[INTERNAL USE ONLY]");
    expect(txt).toContain("Author:     Ma'sum");
    expect(txt).toContain("Company:    Masum Dev Technologies");
    expect(txt).toContain("Version:    0.5.0");
    expect(txt).toContain("INTRODUCTION");
    expect(txt).toContain("Background");
    expect(txt).toContain("MarkForge compiles Markdown documents");
  });

  it("renders hierarchical heading numbering and table of contents", async () => {
    const md = `---
title: "Numbered Guide"
toc: true
---

# Getting Started
Overview text.

## Prerequisites
Node.js and Bun runtime.

### Optional Tools
Docker CLI.

# Architecture Overview
Architecture deep dive.
`;

    const doc = parseMarkdown(md);
    const txt = await buildTextDocument(doc, {
      toc: true,
      numberHeadings: { enabled: true },
    });

    expect(txt).toContain("TABLE OF CONTENTS");
    expect(txt).toContain("1. Getting Started");
    expect(txt).toContain("1.1. Prerequisites");
    expect(txt).toContain("1.1.1. Optional Tools");
    expect(txt).toContain("2. Architecture Overview");
  });

  it("renders ASCII grid-aligned tables with auto calculated column widths", async () => {
    const md = `
# System Matrix

| Component | Status | Performance |
| :--- | :---: | ---: |
| HTML Engine | Active | 99.8% |
| PDF Renderer | Active | 98.4% |
| Plain Text Builder | Active | 100.0% |
`;

    const doc = parseMarkdown(md);
    const txt = await buildTextDocument(doc, {});

    expect(txt).toContain("+--------------------+--------+-------------+");
    expect(txt).toContain("| Component          | Status | Performance |");
    expect(txt).toContain("| HTML Engine        | Active | 99.8%       |");
    expect(txt).toContain("| Plain Text Builder | Active | 100.0%      |");
  });

  it("renders callout boxes, blockquotes, code blocks, and lists", async () => {
    const md = `
> [!NOTE]
> This is a crucial notification regarding the publication workflow.

> Standard blockquote quotation text.

\`\`\`typescript
const greeting: string = "Hello MarkForge";
console.log(greeting);
\`\`\`

* Item 1
* Item 2
* Subitem 2.1
* Subitem 2.2
[x] Task completed
[ ] Task pending
`;

    const doc = parseMarkdown(md);
    const txt = await buildTextDocument(doc, {});

    expect(txt).toContain("| [NOTE]");
    expect(txt).toContain("| This is a crucial notification");
    expect(txt).toContain("> Standard blockquote quotation text.");
    expect(txt).toContain("[Language: typescript]");
    expect(txt).toContain("const greeting: string = \"Hello MarkForge\";");
    expect(txt).toContain("* Item 1");
    expect(txt).toContain("* Item 2");
    expect(txt).toContain("[x] Task completed");
    expect(txt).toContain("[ ] Task pending");
  });

  it("renders signatures, footnotes, and back cover closing card with dynamic metadata tokens", async () => {
    const md = `---
title: "Enterprise Contract"
author: "Ma'sum"
company: "Masum Dev Technologies"
year: "2026"
---

# Contract Document

This is the primary agreement content with a footnote reference[^1].

[^1]: Footnote details explaining clause 1.
`;

    const doc = parseMarkdown(md);
    const txt = await buildTextDocument(doc, {
      signatures: {
        items: [
          { title: "Prepared By", name: "{author}", role: "Principal Architect", date: "2026-09-03" },
          { title: "Approved By", name: "Board of Directors", role: "Management", date: "2026-09-03" },
        ],
      },
      backCover: {
        enabled: true,
        title: "Thank You",
        subtitle: "Enterprise Document Services",
        company: "{company}",
        address: "Jakarta, Indonesia",
        email: "contact@masumdev.com",
        website: "https://react-native-library-docs.netlify.app",
        copyright: "Copyright (c) {year} {company}. All Rights Reserved.",
        social: { github: "https://github.com/masumrpg" },
      },
    });

    expect(txt).toContain("FOOTNOTES");
    expect(txt).toContain("[1] Footnote details explaining clause 1.");
    expect(txt).toContain("SIGNATURES & APPROVALS");
    expect(txt).toContain("[Prepared By]");
    expect(txt).toContain("Name: Ma'sum");
    expect(txt).toContain("THANK YOU");
    expect(txt).toContain("Company:   Masum Dev Technologies");
    expect(txt).toContain("Email:     contact@masumdev.com");
    expect(txt).toContain("GitHub:    https://github.com/masumrpg");
    expect(txt).toContain("Copyright (c) 2026 Masum Dev Technologies. All Rights Reserved.");
  });

  it("compiles markdown file directly to .txt format using compileMarkdown", async () => {
    const testFile = path.join(tmpDir, "sample-doc.md");
    fs.writeFileSync(
      testFile,
      `---
title: "Compilation Test"
author: "Ma'sum"
coverPage:
  enabled: true
---

# Full Pipeline

Testing end-to-end plain text file generation.
`,
      "utf-8"
    );

    const result = await compileMarkdown(testFile, {
      outputDir: tmpDir,
      to: [OutputFormat.TXT],
    });

    expect(result.errors.length).toBe(0);
    expect(result.files.length).toBe(1);
    expect(result.files[0].format).toBe("txt");
    expect(result.files[0].fileName).toBe("sample-doc.txt");

    const fileContent = fs.readFileSync(result.files[0].filePath, "utf-8");
    expect(fileContent).toContain("COMPILATION TEST");
    expect(fileContent).toContain("FULL PIPELINE");
    expect(fileContent).toContain("Testing end-to-end plain text file generation.");
  });
});
