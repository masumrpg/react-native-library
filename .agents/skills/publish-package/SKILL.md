---
name: publish-package
description: Workflow and instructions for publishing open-source packages in the monorepo to the npm registry.
---

# Monorepo Publishing Workflows

This document outlines both the **automated CI pipeline** and the **manual publisher script** for publishing packages in the Masum Dev monorepo to the NPM registry with cryptographic provenance (`--provenance`).

---

## 🚀 1. Automated CI Pipeline (Recommended)

When pull requests or commits are merged into `main`, GitHub Actions automatically evaluates all packages in `packages/*` and publishes those whose version was bumped.

### How It Works:
1. **Gatekeeper Validation**: The `test-and-audit` job runs first (`bun run build`, unit tests, `bun run audit`). If any step fails, publishing is blocked.
2. **Registry Comparison**: The script `scripts/publish-changed.ts` queries the live NPM registry for each non-private package in `packages/*`.
3. **Change Detection**:
   - If local `package.json` version > live NPM registry version: **PUBLISH**.
   - If package does not exist on NPM yet (HTTP 404): **PUBLISH** (new package).
   - If local `package.json` version <= live NPM registry version: **SKIP** (up to date).
4. **Isolated Turborepo Build**: Runs `turbo run build --filter=<package-name>`.
5. **NPM Publication with Provenance**: Publishes with `npm publish --access public --provenance` using GitHub OIDC.
6. **Git Tagging & GitHub Release**: Automatically creates and pushes git tag `<package-name>@<version>` and creates a GitHub Release with auto-generated release notes.

### Required GitHub Repository Secrets:
- `NPM_TOKEN`: An automation or granular publish token generated from [npmjs.com](https://www.npmjs.com) with publish permissions for the `@masumdev` scope.

---

## 🔍 Pre-flight Dry-Run Check

To preview what packages would be published without actually publishing or touching git:

```bash
bun run publish:changed --dry-run
```

---

## 🛠️ 2. Manual Publisher (`scripts/publish-package.ts`)

For ad-hoc local publishing or explicit manual bumps:

```bash
bun run publish <package-name> [patch|minor|major]
```

### Parameter Breakdown
- `<package-name>`: Folder name in `packages/` (e.g. `markforge`, `rn-qr-code`, `rn-ui`, `rn-tajweed-verse`, `tscheck`) or full npm scope (`@masumdev/markforge`).
- `[patch|minor|major]` *(Optional)*: Semver bump keyword. If omitted, the package publishes with its existing version in `package.json`.

---

## 📋 Standard Manual Step-by-Step Procedure

1. **Verify Quality & Type Safety**:
   ```bash
   bun run audit
   ```
   Ensure 0 Deprecated usages, 0 Unused items, and 0 explicit `any` types.

2. **Publish Package with Version Bump**:
   ```bash
   bun run publish rn-qr-code patch
   ```

3. **Update Docs Changelog**:
   After publishing a new version, update `apps/docs/src/content/docs/<package>/changelog.mdx` with release notes.

4. **Verify Documentation Build**:
   ```bash
   bun --cwd apps/docs run build
   ```

---

## 💡 Dynamic Package Discovery

Both publisher scripts scan `packages/*/package.json` dynamically and filter out packages with `"private": true`. When a new library is added to `packages/`, it is immediately detected and supported without modifying configuration files.
