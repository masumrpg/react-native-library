---
name: publish-package
description: Workflow and instructions for publishing open-source packages in the monorepo to the npm registry.
---

# Package Publishing Workflow (`scripts/publish-package.ts`)

This skill documents how to publish open-source packages from `packages/` to the npm registry using the centralized dynamic publisher script.

---

## 🛠️ Command Reference

```bash
bun run publish <package-name> [patch|minor|major]
```

### Parameter Breakdown
- `<package-name>`: Folder name in `packages/` (e.g. `rn-qr-code`, `rn-ui`, `rn-tajweed-verse`, `tscheck`) or full npm scope (`@masumdev/rn-qr-code`).
- `[patch|minor|major]` *(Optional)*: Semver bump keyword. If omitted, the package publishes with its existing version in `package.json`.

---

## 📋 Standard Step-by-Step Procedure

1. **Verify Quality & Type Safety**:
   ```bash
   bun run audit
   ```
   Ensure 0 Deprecated usages, 0 Unused items, and 0 explicit `any` types.

2. **Publish Package with Version Bump**:
   ```bash
   bun run publish rn-qr-code patch
   ```
   The script automatically executes:
   - Version bump (`npm version <bump> --no-git-tag-version`).
   - Isolated Turborepo build (`turbo run build --filter=@masumdev/<name>`).
   - NPM publication (`bun publish --access public`).

3. **Update Docs Changelog**:
   After publishing a new version, update `apps/docs/src/content/docs/<package>/changelog.mdx` with release notes.

4. **Verify Documentation Build**:
   ```bash
   bun --cwd apps/docs run build
   ```

---

## 💡 Dynamic Package Discovery

The publisher script scans `packages/*/package.json` dynamically and filters out packages with `"private": true`. When a new library is added to `packages/`, it is immediately available for publishing without modifying the root `package.json`.
