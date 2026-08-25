---
name: component-workflow
description: Step-by-step workflow for creating, registering, or updating components across @masumdev/rn-ui, apps/native playground, and apps/docs portal.
---

# Component Creation & Update Workflow

Whenever a component is added or modified in `@masumdev/rn-ui`, you must follow this 3-step pipeline:

## Step 1: Package Implementation (`packages/rn-ui`)
1. Implement the component in `packages/rn-ui/src/components/<ComponentName>.tsx`.
2. Inherit appropriate base types from `src/components/types.ts`:
   - `ToneProps`, `VariantProps`, `SizeProps`, `ShapeProps`, `IconSlotsProps`
   - `BaseGlassProps`, `BaseHapticProps`, `BaseAnimatedProps`
   - Underlying React Native props (`PressableProps`, `ViewProps`, `TextInputProps`)
3. Use `react-native-reanimated` (`withTiming` 100-160ms) and `react-native-gesture-handler` for gestures (Zero-Bounce Policy).
4. Export the component and its types from `packages/rn-ui/src/components/index.ts`.

## Step 2: Native Showcase Demo (`apps/native`)
1. Create a section component in `apps/native/components/rn-ui/sections/<ComponentName>Section.tsx`.
2. Register the section in:
   - `apps/native/components/rn-ui/sections/index.ts`
   - `apps/native/components/rn-ui/index.ts`
   - `apps/native/app/rn-ui/[id].tsx`
3. Provide interactive controls, light/dark mode preview, and sample persona ("Ma'sum").

## Step 3: Documentation & Changelog (`apps/docs`)
1. Create/update the MDX page in `apps/docs/src/content/docs/rn-ui/components/<component-name>.mdx`.
2. Include sidebar badge in frontmatter:
   ```yaml
   sidebar:
     badge:
       text: "New" # or "Updated"
       variant: "tip" # or "note"
   ```
3. Update the component catalog grid in `apps/docs/src/content/docs/rn-ui/components/index.mdx`.
4. Update `apps/docs/src/content/docs/rn-ui/changelog.mdx` and `packages/rn-ui/README.md`.
