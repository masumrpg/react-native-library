# Masum Dev — Open Source Monorepo

[![License: MIT](https://img.shields.io/badge/License-MIT-33CDCF.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_Zero_Any-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Built with Bun](https://img.shields.io/badge/Built_with-Bun-fbf0df.svg?style=flat-square)](https://bun.sh)
[![Turborepo](https://img.shields.io/badge/Turborepo-Monorepo-000000.svg?style=flat-square&logo=turborepo)](https://turbo.build/)
[![XERJ Corpus Hub contributor](https://hub.xerj.org/contributors/masumrpg/badge.svg)](https://hub.xerj.org/contributors/masumrpg)

Welcome to the **Masum Dev** monorepo. This workspace houses high-performance open-source libraries, developer CLI tooling, document publishing engines, cross-platform React Native & Expo UI kits, and documentation portals.

---

## 📁 Repository Structure

```
.
├── packages/                  # Open-source packages & libraries (@masumdev/*)
│   ├── markforge/             # Multi-format document publishing engine & CLI (PDF, DOCX, HTML, TXT)
│   ├── tscheck/               # TypeScript & AST code auditing engine & interactive CLI
│   ├── rn-ui/                 # Typed flat UI kit for React Native & Expo (63+ components, design tokens)
│   ├── rn-tajweed-verse/      # Quranic verse Tajweed parser & interactive renderer
│   └── rn-qr-code/            # High-performance SVG QR code generator with presets & async mode
├── apps/
│   ├── native/                # Interactive Expo mobile playground app (iOS / Android / Web)
│   ├── cli/
│   │   └── markforge/         # MarkForge publishing engine testing & playground environment
│   └── docs/                  # Astro 5 + Starlight documentation portal (https://react-native-library-docs.vercel.app)
├── scripts/                   # Workspace maintenance, publishing & audit scripts
├── .agents/                   # Centralized AI agent directives, skills, and configuration
├── README.md                  # Monorepo setup & getting started guide
└── turbo.json                 # Turborepo task orchestration
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
bun install
```

### 2. Run Documentation Portal (`apps/docs`)
```bash
bun dev:docs
```
Open [http://localhost:4321](http://localhost:4321) in your browser.

### 3. Run Native Playground App (`apps/native`)
```bash
bun dev:native
```

### 4. Build All Packages & Web Applications
```bash
bun run build
```

---

## 📦 Publishing Packages to NPM

This monorepo includes a dynamic package publisher script (`scripts/publish-package.ts`) that automatically builds, optionally bumps versions, and publishes packages to the npm registry.

### Basic Publish Command
```bash
bun run publish <package-name> [patch|minor|major]
```

### Examples
```bash
# 1. Publish @masumdev/rn-qr-code with current version
bun run publish rn-qr-code

# 2. Bump patch version (e.g. 0.2.0 -> 0.2.1) and publish
bun run publish rn-qr-code patch

# 3. Bump minor version (e.g. 0.3.0 -> 0.4.0) and publish
bun run publish rn-ui minor

# 4. Bump patch version and publish @masumdev/rn-tajweed-verse
bun run publish rn-tajweed-verse patch

# 5. Show help & list all publishable packages in the monorepo
bun run publish --help
```

> **Note:** Any new package created inside `packages/<name>` will be automatically discovered by `bun run publish` without needing configuration updates in `package.json`.

---

## 🔍 TypeScript AST Code Audit (`@masumdev/tscheck`)

This monorepo includes `@masumdev/tscheck`, a modern TypeScript AST audit CLI with interactive terminal UI (powered by Ink) and type-safe configuration.

### Run Codebase Audit (Generates JSON, Markdown & HTML Reports)
```bash
bun run audit
```

### Interactive Explorer Mode
```bash
bun packages/tscheck/dist/cli.mjs -i
```

### Type-Safe Configuration (`tscheck.config.ts`)
Configure audits with full IDE autocompletion using `defineConfig` and `Editor` Enums:
```typescript
import { defineConfig, Editor } from "@masumdev/tscheck";

export default defineConfig({
  rootDir: process.cwd(),
  workspaces: ["packages/*", "apps/*"],
  editor: Editor.VSCODE,
});
```

---

## 📑 Multi-Format Document Publishing (`@masumdev/markforge`)

This monorepo includes `@masumdev/markforge`, a high-fidelity Markdown and MDX publishing engine with an interactive terminal UI that transforms Markdown into publication-grade **PDF**, **DOCX**, **HTML**, and **TXT** files.

### Compile Documents
```bash
# Compile a markdown document via CLI
bun run markforge ./docs/document.md

# Compile with explicit format targets
bun run markforge ./docs/document.md --to pdf,docx,html
```

### Live-Reload Preview Server
```bash
bun run markforge ./docs/document.md --serve --port 3000
```

### Type-Safe Configuration (`markforge.config.ts`)
```typescript
import { defineConfig, OutputFormat, Theme, Orientation, PaperSizeEnum } from "@masumdev/markforge";

export default defineConfig({
  title: "Enterprise Architecture Specification",
  to: [OutputFormat.PDF, OutputFormat.DOCX, OutputFormat.HTML],
  theme: Theme.CORPORATE,
  paperSize: PaperSizeEnum.A4,
  toc: true,
  math: true,
});
```

---

## 📄 Documentation

Visit our official documentation portal at **[https://react-native-library-docs.vercel.app](https://react-native-library-docs.vercel.app)** for guides, component API references, and interactive code samples.

