# Changelog

All notable changes to `@masumdev/tscheck` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.0] - 2026-08-26

### Added
- **100% Green Test Suite & Code Coverage**:
  - Authored 56 comprehensive unit, UI, and integration test cases covering 100% of functions and 99.74% of lines across the entire codebase.
  - Added CLI end-to-end tests verifying subprocess execution, flags (`--help`, `-V`, `--json`), and stdout pipelines.
  - Added Ink UI terminal component tests using `ink-testing-library` covering progress bars, cards, markdown summaries, and the interactive explorer.
- **Circular Dependency & Package Boundary Inspector**:
  - Traces AST module dependency graphs to detect circular dependency cycles.
  - Flags illegal deep internal package imports (e.g. `@masumdev/rn-ui/src/...`) to enforce strict package boundary encapsulation.
- **Inline Comment Suppression**:
  - Directives supported: `// tscheck-ignore-next-line <rule>`, `// tscheck-disable-next-line <rule>`, and block comments `/* tscheck-disable */` ... `/* tscheck-enable */`.
  - Supports rule-specific keywords: `deprecated`, `unused`, `any`, `circular`, `boundary`, `all`.
- **Git Staged & Diff Filtering (`--staged` / `--since <ref>`)**:
  - Instant sub-second pre-commit audits with `tscheck --staged`.
  - PR checks against branches with `tscheck --since main`.
- **Auto-Fixer Engine (`--fix`)**:
  - Safely auto-prefixes unused variables and parameters with `_` to meet strict TypeScript standards without breaking runtime code.
- **GitHub Actions CI Annotations (`--format github`)**:
  - Emits native workflow command annotations (`::warning`, `::error`) directly on GitHub PR diffs.
- **Rich Interactive HTML Report (`audit-report.html`)**:
  - Self-contained single-file HTML report with dark/light mode toggle.
  - Real-time search and filter tabs (`All`, `Deprecated`, `Unused`, `Explicit Any`, `Circular`, `Boundary`).
  - Linkified JSDoc `@deprecated` messages supporting raw URLs and Markdown links.
  - One-click copy buttons for code snippets and file paths (`file.ts:line:col`).
- **Enhanced JSON & YAML Multi-Format Configuration**:
  - Official draft-07 JSON Schema (`schema.json`) with IDE autocompletion and hover tooltips.
  - Multi-format auto-discovery prioritizing `.tscheckrc.json`, `tscheck.config.json`, `tscheck.config.yaml`, and `tscheck.config.ts`.
- **Interactive Terminal Search Dashboard (`-i, --interactive`)**:
  - Live query input powered by `ink-text-input` to filter audit issues interactively in the terminal.
- **Zero-Config Virtual TS Program Fallback**:
  - Automatically compiles and audits standalone folders and scripts even when no `tsconfig.json` exists.
- **Dynamic Package Versioning**:
  - `getTscheckVersion()` dynamically reads version from `package.json` across CLI, reports, and API.

---

## [0.1.0] - 2026-08-25

### Added
- **Initial Release of `@masumdev/tscheck`**:
  - Standalone TypeScript AST code audit CLI and engine.
  - AST deprecation detection for JSDoc `@deprecated` tags.
  - Unused variables, parameters, and import detection using TypeScript compiler diagnostics.
  - Strict explicit `any` type detection.
  - Real-time terminal progress with Ink.
  - Type-safe configuration via `defineConfig()`.
  - Automated report generation (`audit-report.json` and `audit-report.md`).
