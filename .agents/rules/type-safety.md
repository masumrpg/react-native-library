# Type Safety & Code Quality Rules

This document outlines the mandatory type safety and code quality standards for all workspaces in the monorepo.

---

## 1. Strict Type Safety: Zero `any` Types Policy

Using `any` type casting, parameters, or return types is **strictly forbidden** across the entire codebase.

- ❌ Never use `as any` or `(: any)` for props, state, event handlers, refs, or `React.cloneElement`.
- ✅ Always use precise React Native types:
  - Events: `GestureResponderEvent`, `NativeSyntheticEvent<T>`, `LayoutChangeEvent`
  - Elements: `React.ReactElement<Record<string, unknown>>`
  - Styles: `StyleProp<ViewStyle>`, `StyleProp<TextStyle>`
  - Generic parameters: `WheelPickerItem<unknown>` instead of `WheelPickerItem<any>`
  - Ref forwardings: `ref as never` for third-party type incompatibilities

---

## 2. Codebase Audit CLI (`bun run audit`)

All changes must pass the automated audit tool:

```bash
bun run audit
```

- **Command**: `bun scripts/audit-codebase.ts`
- **Output Report**: `.temp/tscheck/audit-report.json` and `.temp/tscheck/audit-report.md`
- **Pass Criteria**:
  - `Total Deprecated Usages`: **0**
  - `Total Unused Items`: **0**
  - `Total Explicit any Usages`: **0**

---

## 3. Strict Monorepo Typecheck

Before declaring any task complete, verify typechecking across all packages and apps:
- `bun run build --filter=@masumdev/rn-ui`
- `bun --cwd apps/native tsc --noEmit`
- `bun --cwd apps/docs build`
