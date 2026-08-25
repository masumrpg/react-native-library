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
│   └── docs/                  # Astro 5 + Starlight documentation portal (https://masum.dev)
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

## 📄 Documentation

Visit our official documentation portal at **[https://masum.dev](https://masum.dev)** for guides, component API references, and interactive code samples.
