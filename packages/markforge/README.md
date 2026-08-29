<div align="center">

# @masumdev/markforge

**Enterprise Markdown & MDX Multi-Format Publishing Engine & CLI.**  
Convert Markdown into pixel-perfect **DOCX**, **PDF**, and **HTML** with native typography, syntax highlighting, Mermaid diagrams, callout boxes, customizable `ThemeProps`, AES-256 PDF encryption, and an interactive Ink terminal UI.

[![npm version](https://img.shields.io/npm/v/@masumdev/markforge.svg?style=flat-square&color=33CDCF)](https://www.npmjs.com/package/@masumdev/markforge)
[![License: MIT](https://img.shields.io/badge/License-MIT-33CDCF.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_Zero_Any-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Built with Bun](https://img.shields.io/badge/Built_with-Bun-fbf0df.svg?style=flat-square)](https://bun.sh)

</div>

---

## Features

| Feature | Description |
| :--- | :--- |
| **Multi-Format Output** | Generate `.docx`, `.pdf`, and `.html` from a single Markdown source simultaneously |
| **Theme.CORPORATE & ThemeProps** | Flagship cyan corporate design system plus full custom colors and fonts via `ThemeProps` |
| **Cover Page Builder** | Four professional cover page presets (`modern`, `corporate-split`, `minimal`, `card`) with company logo |
| **Back Cover / Closing Page** | Dedicated closing page with company details, contact info, social links, and copyright notice |
| **Math & LaTeX Equations** | Native KaTeX math rendering for inline (`$E=mc^2$`) and display blocks (`$$\sum_{i=1}^n x_i$$`) |
| **Multi-Column Directives** | Flexible multi-column layouts (`:::columns 2` and `:::col`) across HTML, PDF, and DOCX |
| **Section Numbering** | Automated hierarchical decimal numbering (`1.`, `1.1.`, `1.1.1.`) with configurable depth |
| **Footnotes & Endnotes** | Full academic footnotes (`[^1]` and `[^1]: description`) with backlinks and DOCX notes |
| **AES-256 PDF Security** | ISO 32000-2 standard PDF encryption with user/owner passwords and granular permissions |
| **100% Unselectable Watermark** | Chromium-rendered Image XObject watermark preventing any cursor selection interference |
| **Per-Zone Header & Footer** | Granular color, font size, font family, bold, and italic controls per `left`, `center`, `right` slot |
| **Mermaid Diagrams** | Full Mermaid.js diagram engine for flowcharts, sequence diagrams, gantt charts, and class models |
| **Callout / Alert Boxes** | GitHub-style `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]` |
| **Syntax Highlighting** | Tokenized multi-language code blocks (`dracula`, `github-dark`, `monokai`, `nord`, etc.) |
| **Image Inlining Engine** | Resolves local files, remote URLs, Base64 data URIs, and SVGs into self-contained embedded assets |
| **Signatures & Approvals** | Multi-signatory approval blocks with customizable alignment, border styles, and signature images |
| **Live-Reload Preview Server** | Real-time HTTP preview server (`--serve`) with Server-Sent Events (SSE) and scroll sync |
| **Windows Corporate Compliance** | Native Microsoft Edge detection, clean isolated process arguments, and `windowsHide` support |
| **Type-Safe Config** | `markforge.config.ts` with Enums, `.markforgerc.json`, or YAML with JSON Schema |
| **Programmatic API** | High-level `compileMarkdown()` and low-level AST document builders for Node.js and Bun |
| **Ink Terminal UI** | Interactive TUI with live progress tracking, timers, and compilation metrics |

---

## Installation

```bash
# Global CLI Installation
npm install -g @masumdev/markforge
# or with bun:
bun add -g @masumdev/markforge

# Project Local Dependency
npm install -D @masumdev/markforge
# or with bun:
bun add -d @masumdev/markforge
```

---

## CLI Usage

```bash
# Basic conversion to DOCX and PDF (defaults)
markforge document.md

# Specify target formats and output folder
markforge document.md --to docx,pdf,html -o ./dist

# Use custom configuration file
markforge specification.md -c ./markforge.config.ts

# Watch mode for live re-compilation
markforge report.md --watch

# Launch local preview server and open in browser
markforge document.md --serve --port 4000 --open
```

### CLI Flags Reference

| Flag | Alias | Description | Default |
| :--- | :---: | :--- | :--- |
| `<file>` | | Markdown input file path | **Required** |
| `--to <formats...>` | `-t` | Output formats: `docx`, `pdf`, `html`, `png` | `docx,pdf` |
| `--output <dir>` | `-o` | Output directory | Same as input file |
| `--config <file>` | `-c` | Explicit configuration file path | Auto-discovered |
| `--theme <name>` | | Visual theme preset (`corporate`, `default`, `academic`, `github`, `minimal`) | `corporate` |
| `--css <files...>` | | Custom CSS stylesheets to inject | `undefined` |
| `--orientation <type>` | | Page orientation (`portrait`, `landscape`) | `portrait` |
| `--paper-size <size>` | | Standard paper size (`A4`, `Letter`, `Legal`, `A3`, `A5`) | `A4` |
| `--toc` | | Force Table of Contents generation | `false` |
| `--watermark <text>` | | Document watermark text | `undefined` |
| `--syntax-theme <theme>`| | Code syntax highlighting theme | `github-dark` |
| `--watch` | `-w` | Watch input file and re-compile on change | `false` |
| `--serve` | | Start local HTTP preview server | `false` |
| `--port <number>` | `-p` | Local preview server port | `4000` |
| `--open` | | Automatically open browser on preview | `false` |
| `--version` | `-V` | Output version number | |
| `--help` | `-h` | Display CLI help menu | |

---

## Configuration (`markforge.config.ts`)

MarkForge supports type-safe configuration with TypeScript Enums:

```typescript
import {
  defineConfig,
  OutputFormat,
  Theme,
  Orientation,
  PaperSizeEnum,
  SyntaxTheme,
  SignatureAlign,
  SignatureStyle,
} from "@masumdev/markforge";

export default defineConfig({
  // Target output formats
  to: [OutputFormat.DOCX, OutputFormat.PDF, OutputFormat.HTML],

  // Destination folder
  outputDir: ".temp/output",

  // Theme preset or custom ThemeProps
  theme: Theme.CORPORATE,

  // Page geometry
  orientation: Orientation.PORTRAIT,
  paperSize: PaperSizeEnum.A4,
  margins: {
    top: "3cm",
    bottom: "2.5cm",
    left: "2.5cm",
    right: "2.5cm",
  },

  // Cover Page Builder
  coverPage: {
    enabled: true,
    preset: "modern",
    logo: "./assets/company-logo.png",
    logoWidth: 140,
    badge: "CONFIDENTIAL SPECIFICATION",
    badgeColor: "#ECFDFD",
    badgeTextColor: "#0D998D",
    footerText: "Proprietary Document - Authorized Personnel Only",
  },

  // Back Cover / Closing Page
  backCover: {
    enabled: true,
    preset: "corporate",
    logo: "./assets/company-logo.png",
    logoWidth: 120,
    title: "Thank You",
    subtitle: "Enterprise Cross-Platform Document Solutions",
    company: "Masum Dev Technologies",
    address: "Jakarta, Indonesia",
    email: "contact@masumdev.com",
    phone: "+62 812 3456 7890",
    website: "https://react-native-library-docs.netlify.app",
    social: {
      github: "https://github.com/masumrpg",
    },
    copyright: "Copyright (c) {year} {company}. All Rights Reserved.",
  },

  // Running headers with per-zone styling & tokens
  header: {
    left: {
      text: "{company} - {title}",
      color: "#0D998D",
      fontSize: 9,
      bold: true,
    },
    center: "Technical Specification",
    right: {
      text: "v{version}",
      color: "#94A3B8",
      fontSize: 8.5,
      italic: true,
    },
    divider: true,
    dividerColor: "#CBD5E1",
  },

  // Running footers with dynamic page numbers
  footer: {
    left: {
      text: "Author: {author}",
      color: "#64748B",
      fontSize: 8.5,
    },
    center: {
      text: "{date}",
      color: "#94A3B8",
      fontSize: 8.5,
      italic: true,
    },
    right: {
      text: "Page {page} of {pages}",
      color: "#0D998D",
      fontSize: 9,
      bold: true,
    },
    divider: true,
    dividerColor: "#CBD5E1",
  },

  // Table of Contents & Heading Numbering
  toc: true,
  tocTitle: "TABLE OF CONTENTS",
  tocDepth: 3,
  numberHeadings: {
    enabled: true,
    depth: 3,
    skipH1: false,
  },

  // Math equation rendering
  math: true,

  // PDF Document Security & AES-256 Encryption
  security: {
    userPassword: "masumdev_secret", // Password required to open document
    ownerPassword: "masumdev_admin",  // Master password to edit permissions
    permissions: {
      printing: "highResolution",
      modifying: false,
      copying: true,
      annotating: true,
      fillingForms: true,
      contentAccessibility: true,
      documentAssembly: false,
    },
  },

  // Unselectable diagonal watermark
  watermark: {
    text: "CONFIDENTIAL DRAFT",
    color: "#E11D48",
    opacity: 0.1,
    fontSize: 52,
    rotate: -45,
  },

  // Document signatures and approval block
  signatureBlock: {
    align: SignatureAlign.SPACE_BETWEEN,
    style: SignatureStyle.BOX,
    spacingBefore: "2.5cm",
    items: [
      {
        title: "Prepared By",
        name: "{author}",
        role: "Principal Mobile Architect",
        date: "{date}",
      },
      {
        title: "Approved By",
        name: "Enterprise Architecture Board",
        role: "Chief Technology Officer",
        date: "{date}",
      },
    ],
  },

  // Code syntax highlighting
  syntaxTheme: SyntaxTheme.GITHUB_DARK,

  // Fallback metadata dictionary
  metadata: {
    title: "Document Reference Manual",
    author: "Ma'sum (@masumrpg)",
    company: "Masum Dev Technologies",
    version: "1.0.0",
    date: "2026-08-30",
  },
});
```

---

## Complete Configuration Properties Reference

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `to` | `OutputFormat[]` | `['docx', 'pdf']` | Array of target document formats (`docx`, `pdf`, `html`, `png`) |
| `outputDir` | `string` | `'.'` | Output destination directory |
| `clean` | `boolean` | `false` | Remove stale output files in destination directory before compilation |
| `theme` | `Theme \| ThemeProps` | `Theme.CORPORATE` | Built-in theme preset or custom `ThemeProps` design tokens |
| `orientation` | `Orientation` | `'portrait'` | Page orientation (`portrait`, `landscape`) |
| `paperSize` | `PaperSizeEnum` | `'A4'` | Standard paper size (`A4`, `Letter`, `Legal`, `A3`, `A5`) |
| `margins` | `PageMargins` | `{ top: '2.5cm', ... }` | Page margins with units (`cm`, `mm`, `in`, `pt`) |
| `header` | `HeaderFooterConfig` | `undefined` | Header configuration with slots (`left`, `center`, `right`) and divider |
| `footer` | `HeaderFooterConfig` | `undefined` | Footer configuration with slots (`left`, `center`, `right`) and divider |
| `toc` | `boolean` | `true` | Generate automated Table of Contents |
| `tocTitle` | `string` | `'TABLE OF CONTENTS'`| Header title for the Table of Contents |
| `tocDepth` | `number` | `3` | Maximum heading level included in Table of Contents (1 to 6) |
| `numberHeadings` | `boolean \| object` | `false` | Automated hierarchical decimal numbering for headings (`1.`, `1.1.`, etc.) |
| `coverPage` | `boolean \| object` | `false` | Isolated front cover page builder with presets and company logo |
| `backCover` | `boolean \| object` | `false` | Isolated closing back cover page builder with corporate contact info |
| `signatureBlock` | `object` | `undefined` | Formal multi-signatory approval and signing block |
| `math` | `boolean` | `false` | KaTeX LaTeX math equation rendering (`$inline$` and `$$block$$`) |
| `security` | `object` | `undefined` | ISO 32000-2 AES-256 PDF encryption, user/owner passwords, and permissions |
| `watermark` | `string \| object` | `undefined` | 100% unselectable diagonal watermark configuration |
| `syntaxTheme` | `SyntaxTheme` | `'github-dark'` | Code syntax highlighting color palette |
| `css` | `string \| string[]` | `undefined` | Custom CSS files to inject |
| `customCss` | `string` | `undefined` | Raw CSS string injected directly into the document head |
| `breakBeforeHeadings` | `number[]` | `[1]` | Heading levels that trigger an automatic page break (`1` = H1) |
| `embedImages` | `boolean` | `true` | Base64-encode and inline all remote and local images |
| `metadata` | `object` | `{}` | Document metadata dictionary for dynamic `{token}` interpolation |

---

## Programmatic API

MarkForge provides both high-level compilation functions and low-level AST builders:

```typescript
import {
  compileMarkdown,
  parseMarkdown,
  buildDocxDocument,
  buildPdfDocument,
  buildHtmlDocument,
  Theme,
} from "@masumdev/markforge";

// High-level compilation to disk
const result = await compileMarkdown("./document.md", {
  to: ["docx", "pdf", "html"],
  outputDir: "./dist",
  theme: Theme.CORPORATE,
});

console.log("Compiled files:", result.outputFiles);
console.log("Duration:", result.durationMs, "ms");

// Low-level in-memory AST compilation
const rawMarkdown = "# Executive Summary\n\nHigh-performance document engine.";
const doc = parseMarkdown(rawMarkdown);

const docxBuffer = await buildDocxDocument(doc, { theme: Theme.CORPORATE });
const pdfBuffer = await buildPdfDocument(doc, { theme: Theme.CORPORATE });
const htmlString = await buildHtmlDocument(doc, { theme: Theme.CORPORATE });
```

---

## License

MIT License. Designed and maintained by **Ma'sum** ([@masumrpg](https://github.com/masumrpg)).
