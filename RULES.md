# Mandatory Development Rules — Masum Dev Monorepo

Every contributor and AI coding assistant working on this monorepo **MUST** strictly adhere to the following rules when creating a new library or adding/modifying components.

---

## 🚨 MANDATORY THREE-STEP RULE FOR NEW LIBRARIES & COMPONENTS

Whenever a new package (`packages/<name>`) or a new component/API is added or modified, you **MUST** complete all 3 required steps below:

### Rule 1: Native Playground Sample (`apps/native`) 📱
- Every new component or library **MUST** have a dedicated, interactive demo screen inside `apps/native/app/`.
- The sample screen must showcase:
  - Component props controls & variant toggles.
  - Interactive callbacks and state updates.
  - Light mode & Dark mode visual rendering.

### Rule 2: Web Documentation (`apps/docs`) 🌐
- Every new component or library **MUST** have official MDX documentation pages inside `apps/docs/src/content/docs/`.
- Documentation pages must include:
  - **Overview & Installation** guide (`bun add @masumdev/<name>`).
  - **Props & API Table** describing all parameters, default values, and types using `<TypeTable />`.
  - **Code Snippet Examples** with copyable Expressive Code blocks.
  - Proper frontmatter (`title`, `description`) and updated sidebar entries in `apps/docs/astro.config.mjs`.

### Rule 3: Package README Update (`packages/<name>/README.md`) 📝
- Every new component, feature addition, or API change **MUST** be recorded in the corresponding package's `README.md` (`packages/<name>/README.md`).
- Update the feature list, version history/changelog, and usage examples inside that specific package folder.

---

## ⚙️ WORKSPACE INTEGRITY & VERIFICATION RULES

1. **No Untested Commits**: Run `bun run build` across the monorepo before declaring work complete.
2. **Title Case Navigation**: Keep all sidebar and navigation titles in **Title Case** (`RN UI`, `RN Tajweed Verse`, `RN QR Code Gen`).
3. **Starlight Search Sync**: Ensure new MDX pages maintain valid frontmatter (`title`, `description`) so Pagefind indexes them automatically.
4. **🚫 Zero-Bounce Animation Policy (`NO_BOUNCE`)**:
   - **DO NOT USE BOUNCY SPRINGS**: Interactive UI controls (Sliders, RangeSliders, RadioGroups, Checkboxes, Switches, Tabs, Selects, Comboboxes, Modals, Drawers) **MUST NOT** use bouncy springs (`withSpring` with overshoot/bouncing damping).
   - **USE SMOOTH TIMING / DIRECT TRACKING**: Always use smooth linear/ease transitions (`withTiming` with 100ms–160ms duration) or direct gesture tracking so controls feel snappy, professional, and precise without rubber-band or bounce artifacts.
5. **🚫 No Emojis in Code & UI Labels**: Never use emojis anywhere in component code, docs tables, or UI text.
6. **🧹 Zero Deprecation & Zero Unused Items**: All workspaces must pass `bun run audit` with 0 deprecations and 0 unused items.
7. **👤 Sample Persona**: If demo/sample names or emails are required, always use "Ma'sum" and "masum@example.com".
