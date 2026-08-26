# @masumdev/tscheck

[![npm version](https://img.shields.io/npm/v/@masumdev/tscheck.svg?style=flat-square&color=3da441)](https://www.npmjs.com/package/@masumdev/tscheck)
[![CI](https://github.com/masumrpg/react-native-library/actions/workflows/ci.yml/badge.svg)](https://github.com/masumrpg/react-native-library/actions)
[![Coverage](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg?style=flat-square)](https://react-native-library-docs.netlify.app/tscheck/)
[![Tests](https://img.shields.io/badge/Tests-61%20Passed-brightgreen.svg?style=flat-square)](https://react-native-library-docs.netlify.app/tscheck/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> **Modern, high-performance TypeScript AST code audit CLI & engine for Turborepos and Monorepos.**

Audits codebases for **deprecated API usages**, **unused variables/parameters/imports**, **explicit `any` types**, and **circular dependencies** with **100% AST precision** and zero `any` tolerance.

---

## Features

- **AST Deprecation Detection**: Identifies usages of deprecated functions, classes, properties, and types tagged with JSDoc `@deprecated` with origin package identification and suggested fixes.
- **Unused Diagnostics**: Pinpoints unused variables, parameters, and imports across all workspace packages.
- **Strict Any Type Auditing**: Flags explicit `any` type annotations, assertions, and generic parameters.
- **Circular Dependency Detection**: Traces AST import/export graphs and detects circular module dependency cycles.
- **Local HTTP Report Server (`--serve [port]`)**: Instantly launches a local server to view the rich interactive HTML report with custom port and auto-fallback.
- **Auto Browser Launcher (`-O, --open`)**: Automatically opens the generated report in Google Chrome / default browser.
- **AI Token-Efficient Remediation (`--ai` / `--format ai`)**: Generates compact, structured prompt context for AI LLMs (Claude, ChatGPT, Gemini, Antigravity) with zero token bloat.
- **Multi-IDE Deep Linking**: 1-click jump from HTML report directly into **VS Code**, **Cursor**, **Antigravity IDE**, **Windsurf**, **Zed**, **WebStorm**, **Sublime Text**, and **VS Code Insiders** at the exact line and column.
- **Same-Line AST Deduplication**: Eliminates duplicate violation cards on overlapping method calls.
- **Group-By View Switcher**: Interactive report toggle between **Flat List**, **Group by File**, **Group by Rule**, and **Group by Package**.
- **1-Click Copy Actions**: Instant copy for code snippets, ignore directives (`// tscheck-ignore-next-line <rule>`), and AI prompts.
- **Git Staged & Diff Filtering**: Instant pre-commit and CI PR audits with `--staged` and `--since <ref>`.
- **Auto-Fixer Mode (`--fix`)**: Safely auto-prefixes unused variables and parameters with an underscore `_`.
- **GitHub Actions CI Annotations**: Output native workflow commands with `--format github`.
- **Interactive Terminal UI**: Built with [Ink](https://github.com/vadimdemedes/ink) (React for CLI) with real-time workspace scanning and search.
- **Zero Emoji Policy**: Clean, minimalist terminal interface using box-drawing borders and status badges.
- **100% Test Coverage**: Fully verified across 61 comprehensive unit, UI, AST rule, and CLI E2E tests.

---

## Installation

```bash
# Global installation (recommended for CLI usage)
bun add -g @masumdev/tscheck

# Or add to project devDependencies
bun add -d @masumdev/tscheck
# npm install -D @masumdev/tscheck
# pnpm add -D @masumdev/tscheck
```

---

## CLI Usage

Run `tscheck` in any TypeScript workspace or monorepo root:

```bash
# Basic audit across all workspace projects
tscheck

# Audit, generate reports, and automatically launch in Chrome
tscheck -O

# Start local report server on custom port 3000 and open browser
tscheck --serve 3000 --open

# Output dense, token-efficient AI remediation prompt for LLMs
tscheck --ai

# Fast audit on git staged files before commit (Husky / lint-staged)
tscheck --staged

# Audit PR changes against main branch
tscheck --since origin/main

# Automatically prefix unused variables and parameters with underscore (_)
tscheck --fix

# Launch interactive terminal UI with live search filter
tscheck --interactive

# CI Mode: Emit GitHub Actions error/warning annotations
tscheck --format github --fail-on-warning

# Output raw JSON to stdout (headless integration)
tscheck --json
```

### CLI Options

| Flag | Description | Default |
| :--- | :--- | :--- |
| `-c, --config <path>` | Path to custom tscheck configuration file | Auto-detected |
| `-o, --output <dir>` | Custom directory to write audit reports | `.temp/tscheck` |
| `-s, --serve [port]` | Start local HTTP server to view the interactive HTML report | `true` (port: `5500`) |
| `--no-serve` | Disable starting local HTTP report server after audit | `false` |
| `-O, --open` | Automatically open the HTML report in your default browser | `false` |
| `--editor <editor>` | Default editor scheme (`vscode`, `cursor`, `antigravity`, `windsurf`, `zed`, `webstorm`, `sublime`) | `vscode` |
| `--ai` | Output token-efficient AI prompt markdown to stdout | `false` |
| `--staged` | Only scan files currently staged in Git | `false` |
| `--since <ref>` | Only scan files changed since a specific git branch/commit | |
| `--fix` | Automatically fix safe issues (prefix unused identifiers with `_`) | `false` |
| `-f, --format <format>` | Output format: `pretty`, `json`, `github`, or `ai` | `pretty` |
| `-i, --interactive` | Launch interactive terminal search dashboard | `false` |
| `--no-deprecated` | Disable deprecated API usages check | `false` |
| `--no-unused` | Disable unused variables/imports check | `false` |
| `--no-any` | Disable explicit any usages check | `false` |
| `--no-circular` | Disable circular module dependency check | `false` |
| `--fail-on-warning` | Exit with non-zero exit code if violations are found | `false` |
| `--json` | Output pure JSON to stdout without Ink UI | `false` |
| `-V, --version` | Output version number | |
| `-h, --help` | Display help screen | |

---

## Configuration

`tscheck` supports **JSON**, **YAML**, and **TypeScript/JavaScript** configuration files with built-in JSON Schema autocompletion in VS Code, Cursor, and Zed.

### JSON Configuration (`.tscheckrc.json` or `tscheck.config.json`)

```json
{
  "$schema": "https://raw.githubusercontent.com/masumrpg/react-native-library/main/packages/tscheck/schema.json",
  "rootDir": ".",
  "workspaces": ["packages/*", "apps/*"],
  "exclude": ["node_modules", "dist", "build", ".expo", ".turbo", ".temp"],
  "rules": {
    "deprecated": true,
    "unused": true,
    "noExplicitAny": true,
    "circular": true
  },
  "reporters": {
    "outputDir": ".temp/tscheck",
    "json": true,
    "markdown": true,
    "html": true,
    "ai": true,
    "serve": false,
    "open": false,
    "port": 5500,
    "editor": "vscode",
    "githubAnnotations": false
  },
  "failOnWarning": false
}
```

---

## Author & Credits

Created with ❤️ by **[Ma'sum](https://github.com/masumrpg)**

- **GitHub Profile**: [@masumrpg](https://github.com/masumrpg)
- **Monorepo Repository**: [react-native-library](https://github.com/masumrpg/react-native-library)
- **Documentation Portal**: [https://react-native-library-docs.netlify.app](https://react-native-library-docs.netlify.app)

---

## License

MIT © [Ma'sum](https://github.com/masumrpg)
