# Mandatory Contribution Rules — Masum Dev Monorepo

Every contributor and AI coding assistant working on this monorepo **MUST** strictly adhere to the following workflow when creating a new library or adding/modifying components.

---

## 🚨 MANDATORY THREE-STEP RULE FOR NEW LIBRARIES & COMPONENTS

Whenever a new package (`packages/<name>`) or a new component/API is added or modified, you **MUST** complete all 3 required steps below:

### Rule 1: Native Playground Sample (`apps/native`) 📱
- Every new component or library **MUST** have a dedicated, interactive showcase inside `apps/native/components/rn-ui/sections/` and registered in `apps/native/components/rn-ui/index.ts` & `apps/native/app/rn-ui/[id].tsx`.
- The sample screen must showcase:
  - Component props controls & variant toggles.
  - Interactive callbacks and state updates.
  - Light mode & Dark mode visual rendering.
  - Form validation with Zod (if it is a form primitive in `FormSection.tsx`).

### Rule 2: Web Documentation (`apps/docs`) 🌐
- Every new component or library **MUST** have official MDX documentation pages inside `apps/docs/src/content/docs/`.
- Documentation pages must include:
  - **Overview & Installation** guide (`bun add @masumdev/<name>`).
  - **Props & API Table** describing all parameters, default values, and types using `<TypeTable />`.
  - **Code Snippet Examples** with copyable Expressive Code blocks (`<Code code={...} lang="tsx" />`).
  - Proper frontmatter (`title`, `description`, and `sidebar: badge: { text: "New" | "Updated", variant: "tip" | "note" }`).
  - Sync with the catalog grid in `apps/docs/src/content/docs/rn-ui/components/index.mdx`.

### Rule 3: Package README & Changelog Update 📝
- Every new component, feature addition, or API change **MUST** be recorded in:
  - The package's `README.md` (`packages/<name>/README.md`).
  - The docs changelog (`apps/docs/src/content/docs/<package>/changelog.mdx`).
- Update feature lists, version history, and usage examples.
- When ready to release, publish using `bun run publish <package-name> [patch|minor|major]`.

---

## ⚙️ WORKSPACE INTEGRITY & CONVENTIONS

1. **No Untested Commits**: Run `bun run build` across the monorepo and verify all typechecks before declaring work complete.
2. **Title Case Navigation**: Keep all sidebar and navigation titles in **Title Case** (`RN UI`, `RN Tajweed Verse`, `RN QR Code Gen`).
3. **Starlight Search Sync**: Ensure new MDX pages maintain valid frontmatter (`title`, `description`) so Pagefind indexes them automatically.
4. **🚫 No Emojis in Code & UI Labels**: Never use emojis in component source code, docs tables, or UI text labels.
5. **👤 Sample Persona**: If demo/sample names or emails are required, always use `"Ma'sum"` and `"masum@example.com"`.
