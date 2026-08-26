# Changelog

All notable changes to `@masumdev/tscheck` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.2] - 2026-08-26

### Added
- **Theme-Aligned Custom Dropdown Component in HTML Report**:
  - Replaced native browser select elements with a custom-engineered, animated glassmorphism dropdown menu styled to seamlessly match the deep navy (`#090d16`) and slate (`#0f172a`) theme.
  - Features smooth rotate-chevron transitions, active option checkmarks, click-outside dismissal, and keyboard accessibility (`Escape`).
- **Full Theme Polish & Restored Original Aesthetic**:
  - Restored classic theme tokens, metric cards left accent stripes, pill badge typography, and hover animations.

---

## [0.2.1] - 2026-08-26

### Added
- **AI-Optimized Token-Efficient Prompt Generator (`--ai` / `--format ai`)**:
  - Dense, structured markdown remediation format tailored for LLMs (Claude, ChatGPT, Gemini, Antigravity) with zero token waste.
  - Generates `audit-report.ai.md` alongside JSON, Markdown, and HTML reports.
  - Prominent **"🤖 Copy for AI"** button in HTML report for instant 1-click clipboard prompt extraction.
- **Local HTTP Report Server & Auto Browser Launch (`-s, --serve [port]` & `-O, --open`)**:
  - Lightweight built-in HTTP server to host and inspect interactive HTML audit reports locally.
  - Custom port support (`--serve 3000`) with automatic increment fallback if port is occupied.
  - Cross-platform auto-browser opener (`open` / `xdg-open` / `start`).
- **Multi-IDE Deep Linking Scheme Selector**:
  - Jump directly from HTML violation cards to the exact line and column in **VS Code**, **Cursor**, **Antigravity IDE** (`antigravity://`), **Windsurf**, **Zed**, **WebStorm/IntelliJ**, **Sublime Text**, or **VS Code Insiders**.
  - Persistent IDE selector in HTML header saved to `localStorage`.
- **AST Origin Library & Smart Suggested Fix Extraction**:
  - Identifies origin packages (`Built-in JS (lib.es5)`, `zod`, `react`, local monorepo, etc.).
  - Extracts and displays **💡 AI Suggested Fix** callout cards (e.g. `Use .slice() or .substring()` for `substr`).
- **One-Click Copy Ignore Directive (`[Copy Ignore Directive]`)**:
  - Instant copy of `// tscheck-ignore-next-line <rule>` per violation card.
- **Group-By View Switcher in HTML Report**:
  - Switch dynamically between **Flat List**, **Group by File**, **Group by Rule**, and **Group by Package**.
- **Same-Line AST Deprecation Deduplication**:
  - Automatically deduplicates overlapping AST expressions on the same line to ensure clean single-card reporting.
- **Author & Community Profile Card in HTML Report**:
  - Added creator badge with GitHub avatar, profile links, monorepo repository, and documentation portal links.

---

## [0.2.0] - 2026-08-26

### Added
- **100% Green Test Suite & Code Coverage**:
  - Authored comprehensive unit, UI, and integration test cases covering 100% of functions across the entire codebase.
  - Added CLI end-to-end tests verifying subprocess execution, flags (`--help`, `-V`, `--json`, `--ai`), and stdout pipelines.
  - Added Ink UI terminal component tests using `ink-testing-library`.
- **Circular Dependency Inspector**:
  - Traces AST module dependency graphs to detect and report cross-file circular dependency cycles.
- **Inline Comment Suppression**:
  - Directives supported: `// tscheck-ignore-next-line <rule>`, `// tscheck-disable-next-line <rule>`, and block comments `/* tscheck-disable */` ... `/* tscheck-enable */`.
  - Supports rule-specific keywords: `deprecated`, `unused`, `any`, `circular`, `all`.
- **Git Staged & Diff Filtering (`--staged` / `--since <ref>`)**:
  - Instant sub-second pre-commit audits with `tscheck --staged`.
  - PR checks against branches with `tscheck --since main`.
- **Auto-Fixer Engine (`--fix`)**:
  - Safely auto-prefixes unused variables and parameters with `_` to meet strict TypeScript standards without breaking runtime code.
- **GitHub Actions CI Annotations (`--format github`)**:
  - Emits native workflow command annotations (`::warning`, `::error`) directly on GitHub PR diffs.

---

## [0.1.0] - 2026-08-25

### Added
- Initial release of `@masumdev/tscheck` with Ink CLI, AST deprecation engine, unused variables check, and strict `any` detection.
