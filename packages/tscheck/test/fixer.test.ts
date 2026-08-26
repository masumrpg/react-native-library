import { describe, it, expect } from "bun:test";
import { applyAutoFixes } from "../src/core/fixer.js";
import type { UnusedItem } from "../src/config/types.js";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

describe("fixer", () => {
  it("prefixes unused variables and parameters with underscore", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tscheck-fixer-"));
    const filePath = path.join(tmpDir, "sample.ts");

    fs.writeFileSync(
      filePath,
      `export function handler(event: any, context: any) {\n  const token = "secret";\n  return 1;\n}\n`
    );

    const unusedItems: UnusedItem[] = [
      {
        file: filePath,
        line: 1,
        column: 25,
        name: "event",
        type: "unused-parameter",
        message: "'event' is declared but never read.",
        package: "test-pkg",
      },
      {
        file: filePath,
        line: 1,
        column: 37,
        name: "context",
        type: "unused-parameter",
        message: "'context' is declared but never read.",
        package: "test-pkg",
      },
      {
        file: filePath,
        line: 2,
        column: 9,
        name: "token",
        type: "unused-variable",
        message: "'token' is declared but never read.",
        package: "test-pkg",
      },
    ];

    const result = applyAutoFixes(unusedItems);
    expect(result.fixedCount).toBe(3);
    expect(result.modifiedFiles).toContain(filePath);

    const updated = fs.readFileSync(filePath, "utf-8");
    expect(updated).toContain("_event");
    expect(updated).toContain("_context");
    expect(updated).toContain("_token");

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("skips identifiers that already start with underscore", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tscheck-fixer-"));
    const filePath = path.join(tmpDir, "already-fixed.ts");
    fs.writeFileSync(filePath, `export const _alreadyFixed = 100;\n`);

    const unusedItems: UnusedItem[] = [
      {
        file: filePath,
        line: 1,
        column: 14,
        name: "_alreadyFixed",
        type: "unused-variable",
        message: "'_alreadyFixed' is declared but never read.",
        package: "test-pkg",
      },
    ];

    const result = applyAutoFixes(unusedItems);
    expect(result.fixedCount).toBe(0);
    expect(result.modifiedFiles.length).toBe(0);

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});
