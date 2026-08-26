import { describe, it, expect } from "bun:test";
import * as ts from "typescript";
import { checkUnusedDiagnostics } from "../src/core/rules/unused.js";
import { CommentSuppressionMap } from "../src/core/suppression.js";

describe("rules/unused", () => {
  it("detects unused variables, parameters, and unused imports", () => {
    const code = `
      import { readFile, writeFile } from "node:fs";
      export function example(unusedParam: string, usedParam: number) {
        const unusedVar = 42;
        type UnusedType = number;
        return usedParam * 2;
      }
    `;

    const sourceFile = ts.createSourceFile("test.ts", code, ts.ScriptTarget.Latest, true);
    const options: ts.CompilerOptions = {
      noUnusedLocals: true,
      noUnusedParameters: true,
    };
    const host = ts.createCompilerHost(options);
    const program = ts.createProgram(["test.ts"], options, {
      ...host,
      getSourceFile: (f) => (f === "test.ts" ? sourceFile : host.getSourceFile(f, ts.ScriptTarget.Latest)),
    });

    const { items, suppressedCount } = checkUnusedDiagnostics(program, sourceFile, "test-pkg");

    expect(suppressedCount).toBe(0);
    expect(items.length).toBeGreaterThanOrEqual(3);

    const names = items.map((i) => i.name);
    expect(names).toContain("unusedParam");
    expect(names).toContain("unusedVar");
  });

  it("handles suppressed unused diagnostics", () => {
    const code = `
      export function example(
        // tscheck-ignore-next-line unused
        unusedParam: string,
        usedParam: number
      ) {
        return usedParam * 2;
      }
    `;

    const sourceFile = ts.createSourceFile("test.ts", code, ts.ScriptTarget.Latest, true);
    const options: ts.CompilerOptions = {
      noUnusedLocals: true,
      noUnusedParameters: true,
    };
    const host = ts.createCompilerHost(options);
    const program = ts.createProgram(["test.ts"], options, {
      ...host,
      getSourceFile: (f) => (f === "test.ts" ? sourceFile : host.getSourceFile(f, ts.ScriptTarget.Latest)),
    });

    const suppression = new CommentSuppressionMap(sourceFile);
    const { suppressedCount } = checkUnusedDiagnostics(program, sourceFile, "test-pkg", suppression);
    expect(suppressedCount).toBe(1);
  });

  it("ignores variables and parameters prefixed with underscore", () => {
    const code = `
      export function example(_unusedParam: string, usedParam: number) {
        const _unusedVar = 42;
        return usedParam * 2;
      }
    `;

    const sourceFile = ts.createSourceFile("test.ts", code, ts.ScriptTarget.Latest, true);
    const options: ts.CompilerOptions = {
      noUnusedLocals: true,
      noUnusedParameters: true,
    };
    const host = ts.createCompilerHost(options);
    const program = ts.createProgram(["test.ts"], options, {
      ...host,
      getSourceFile: (f) => (f === "test.ts" ? sourceFile : host.getSourceFile(f, ts.ScriptTarget.Latest)),
    });

    const { items } = checkUnusedDiagnostics(program, sourceFile, "test-pkg");
    expect(items.length).toBe(0);
  });
});
