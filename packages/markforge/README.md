<div align="center">

# @masumdev/markforge

**Enterprise Markdown & MDX Multi-Format Publishing Engine & CLI.**  
Convert Markdown into pixel-perfect **DOCX**, **PDF**, and **HTML** with native typography, syntax highlighting, Mermaid diagrams, callout boxes, customizable `ThemeProps`, and an interactive Ink terminal UI.

[![npm version](https://img.shields.io/npm/v/@masumdev/markforge.svg?style=flat-square&color=33CDCF)](https://www.npmjs.com/package/@masumdev/markforge)
[![License: MIT](https://img.shields.io/badge/License-MIT-33CDCF.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_Zero_Any-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Built with Bun](https://img.shields.io/badge/Built_with-Bun-fbf0df.svg?style=flat-square)](https://bun.sh)

</div>

---

## ✨ Features

| Feature | Description |
| :--- | :--- |
| 📄 **Multi-Format Output** | Generate `.docx`, `.pdf`, and `.html` from a single Markdown source simultaneously |
| 🎨 **Theme.CORPORATE & ThemeProps** | Flagship cyan corporate design system + full custom colors & fonts via `ThemeProps` |
| 📐 **Per-Zone Header & Footer** | Granular color, font size, font family, bold & italic controls per `left`, `center`, `right` slot |
| 📊 **Mermaid Diagrams** | Full Mermaid.js diagram engine — flowcharts, sequence, state, class, gantt |
| 📢 **Callout / Alert Boxes** | GitHub-style `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]` |
| 🌈 **Syntax Highlighting** | Tokenized multi-language code blocks (`dracula`, `github-dark`, `monokai`, `nord`, etc.) |
| 🖼️ **Image Inlining Engine** | Resolves local files, remote URLs, Base64 data URIs, and SVGs into embedded assets |
| 📑 **Auto Table of Contents** | Anchored TOC generated from heading structure (`#` to `####`) |
| 💧 **Non-Intrusive Watermark** | Background-layer watermark with custom text, color, opacity, rotation, and position |
| ⚙️ **Type-Safe Config** | `markforge.config.ts` with Enums, `.markforgerc.json`, or YAML with JSON Schema |
| 🚀 **Programmatic API** | High-level `compileMarkdown()` and low-level AST document builders for Node.js & Bun |
| 🖥️ **Ink Terminal UI** | Interactive TUI with live spinners, progress tracking, and compilation metrics |

---

## 📦 Installation

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

## 💻 CLI Usage

```bash
# Basic conversion to DOCX and PDF (defaults)
markforge document.md

# Specify target formats and output folder
markforge document.md --to docx,pdf,html -o ./dist

# Use custom CSS styling and force Table of Contents
markforge specification.md --css ./styles/custom.css --toc

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
| `--theme <name>` | | Visual theme preset (`corporate`, `default`) | `corporate` |
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

## ⚙️ Configuration (`markforge.config.ts`)

MarkForge supports type-safe configuration with full TypeScript Enums:

```typescript
import {
  defineConfig,
  OutputFormat,
  Theme,
  Orientation,
  PaperSizeEnum,
  SyntaxTheme,
  WatermarkPosition,
} from "@masumdev/markforge";

export default defineConfig({
  // Target output formats
  to: [OutputFormat.DOCX, OutputFormat.PDF, OutputFormat.HTML],

  // Output destination directory
  outputDir: ".temp/output-docs",

  // Visual document theme (Theme.CORPORATE preset or a custom ThemeProps object)
  theme: Theme.CORPORATE,

  // Page orientation & standard physical paper size
  orientation: Orientation.PORTRAIT,
  paperSize: PaperSizeEnum.A4,

  // Document page margins
  margins: {
    top: "3cm",
    bottom: "2.5cm",
    left: "2.5cm",
    right: "2.5cm",
  },

  // Running headers with dynamic tokens & per-zone slot styling
  header: {
    left: {
      text: "{company} - {title}",
      color: "#0D998D",
      fontSize: 9,
      fontFamily: "Inter, Segoe UI, sans-serif",
      bold: true,
    },
    center: "Internal Technical Guide",
    right: {
      text: "v{version}",
      color: "#94A3B8",
      fontSize: 8.5,
      italic: true,
    },
    divider: true,
    dividerColor: "#CBD5E1",
  },

  // Running footers with dynamic page numbering & per-zone slot styling
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

  // Automatic Table of Contents
  toc: true,

  // Watermark configuration (placed at lowest background layer)
  watermark: {
    text: "CONFIDENTIAL DRAFT",
    color: "#E11D48",
    opacity: 0.1,
    fontSize: 52,
    rotate: -45,
    position: WatermarkPosition.DIAGONAL,
  },

  // Syntax highlighting theme
  syntaxTheme: SyntaxTheme.DRACULA,

  // Asset embedding & bundling flags
  embedImages: true,
  bundleHtml: true,

  // Global document metadata
  metadata: {
    title: "Unified Platform Architecture & Document Suite",
    subtitle: "Enterprise Specification & Feature Validation Guide",
    author: "Masum RPG",
    company: "Masum Dev Technologies",
    version: "1.0.0",
    date: "2026-08-29",
    lang: "en",
  },
});
```

---

## 🎨 Custom Theme Customization (`ThemeProps`)

You can completely rebrand all document styling by passing a `ThemeProps` object:

```typescript
import { defineConfig } from "@masumdev/markforge";

export default defineConfig({
  theme: {
    primaryColor: "#0D998D",
    primaryDark: "#008073",
    primaryLight: "#D9F1F0",
    backgroundColor: "#0F172A",
    textColor: "#E2E8F0",
    textMuted: "#94A3B8",
    borderColor: "#334155",
    cardBackground: "#1E293B",
    codeBackground: "#020617",
    codeText: "#E2E8F0",
    fontFamily: "'Inter', sans-serif",
    fontMono: "'Fira Code', monospace",
  },
});
```

---

## 🚀 Programmatic API

### High-Level API (`compileMarkdown` / `markforge`)

```typescript
import { compileMarkdown, OutputFormat } from "@masumdev/markforge";

const result = await compileMarkdown("./specification.md", {
  to: [OutputFormat.DOCX, OutputFormat.PDF, OutputFormat.HTML],
  outputDir: "./dist",
  toc: true,
  metadata: {
    title: "API Reference Manual",
    author: "Masum Dev",
    version: "1.0.0",
  },
});

console.log(`✓ Compiled ${result.files.length} documents in ${result.durationMs}ms:`);
for (const file of result.files) {
  console.log(`  [${file.format.toUpperCase()}] ${file.filePath} (${file.sizeBytes} bytes)`);
}
```

### Low-Level API (AST & Individual Document Builders)

```typescript
import * as fs from "node:fs";
import {
  parseMarkdownDocument,
  buildDocxDocument,
  buildPdfDocument,
  buildHtmlDocument,
  Theme,
} from "@masumdev/markforge";

const markdownContent = fs.readFileSync("./report.md", "utf-8");

// 1. Parse Markdown into structured AST
const doc = parseMarkdownDocument(markdownContent);

const config = {
  theme: Theme.CORPORATE,
  toc: true,
  margins: { top: "2.5cm", bottom: "2.5cm", left: "2.5cm", right: "2.5cm" },
};

// 2. Build formats independently into binary buffers or HTML strings
const docxBuffer = await buildDocxDocument(doc, config);
const pdfBuffer = await buildPdfDocument(doc, config);
const htmlString = await buildHtmlDocument(doc, config);

// 3. Write output files
fs.writeFileSync("./dist/report.docx", docxBuffer);
fs.writeFileSync("./dist/report.pdf", pdfBuffer);
fs.writeFileSync("./dist/report.html", htmlString, "utf-8");
```

---

## 📄 License

MIT © [Masum Dev](https://github.com/masumdev)
