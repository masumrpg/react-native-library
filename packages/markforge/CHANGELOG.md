# Changelog

All notable changes to **@masumdev/markforge** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.5.0] - 2026-09-03

### Plain Text (.txt) Document Publishing Engine

- **Plain Text (.txt) Output Format**:
  - Added native support for compiling Markdown documents into structured plain text files (`OutputFormat.TXT` or `"txt"` in `to:` array / `--to txt`).
  - Structured document rendering with centered title banner, Table of Contents, double (`=`) and single (`-`) divider rules, callout tags (`| [NOTE]`), blockquotes (`> text`), code blocks with language annotations, and task item checkboxes (`[x]` / `[ ]`).
  - ASCII grid-aligned tables with dynamic column width calculation and text padding.
  - Complete support for footnotes (`[1] text`), approval signatures, and back cover closing card with dynamic metadata token replacement.
  - Terminal CLI and Ink UI integration with green badge color highlighting for `[TXT]` documents in the compilation summary table.

---

## [0.4.1] - 2026-08-30

### Enhancements, Security, CLI, and Configuration Refinements

- **Watermark Suppression on Front & Back Covers**:
  - Excluded the vector/PNG watermark overlay from both the Front Cover Page (page 0) and the Back Cover Closing Page (final page) in PDF generation.
  - Suppressed the HTML fixed canvas watermark in print media (`@media print { .document-watermark { display: none !important; } }`) to ensure only explicit `pdf-lib` page indexing controls watermark rendering.
- **Symmetric & Unified Cover & Back Cover Styling Configuration**:
  - Unified configuration property names across `CoverPageConfig` and `BackCoverConfig` for complete API consistency.
  - Added support for `backgroundColor`, `bgGradient`, `textColor`, `titleColor`, `subtitleColor`, `accentColor`, `badge`, `badgeColor`, `badgeTextColor`, `logo`, `logoWidth`, `footerText`, `copyright`, `address`, `email`, `phone`, `website`, and `social` across front and back covers in HTML, PDF, and DOCX.
- **Heading Color Harmonization (`h1` through `h6`)**:
  - Unified all heading levels (`h1`, `h2`, `h3`, `h4`, `h5`, `h6`) to use brand primary dark styling (`var(--mf-primary-dark)`) across HTML, PDF, and DOCX for visual consistency.
  - `h1`: 2.5px solid primary border underline; `h2`: 1px subtle teal border underline.
- **Strict Package.json Version Resolution**:
  - Removed fallback version constant in `version.ts`. The engine now resolves version strictly from the nearest `@masumdev/markforge` `package.json` at runtime and throws an explicit error if missing or unreadable.
- **Comprehensive Terminal CLI Parameter & Configuration Banner**:
  - Ink CLI header box and Live Preview banner (`--serve`) now display all resolved configuration details: source path, config path, visual theme, syntax highlighter, layout, output directory, and active module list (TOC, Numbering, Cover, BackCover, Watermark, Security, Math, Syntax).
- **Arbitrary Dynamic Metadata & Nested Record Token Interpolation**:
  - Enhanced `replaceDocumentTokens` to dynamically unpack and replace tokens defined in top-level `metadata` or nested `metadata` dictionaries (e.g. `{metakuda}` or `{custom_key}`).
  - Fixed AST parser inline text chunking to merge adjacent plain text spans, ensuring token names containing underscores (`_`) or hyphens are not split across separate tokens.
- **Table of Contents (TOC) Page Break Isolation**:
  - Table of Contents is now fully isolated from subsequent document body content via `page-break-after: always; break-after: page;` in PDF/HTML and a dedicated section break in Microsoft Word DOCX.
- **Academic & Enterprise Page Numbering Schema**:
  - Front Cover: Unnumbered, running headers/footers suppressed.
  - Table of Contents: Formal lowercase Roman numerals (`i`, `ii`, ...).
  - Main Document Body: Counter reset (`counter-reset: page 1;`) with standard decimal numbers (`1, 2, ...`).
  - Back Cover: Unnumbered, isolated final closing section.
- **Config-Driven Section Numbering (`numberHeadings`)**:
  - Propagated top-level configuration options (`numberHeadings: { enabled, depth, skipH1, prefix }`) directly into AST parsing and compilation across HTML, PDF, and DOCX.

---

## [0.4.0] - 2026-08-29

### Major Enterprise Features & Security Release

- **ISO 32000-2 AES-256 PDF Security & Password Encryption (`security`)**:
  - Native standard PDF encryption with independent `userPassword` (password required to open the document) and `ownerPassword` (master password required to modify document permissions).
  - Granular permissions enforcement: `printing`, `modifying`, `copying`, `annotating`, `fillingForms`, `contentAccessibility`, and `documentAssembly`.
- **Closing Page / Back Cover Builder (`backCover`)**:
  - Dedicated closing page builder supporting presets (`corporate`, `modern`, `minimal`, `card`), custom backgrounds, logos, company details, and social channels.
- **Multi-Signatory Approval Block (`signatureBlock`)**:
  - Multi-column signature blocks with custom alignment (`left`, `center`, `right`, `space-between`, `grid`), border styles (`line`, `box`, `card`), and digital signature support across DOCX, PDF, and HTML.

---

## [0.2.3] - 2026-08-28

### Fixed

- **Node.js 22/25 `--localstorage-file` warning**: The `docx` library accesses `globalThis.localStorage` during its module evaluation. In ESM, static `import` declarations are evaluated before any user code in the entry point. Refactored `cli.tsx` to dynamically import `App`, `Ink`, and `loadConfig`, ensuring the `globalThis.localStorage` stub is active before `docx` is loaded by Node.js.
- **CLI Compilation Error (`expected input to be a string or buffer`)**: Fixed a prop name mismatch in `cli.tsx` where `inputPath` was passed instead of `inputFile` to the Ink `<App />` component.
- **Dynamic Version Resolution in Global ESM Installs**: Replaced fallback version detection with `fileURLToPath(import.meta.url)` so `MARKFORGE_VERSION` always resolves the installed package's `package.json` correctly.

---

## [0.2.2] - 2026-08-28

### Fixed

- **CLI warning still showing after 0.2.1**: The `--localstorage-file` warning suppression in `cli.tsx` was broken due to incorrect listener registration order. Fixed by calling `removeAllListeners` before registering the filter handler.
- **Dynamic version**: `MARKFORGE_VERSION` in `version.ts` is now resolved at runtime by walking up the directory tree to find `package.json`.

---

## [0.2.1] - 2026-08-28

### Fixed

- **Windows PDF not using Chromium (fallback)**: `findChromeExecutable()` now resolves Windows browser paths using runtime environment variables.
- **CLI `--localstorage-file` warning**: Suppressed the noisy Bun startup warning.
- **Mermaid renderer**: Added `--virtual-time-budget=5000` and `--disable-software-rasterizer` flags to Chromium invocation.

---

## [0.2.0] - 2026-08-27

### Added

- **Mermaid Diagram Support**: Full Mermaid.js rendering for all output formats.
- **Callout / Alert Boxes**: GitHub-flavored callout syntax across all output formats.
- **Watermark Configuration**: Optional per-document watermark support via configuration or frontmatter.
- **Multi-Zone Header & Footer**: Left / Center / Right header and footer zones.
- **`THEME_COMPONENTS` Base Layer**: Extracted shared component CSS.

### Changed

- **Primary Color Palette**: Updated to Blu by BCA Digital cyan (`#33CDCF`, `#009DA0`, `#ECFDFD`).
- **Dual Syntax Highlight Themes**: VS Code Dark+ for PDF/HTML and GitHub Light for DOCX.
- **PDF Code Block Scrollbar Removed**: Added print stylesheet overrides.
- **Callout Inline Styles**: Callout boxes use inline style attributes to ensure print background rendering.

### Fixed

- **PDF Header/Footer not rendering**: Refactored CSS Paged Media `@page` injection.
- **DOCX Header/Footer single-zone bug**: Implemented `TabStopType` logic.
- **Callout styles missing in PDF**: Injected base component styles.
- **Chromium PDF color suppression**: Added `--force-color-profile=srgb` Chrome flag.

---

## [0.1.0] - 2026-08-27

### Initial Release

- **Multi-Format Document Engine**: Full compiler pipeline producing Microsoft Word (`.docx`), Print-ready (`.pdf`), and Standalone (`.html`).
- **Embedded HTML & CSS Support**: Native parsing of inline HTML tags inside Markdown & MDX.
- **Image Resolver Engine**: Local relative path resolution, remote Web URL fetching with caching, Base64 data URIs, and SVG vector support.
- **Built-in Curated Themes**: `default`, `academic`, `github`, `corporate`, `minimal`, and `dracula`.
- **Interactive Terminal UI**: Built with Ink.
- **Type-Safe Configuration**: Auto-discovered `markforge.config.ts`, `.markforgerc.json`, and YAML support.
- **Programmatic TypeScript API**: Direct functions `markforge()`, `compileMarkdown()`, `buildDocxDocument()`, `buildHtmlDocument()`, and `buildPdfDocument()`.
