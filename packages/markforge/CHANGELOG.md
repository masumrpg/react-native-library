# Changelog

All notable changes to **@masumdev/markforge** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.0] - 2026-08-27

### 🚀 Added

- **Mermaid Diagram Support**: Full Mermaid.js rendering for all output formats. Diagrams in ` ```mermaid ``` ` blocks are rasterized via headless browser and embedded as images in DOCX, PDF, and HTML. Configurable `--virtual-time-budget=8000ms` ensures complex diagrams fully render before capture.
- **Callout / Alert Boxes**: GitHub-flavored callout syntax (`> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`, `> [!CAUTION]`, `> [!IMPORTANT]`) now renders with colored left-border and background in all three output formats.
- **Watermark Configuration**: Optional per-document watermark support via `markforge.config.ts` or frontmatter. Disabled by default. Configurable text, opacity, and position (`diagonal`, `center`, `top-left`, `top-right`, `bottom-left`, `bottom-right`).
- **Multi-Zone Header & Footer**: Left / Center / Right header and footer zones now work correctly in both DOCX (via OpenXML tab-stop logic) and PDF (via CSS Paged Media `@top-*` / `@bottom-*` rules).
- **`THEME_COMPONENTS` Base Layer**: Extracted all shared component CSS (callouts, blockquotes, code blocks, tables, images, TOC, document header) into a `THEME_COMPONENTS` constant that is always injected regardless of the chosen theme. Fixes missing styles in `academic` and other non-default themes.

### 🎨 Changed

- **Primary Color Palette**: Updated to Blu by BCA Digital cyan — primary `#33CDCF`, deep `#009DA0`, tint `#ECFDFD` — across all themes and component styles.
- **Dual Syntax Highlight Themes**:
  - **PDF / HTML (dark)**: New VS Code Dark+-inspired palette — strings in warm orange `#E07C4F`, keywords in coral `#FF7B72`, plain text in light gray `#E2E8F0`. All colors have sufficient contrast on dark `#0f172a` backgrounds.
  - **DOCX (light)**: GitHub Light-inspired palette — strings in forest teal `#0A7E5C`, keywords in crimson `#D73A49`, plain text near-black `#24292E`. All colors readable on white backgrounds.
  - `tokenizeCodeLine()` now accepts a `theme: "dark" | "light"` parameter. `docxBuilder` passes `"light"`, HTML/PDF builders use `"dark"` (default).
- **PDF Code Block Scrollbar Removed**: Added `@media print { pre { overflow: visible; white-space: pre-wrap; } }` — scrollbars no longer appear in PDF output.
- **Callout Inline Styles**: Callout boxes now use inline `style` attributes for background and border colors (in addition to CSS classes). This bypasses Chromium's headless PDF background-graphics suppression, ensuring colors render without needing `--print-background-graphics`.
- **`THEME_ACADEMIC`**: Now includes a full `:root` CSS variable block compatible with `THEME_COMPONENTS` (adds `--mf-card-bg`, `--mf-primary`, `--mf-border`, etc.), enabling all component styles to apply correctly.

### 🛠️ Fixed

- **PDF Header/Footer not rendering**: Refactored `injectPagedMediaStyles` in `pdfBuilder.ts` to inject frontmatter header/footer config into CSS `@page` rules using `@top-left`, `@top-center`, `@top-right`, `@bottom-*` selectors.
- **DOCX Header/Footer single-zone bug**: Implemented `TabStopType` logic to correctly split headers into Left/Center/Right zones using tab characters in OpenXML paragraphs.
- **Callout styles missing in PDF**: Root cause was `THEME_ACADEMIC` missing component CSS. Fixed by the `THEME_COMPONENTS` extraction and injection approach.
- **Chromium PDF color suppression**: Added `--force-color-profile=srgb` Chrome flag. Callout box colors now render with inline styles that bypass print background suppression.

---

## [0.1.0] - 2026-08-27

### 🚀 Initial Release

- **Multi-Format Document Engine**: Full compiler pipeline producing Microsoft Word (`.docx`), Print-ready (`.pdf`), and Standalone (`.html`).
- **Embedded HTML & CSS Support**: Native parsing of inline HTML tags (`<div>`, `<span>`, `<table>`, `<img>`, `<style>`) inside Markdown & MDX.
- **Image Resolver Engine**: Local relative path resolution, remote Web URL fetching with caching, Base64 data URIs, and SVG vector support.
- **Built-in Curated Themes**: `default`, `academic`, `github`, `corporate`, `minimal`, and `dracula`.
- **Interactive Terminal UI**: Built with **Ink** (React for Terminal) with progress indicators and summary table.
- **Type-Safe Configuration**: Auto-discovered `markforge.config.ts`, `.markforgerc.json`, and YAML support with JSON Schema autocomplete.
- **Programmatic TypeScript API**: Direct functions `markforge()`, `compileMarkdown()`, `buildDocxDocument()`, `buildHtmlDocument()`, and `buildPdfDocument()`.
