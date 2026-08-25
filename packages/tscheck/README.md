# @masumdev/tscheck

Modern, high-performance TypeScript AST code audit CLI and engine with an interactive terminal UI powered by Ink and type-safe configuration.

---

## Features

- **AST Deprecation Detection**: Identifies usages of deprecated functions, classes, properties, and types tagged with JSDoc `@deprecated`.
- **Unused Diagnostics**: Pinpoints unused variables, parameters, and imports across all workspace packages.
- **Strict Any Type Auditing**: Flags explicit `any` type annotations, assertions, and generic parameters.
- **Interactive Terminal UI**: Built with [Ink](https://github.com/vadimdemedes/ink) (React for CLI), featuring real-time workspace scanning and clean metric tables.
- **Zero Emoji Policy**: Clean, minimalist terminal interface using box-drawing borders and status badges.
- **Type-Safe Configuration**: Full autocompletion and JSDoc metadata support via `defineConfig()`.
- **Automated Report Generation**: Exports machine-readable `audit-report.json` and formatted `audit-report.md`.

---

## Installation

Install globally or as a project devDependency:

```bash
# Global installation
npm install -g @masumdev/tscheck
# or
bun add -g @masumdev/tscheck

# Local project installation
bun add -D @masumdev/tscheck
```

---

## CLI Usage

Run directly via `npx` or `bun`:

```bash
# Run audit against current project or monorepo
npx tscheck
# or
bun tscheck

# Specify custom config file path
tscheck -c ./custom/tscheck.config.ts

# Specify custom report output directory
tscheck -o .temp/reports

# Run in CI mode (fail on warning / violations)
tscheck --fail-on-warning

# Output pure JSON to stdout (for CI pipelines)
tscheck --json
```

### CLI Options

| Flag | Description | Default |
| :--- | :--- | :--- |
| `-c, --config <path>` | Path to custom tscheck configuration file | Auto-detected |
| `-o, --output <dir>` | Custom directory to write audit reports | `.temp/tscheck` |
| `--no-deprecated` | Disable deprecated API usages check | `false` |
| `--no-unused` | Disable unused variables/imports check | `false` |
| `--no-any` | Disable explicit any usages check | `false` |
| `-i, --interactive` | Launch interactive terminal search dashboard | `false` |
| `--fail-on-warning` | Exit with non-zero exit code if violations are found | `false` |
| `--json` | Output pure JSON to stdout without Ink UI | `false` |
| `-V, --version` | Output version number | |
| `-h, --help` | Display help screen | |

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
    "noExplicitAny": true
  },
  "reporters": {
    "outputDir": ".temp/tscheck",
    "json": true,
    "markdown": true,
    "jsonFileName": "audit-report.json",
    "markdownFileName": "audit-report.md"
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
reporters:
  outputDir: .temp/tscheck
  json: true
  markdown: true
failOnWarning: false
```

### 3. TypeScript Configuration (`tscheck.config.ts`)

```typescript
import { defineConfig } from "@masumdev/tscheck";

export default defineConfig({
  rootDir: process.cwd(),
  workspaces: ["packages/*", "apps/*"],
  rules: {
    deprecated: true,
    unused: true,
    noExplicitAny: true,
  },
  reporters: {
    outputDir: ".temp/tscheck",
  },
});
```

---

## Programmatic API

You can also run `@masumdev/tscheck` programmatically within your Node or Bun scripts:

```typescript
import { audit, writeAuditReports, defineConfig } from "@masumdev/tscheck";

const report = await audit({
  rootDir: process.cwd(),
  rules: {
    deprecated: true,
    unused: true,
    noExplicitAny: true,
  },
});

console.log(`Files scanned: ${report.summary.filesScanned}`);
console.log(`Deprecated usages: ${report.summary.totalDeprecatedUsages}`);

// Save reports to disk
writeAuditReports(report, {
  reporters: {
    outputDir: ".temp/tscheck",
  },
});
```

---

## License

MIT © [Ma'sum](https://github.com/masumrpg)
