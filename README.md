# Masum Dev — React Native & Expo Monorepo

Welcome to **Masum Dev** monorepo repository. This project contains high-performance open-source libraries for React Native and Expo, an interactive mobile playground app, and an Astro Starlight documentation portal.

---

## 📁 Repository Structure

```
.
├── packages/                  # Open-source React Native / Expo libraries (@masumdev/*)
│   ├── rn-ui/                 # Typed flat UI kit (63+ components, design tokens, light/dark mode)
│   ├── rn-tajweed-verse/      # Tajweed Quranic verse parser & renderer with tooltips
│   ├── rn-qr-code/            # Single-path SVG QR code generator with presets & async mode
│   └── tscheck/               # TypeScript & AST auditing module
├── apps/
│   ├── native/                # Interactive Expo playground app (iOS / Android / Web)
│   └── docs/                  # Astro 5 + Starlight documentation portal (https://react-native-library-docs.netlify.app)
├── CONTEXT.md                 # Monorepo architecture & domain context
├── RULES.md                   # Mandatory development & contribution rules
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

### JSON / YAML Schema URL
Use the official JSON Schema for autocompletion in `.tscheckrc.json` or `tscheck.config.yaml`:
```
https://raw.githubusercontent.com/masumrpg/react-native-library/main/packages/tscheck/schema.json
```

---

## 📄 Documentation

Visit our official documentation portal at **[https://react-native-library-docs.netlify.app](https://react-native-library-docs.netlify.app)** for guides, component API references, and interactive code samples.

