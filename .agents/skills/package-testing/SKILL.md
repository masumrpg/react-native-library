---
name: package-testing
description: Standard operating procedure for authoring and running comprehensive 100% unit tests, AST rule tests, Ink UI tests, and CLI E2E tests for @masumdev/tscheck and other monorepo packages. Use ONLY when explicitly instructed by the user to run or author tests.
---

# Package Testing Workflow (On-Demand Runbook)

Use this skill whenever the user explicitly asks to run, author, or verify unit and E2E test suites for `@masumdev/tscheck` or workspace packages.

---

## 1. Running Test Suites

### Run All Unit & E2E Tests for `packages/tscheck`
```bash
bun test --cwd packages/tscheck
```

### Run with Test Coverage Inspection
```bash
bun test --coverage --cwd packages/tscheck
```

### Run Specific Test Suites
```bash
# AST Rules
bun test packages/tscheck/test/rules-deprecated.test.ts
bun test packages/tscheck/test/rules-unused.test.ts
bun test packages/tscheck/test/rules-any.test.ts
bun test packages/tscheck/test/rules-circular.test.ts

# Engine, Config, Reporters & Suppression
bun test packages/tscheck/test/config.test.ts
bun test packages/tscheck/test/suppression.test.ts
bun test packages/tscheck/test/fixer.test.ts
bun test packages/tscheck/test/reporter.test.ts
bun test packages/tscheck/test/engine.test.ts

# Ink Terminal UI & CLI E2E
bun test packages/tscheck/test/ui.test.tsx
bun test packages/tscheck/test/cli-e2e.test.ts
```

---

## 2. Test Authoring Patterns

### A. AST In-Memory Mock Programs
Use `ts.createSourceFile` and a custom compiler host to test AST rules in isolation without polluting disk:
```typescript
import * as ts from "typescript";

const code = `const x: any = 10;`;
const sourceFile = ts.createSourceFile("test.ts", code, ts.ScriptTarget.Latest, true);
const host = ts.createCompilerHost({});
const program = ts.createProgram(["test.ts"], {}, {
  ...host,
  getSourceFile: (f) => (f === "test.ts" ? sourceFile : host.getSourceFile(f, ts.ScriptTarget.Latest)),
});
```

### B. Disk Isolation for File Scanners & Fixers
Use temporary directories (`fs.mkdtempSync`) for disk modifications and clean up in `finally` / teardown:
```typescript
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tscheck-test-"));
try {
  // Test code here...
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}
```

### C. Ink UI Testing (`ink-testing-library`)
Render Ink components in a virtual terminal frame:
```typescript
import { render } from "ink-testing-library";
import { Header } from "../src/ui/Header.js";

const { lastFrame } = render(<Header version="0.2.0" rootDir="/root" />);
expect(lastFrame()).toContain("TSCHECK AUDIT ENGINE");
```

### D. CLI E2E Tests
Execute compiled CLI bundles using `node:child_process`:
```typescript
import { execSync } from "node:child_process";
import * as path from "node:path";

const cliPath = path.resolve(__dirname, "../dist/cli.mjs");
const stdout = execSync(`"${process.execPath}" "${cliPath}" --json`, { encoding: "utf-8" });
const result = JSON.parse(stdout);
expect(result.summary.filesScanned).toBeGreaterThan(0);
```

---

## 3. Mandatory Quality Standards

1. **Zero Failing Tests**: All tests across all suites must pass with exit code `0`.
2. **Deterministic Assertions**: Tests must not rely on random timings or unhandled background promises.
3. **No Leftover Temp Files**: All temporary files created during testing must be removed.
4. **Coverage Target**: Aim for $\ge 90\%$ line coverage across core modules.
