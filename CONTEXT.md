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
│   └── web/                   # Next.js 16 + Fumadocs documentation portal (https://masum.dev)
├── CONTEXT.md                 # Monorepo architecture & domain context (this file)
├── RULE.md                    # Mandatory development & contribution rules
├── README.md                  # Monorepo setup & getting started guide
└── turbo.json                 # Turborepo task orchestration
```

---

## 🛠️ Technology Stack

- **Package Manager**: Bun 1.1+ (Workspace protocol)
- **Monorepo Engine**: Turborepo 2.x
- **Documentation Platform**: Fumadocs UI v16 + Next.js 16 (App Router & Turbopack)
- **Mobile Playground**: Expo SDK 50+ with Expo Router (iOS, Android, Web)
- **Styling & Design System**: Custom HSL color tokens (`#3da441` Emerald Green primary), Catppuccin preset, Lucide React Icons
- **Compiler & Bundler**: `tsup` & `react-native-builder-bob` (pre-compiled Reanimated worklets)

---

## 🎨 Design System & Branding

- **Brand Name**: `Masum Dev`
- **Primary Accent**: Emerald Green (`#3da441`)
- **Typography**: System sans-serif with Title Case navigation labels (`RN UI`, `RN Tajweed Verse`, `RN QR Code Gen`)
- **Theme Support**: Dynamic Light & Dark Mode with system preference auto-detection.
