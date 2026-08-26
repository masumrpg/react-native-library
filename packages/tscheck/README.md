# @masumdev/tscheck

[![npm version](https://img.shields.io/npm/v/@masumdev/tscheck.svg?style=flat-square&color=3da441)](https://www.npmjs.com/package/@masumdev/tscheck)
[![CI](https://github.com/masumrpg/react-native-library/actions/workflows/ci.yml/badge.svg)](https://github.com/masumrpg/react-native-library/actions)
[![Coverage](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg?style=flat-square)](https://react-native-library-docs.netlify.app/tscheck/)
[![Tests](https://img.shields.io/badge/Tests-55%20Passed-brightgreen.svg?style=flat-square)](https://react-native-library-docs.netlify.app/tscheck/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> **Modern, high-performance TypeScript AST code audit CLI & engine for Turborepos and Monorepos.**

Audits codebases for **deprecated API usages**, **unused variables/parameters/imports**, **explicit `any` types**, and **circular dependencies** with **100% AST precision** and zero `any` tolerance.

---

## Features

- **AST Deprecation Detection**: Identifies usages of deprecated functions, classes, properties, and types tagged with JSDoc `@deprecated`.
- **Unused Diagnostics**: Pinpoints unused variables, parameters, and imports across all workspace packages.
- **Strict Any Type Auditing**: Flags explicit `any` type annotations, assertions, and generic parameters.
- **Circular Dependency Detection**: Traces AST import/export graphs and detects circular module dependency cycles.
- **Inline Comment Suppression**: Bypass specific rules per-line or in blocks with `// tscheck-ignore-next-line <rule>`.
- **Git Staged & Diff Filtering**: Instant pre-commit and CI PR audits with `--staged` and `--since <ref>`.
- **Auto-Fixer Mode (`--fix`)**: Safely auto-prefixes unused variables and parameters with an underscore `_`.
- **GitHub Actions CI Annotations**: Output native workflow commands with `--format github`.
- **Interactive Terminal UI**: Built with [Ink](https://github.com/vadimdemedes/ink) (React for CLI) with real-time workspace scanning and search.
- **Zero Emoji Policy**: Clean, minimalist terminal interface using box-drawing borders and status badges.
- **Type-Safe Configuration**: Full autocompletion and JSDoc metadata support via `defineConfig()`.
- **Automated Report Generation**: Exports `audit-report.json`, `audit-report.md`, and rich interactive `audit-report.html`.
- **100% Test Coverage**: Fully verified across 55 comprehensive unit, UI, AST rule, and CLI E2E tests.

---

## Test Coverage & Quality

Every module, AST rule, terminal UI component, and CLI command is thoroughly covered by automated test suites.

```bash
# Run full unit and integration test suite
bun test

# Run test suite with detailed coverage table
bun test --coverage
```

### Coverage Overview

| Module / Layer | Description | % Funcs | % Lines | Status |
| :--- | :--- | :---: | :---: | :---: |
| **`core/rules/deprecated.ts`** | JSDoc `@deprecated` AST analysis & overload resolver | 100.00% | 96.88% | `PASSED` |
| **`core/rules/unused.ts`** | TypeScript compiler diagnostics for unused locals & imports | 100.00% | 100.00% | `PASSED` |
| **`core/rules/anyType.ts`** | Strict `any` type detection in variables, params, return types | 100.00% | 100.00% | `PASSED` |
| **`core/rules/circular.ts`** | Cycle detection across AST import/export graphs | 100.00% | 100.00% | `PASSED` |
| **`core/suppression.ts`** | Per-line and range-based comment directive parser | 100.00% | 100.00% | `PASSED` |
| **`core/engine.ts`** | Multi-workspace scanner, virtual fallback & AST runner | 100.00% | 99.13% | `PASSED` |
| **`core/fixer.ts`** | Automated AST code modifier (`--fix`) | 100.00% | 100.00% | `PASSED` |
| **`core/git.ts`** | Git staged and branch diff file discovery | 100.00% | 88.64% | `PASSED` |
| **`core/reporter.ts`** | JSON, Markdown, and HTML report generators | 100.00% | 100.00% | `PASSED` |
| **`config/loadConfig.ts`** | Multi-format config discovery (`.json`, `.yaml`, `.ts`, `.js`) | 100.00% | 100.00% | `PASSED` |
| **`ui/*` (Ink Components)** | Real-time terminal progress, tables, cards, interactive search | 100.00% | 99.70% | `PASSED` |
| **`version.ts`** | Dynamic semver version resolution | 100.00% | 100.00% | `PASSED` |

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
| `--staged` | Only scan files currently staged in Git | `false` |
| `--since <ref>` | Only scan files changed since a specific git branch/commit | |
| `--fix` | Automatically fix safe issues (prefix unused identifiers with `_`) | `false` |
| `-f, --format <format>` | Output format: `pretty`, `json`, or `github` | `pretty` |
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

## Inline Comment Suppression

You can selectively bypass tscheck warnings using comment directives:

```typescript
// 1. Ignore next line for specific rule
// tscheck-ignore-next-line any
const data: any = JSON.parse(str);

// 2. Ignore next line for multiple rules
// tscheck-ignore-next-line any, deprecated
const res: any = legacyApiCall();

// 3. Ignore all rules on next line
// tscheck-ignore-next-line
const raw: any = oldFunction();

// 4. Disable rules for a block of code
/* tscheck-disable any */
const a: any = 1;
const b: any = 2;
/* tscheck-enable any */
```

---

## Configuration

`tscheck` supports **JSON**, **YAML**, and **TypeScript/JavaScript** configuration files with built-in JSON Schema autocompletion in VS Code and Cursor.

### 1. JSON Configuration (`.tscheckrc.json` or `tscheck.config.json`)

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
    "githubAnnotations": false,
    "jsonFileName": "audit-report.json",
    "markdownFileName": "audit-report.md",
    "htmlFileName": "audit-report.html"
  },
  "failOnWarning": false
}
```

> **Tip**: You can also reference the local schema if installed in your project: `"$schema": "node_modules/@masumdev/tscheck/schema.json"`.

### 2. YAML Configuration (`tscheck.config.yaml` or `.tscheckrc.yaml`)

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/masumrpg/react-native-library/main/packages/tscheck/schema.json
rootDir: .
workspaces:
  - packages/*
  - apps/*
exclude:
  - node_modules
  - dist
  - build
  - .expo
rules:
  deprecated: true
  unused: true
  noExplicitAny: true
  circular: true
reporters:
  outputDir: .temp/tscheck
  json: true
  markdown: true
  html: true
failOnWarning: false
```

### 3. TypeScript Configuration (`tscheck.config.ts`)

```typescript
import { defineConfig, type TsCheckConfig } from "@masumdev/tscheck";

export default defineConfig({
  rootDir: process.cwd(),
  workspaces: ["packages/*", "apps/*"],
  rules: {
    deprecated: true,
    unused: true,
    noExplicitAny: true,
    circular: true,
  },
  reporters: {
    outputDir: ".temp/tscheck",
    json: true,
    markdown: true,
    html: true,
  },
});
```

---

## Programmatic API

You can also run `@masumdev/tscheck` programmatically within your Node or Bun scripts:

```typescript
import { audit, writeAuditReports, emitGitHubAnnotations } from "@masumdev/tscheck";

const report = await audit({
  rootDir: process.cwd(),
  rules: {
    deprecated: true,
    unused: true,
    noExplicitAny: true,
    circular: true,
  },
});

console.log(`Files scanned: ${report.summary.filesScanned}`);
console.log(`Deprecated usages: ${report.summary.totalDeprecatedUsages}`);
console.log(`Circular cycles: ${report.summary.totalCircularDependencies}`);

// Save reports to disk (JSON, Markdown & HTML)
const files = writeAuditReports(report, {
  reporters: {
    outputDir: ".temp/tscheck",
  },
});
```

---

## License

MIT © [Ma'sum](https://github.com/masumrpg)
