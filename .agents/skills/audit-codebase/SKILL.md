---
name: audit-codebase
description: Standard operating procedure for auditing the monorepo for deprecated API usages, unused variables, and explicit any types.
---

# Codebase Audit Workflow

## 1. Execute Audit
Run the automated AST audit script across all 5 workspace tsconfigs:

```bash
bun run audit
```

## 2. Inspect Results
The script produces reports in `.temp/tscheck/`:
- `.temp/tscheck/audit-report.json`
- `.temp/tscheck/audit-report.md`

## 3. Mandatory Standards
- **Deprecated API Usages**: Must be 0.
- **Unused Variables / Imports**: Must be 0.
- **Explicit `any` Types**: Must be 0.

## 4. Remediation Guide
- **`any` in React.cloneElement**: Cast element to `React.ReactElement<Record<string, unknown>>` or generic type guard.
- **`any` in event handlers**: Use `GestureResponderEvent`, `LayoutChangeEvent`, or `NativeSyntheticEvent<T>`.
- **`any` in third-party refs**: Forward ref using `ref as never`.
