# Project Context — Masum Dev Monorepo

Welcome to the **Masum Dev** React Native & Expo Library Workspace. This project is structured as a **Turborepo** monorepo using **Bun** workspaces for high-performance cross-platform mobile library development.

---

## 🏛️ Architecture & Ecosystem

```
.
├── packages/                  # Open-source React Native / Expo libraries (@masumdev/*)
│   ├── rn-ui/                 # Typed flat UI kit (55+ components, design tokens, light/dark mode)
│   ├── rn-tajweed-verse/      # Tajweed Quranic verse parser & renderer with interactive tooltips
│   └── react-native-qr-code-gen/ # SVG QR code generator with custom eye shapes & presets
├── apps/
│   ├── native/                # Interactive Expo playground app (iOS / Android / Web)
│   └── docs/                  # Astro 5 + Starlight documentation portal (https://masum.dev)
├── CONTEXT.md                 # Monorepo architecture & domain context (this file)
├── RULES.md                   # Mandatory development & contribution rules
├── README.md                  # Monorepo setup & getting started guide
└── turbo.json                 # Turborepo task orchestration
```

---

## 🛠️ Technology Stack

- **Package Manager**: Bun 1.1+ (Workspace protocol)
- **Monorepo Engine**: Turborepo 2.x
- **Documentation Platform**: Astro 5 + `@astrojs/starlight` + Pagefind Search Engine
- **Mobile Playground**: Expo SDK 50+ with Expo Router (iOS, Android, Web)
- **Styling & Design System**: Custom HSL color tokens (`#3da441` Emerald Green primary), Night Owl & Catppuccin theme accents
- **Compiler & Bundler**: `tsup` & `react-native-builder-bob`

---

## 🎨 Design System & Branding

- **Brand Name**: `Masum Dev`
- **Primary Accent**: Emerald Green (`#3da441`)
- **Theme Support**: Dynamic Light & Dark Mode with system preference auto-detection.
