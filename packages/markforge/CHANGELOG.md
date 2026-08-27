# Changelog

All notable changes to **@masumdev/markforge** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.3] - 2026-08-28

### 🛠️ Fixed

- **Node.js 22/25 `--localstorage-file` warning**: The `docx` library accesses `globalThis.localStorage` during its module evaluation. In ESM, static `import` declarations are evaluated before any user code in the entry point. Refactored `cli.tsx` to dynamically import `App`, `Ink`, and `loadConfig`, ensuring the `globalThis.localStorage` stub is active before `docx` is loaded by Node.js.
- **CLI Compilation Error (`expected input to be a string or buffer`)**: Fixed a prop name mismatch in `cli.tsx` where `inputPath` was passed instead of `inputFile` to the Ink `<App />` component.
- **Dynamic Version Resolution in Global ESM Installs**: Replaced fallback version detection with `fileURLToPath(import.meta.url)` so `MARKFORGE_VERSION` always resolves the installed package's `package.json` correctly.

---

## [0.2.2] - 2026-08-28

### 🛠️ Fixed

- **CLI warning still showing after 0.2.1**: The `--localstorage-file` warning suppression in `cli.tsx` was broken due to incorrect listener registration order. `process.removeAllListeners("warning")` was called *after* `process.on("warning", handler)`, which immediately removed the handler we just added. Fixed by calling `removeAllListeners` **before** registering the filter handler.
- **Dynamic version**: `MARKFORGE_VERSION` in `version.ts` is now resolved at runtime by walking up the directory tree to find `package.json`. The hardcoded string is only a fallback. Version bumps in `package.json` are now automatically reflected in `markforge -V` output without needing to touch `version.ts`.

---

## [0.2.1] - 2026-08-28

### 🛠️ Fixed

- **Windows PDF not using Chromium (fallback)**: `findChromeExecutable()` now resolves Windows browser paths using runtime environment variables instead of hardcoded strings:
  - `%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe` — user-level Chrome install (most common on Windows)
  - `%PROGRAMFILES%\Google\Chrome\Application\chrome.exe` — system-level Chrome
  - `%LOCALAPPDATA%\Microsoft\Edge\Application\msedge.exe` — Microsoft Edge (bundled with Windows 10/11)
  - `%PROGRAMFILES%\Microsoft\Edge\Application\msedge.exe` — system Edge
  - `%LOCALAPPDATA%\Chromium\Application\chrome.exe` — Chromium standalone
  - Also added `where chrome` and `where msedge` to PATH search on Windows.
  - Set `CHROME_PATH` or `PUPPETEER_EXECUTABLE_PATH` env variable to override auto-detection.
- **CLI `--localstorage-file` warning**: Suppressed the noisy Bun startup warning `--localstorage-file was provided without a valid path`. This fired because Bun's built-in localStorage API is enabled by default but no file path was configured. MarkForge never uses localStorage, so the warning is harmless — it is now silently filtered at process startup.
- **Mermaid renderer**: Added `--virtual-time-budget=5000` and `--disable-software-rasterizer` flags to Chromium invocation for more reliable diagram capture on Windows and lower-end hardware.

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
