# Architecture & Tech Stack — Masum Dev Monorepo

Welcome to the **Masum Dev** React Native & Expo Library Workspace. This project is structured as a **Turborepo** monorepo using **Bun** workspaces for high-performance cross-platform mobile library development.

---

## 🏛️ Ecosystem Structure

```
.
├── packages/                  # Open-source React Native & Expo libraries (@masumdev/*)
│   ├── rn-ui/                 # Typed flat UI kit (63+ components, design tokens, light/dark mode)
│   ├── rn-tajweed-verse/      # Tajweed Quranic verse parser & renderer with interactive tooltips
│   ├── react-native-qr-code-gen/ # SVG QR code generator with custom eye shapes & presets
│   └── tscheck/               # TypeScript & AST checking module
├── apps/
│   ├── native/                # Interactive Expo playground app (iOS / Android / Web)
│   └── docs/                  # Astro 5 + Starlight documentation portal (https://masum.dev)
├── scripts/                   # Workspace maintenance & audit scripts (e.g. audit-codebase.ts)
├── .agents/                   # Centralized AI rules, skills, and configuration
├── turbo.json                 # Turborepo task orchestration
└── package.json               # Root workspace manifest
```

---

## 🛠️ Technology Stack & Versions

- **Package Manager**: Bun `1.3.11+` (Workspace protocol `workspace:*`)
- **Monorepo Engine**: Turborepo `2.10.x`
- **React & React Native**: React `19.2.3`, React Native `0.86.2`, Expo `^57.0.0`
- **Animation & Gestures**: React Native Reanimated `4.5.1` + React Native Gesture Handler `~2.32.0`
- **Documentation Platform**: Astro 5 + `@astrojs/starlight` + Starlight Sidebar Badges + Pagefind Search
- **Compiler & Bundler**: `tsup` & `react-native-builder-bob`
- **Code Audit Tooling**: Custom AST type checker (`scripts/audit-codebase.ts`)

---

## ⚡ Workspace Commands

| Command | Purpose |
| :--- | :--- |
| `bun run dev:native` | Run Expo playground app with live watch on `@masumdev/*` libraries |
| `bun run dev:docs` | Run Astro 5 + Starlight documentation portal locally |
| `bun run build` | Build all packages and documentation via Turbo |
| `bun run audit` | Scan for deprecated APIs, unused variables, and explicit `any` types |
| `bun run format` | Run Prettier across TypeScript, Markdown, and JSON files |
| `bun run clean` | Clean build caches and remove node_modules |

---

## 🎨 Design System & Branding

- **Brand Name**: `Masum Dev`
- **Primary Accent**: Emerald Green (`#3da441`)
- **Theme Support**: Dynamic Light & Dark Mode with system preference auto-detection.
- **Author**: Ma'sum (`masum@example.com`)
