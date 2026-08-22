# Masum Dev — React Native Monorepo

Welcome to the **Masum Dev** React Native & Expo package development workspace. This project is structured as a high-performance **Turborepo** monorepo using **Bun** workspaces for building, testing, and documenting modular mobile libraries.

---

## 🏗️ Workspace Architecture

This monorepo is organized into reusable packages and application environments:

```
.
├── packages/           # Open-source React Native & Expo libraries (@masumdev/*)
│   └── <package-name>/ # Independent package with its own build pipeline, types & README
├── apps/
│   ├── native/         # Interactive Expo playground app (iOS / Android / Web)
│   └── web/            # Fumadocs + Next.js official documentation portal
└── turbo.json          # Turborepo task orchestration pipeline
```

### 📦 Packages (`packages/`)

All libraries inside `packages/` follow these core principles:
- **TypeScript First**: Strict TypeScript definitions and pre-generated type declarations (`.d.ts`).
- **Pre-compiled Worklets**: Native reanimated worklets are pre-compiled using `react-native-builder-bob` or `tsup` for zero-config integration.
- **Expo SDK & React Native Compatible**: Designed for Expo SDK 50+ and React Native 0.73+.
- **Independent Versioning**: Each package maintains its own version history and is published independently to npm.

### 📱 Applications (`apps/`)

- **`apps/native`**: Interactive **Expo** application (using Expo Router) serving as a real-time playground for testing components and APIs on iOS, Android, and Web.
- **`apps/web`**: **Fumadocs** & **Next.js** documentation portal featuring full-text search, OpenGraph generation, and interactive package guides.

---

## 🚀 Quick Start

### 1. Install Dependencies

Install all dependencies across the monorepo from the root directory:

```bash
bun install
```

### 2. Launch the Mobile Playground (`apps/native`)

Start the Metro bundler and Expo playground:

```bash
bun dev:native
```

- Press **`a`** to launch in the Android Emulator.
- Press **`i`** to launch in the iOS Simulator.
- Scan the QR code with **Expo Go** to test on physical devices.

### 3. Launch the Documentation Portal (`apps/web`)

Start the local Fumadocs documentation dev server:

```bash
bun dev:web
```

Open `http://localhost:3000` in your browser to view the documentation site.

### 4. Build All Packages

Compile all packages and build applications across the workspace:

```bash
bun run build
```

---

## ➕ Adding a New Library

When adding a new package to `packages/`:

1. Create a new directory under `packages/<package-name>`.
2. Initialize `package.json` with the `@masumdev/<package-name>` naming scheme.
3. Include standard TypeScript configurations and build scripts using `tsup` or `builder-bob`.
4. Create a package `README.md` documenting installation, props, hooks, and usage examples.
5. Add interactive playground screens to `apps/native` and MDX documentation files to `apps/web/content/docs/`.

---

## 📄 Documentation Rule

Every library modification (API changes, new props, theme tokens, or new features) **must** be documented in:
1. The individual package `README.md` inside `packages/<package-name>/README.md`.
2. The corresponding Fumadocs MDX documentation page in `apps/web/content/docs/<package-name>/`.
