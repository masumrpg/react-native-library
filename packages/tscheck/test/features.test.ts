import { describe, it, expect } from "bun:test";
import * as ts from "typescript";
import { CommentSuppressionMap } from "../src/core/suppression.js";
import { applyAutoFixes } from "../src/core/fixer.js";
import { emitGitHubAnnotations } from "../src/core/reporter.js";
import type { AuditReport, UnusedItem } from "../src/config/types.js";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

describe("CommentSuppressionMap", () => {
  it("suppresses next line violations via // tscheck-ignore-next-line", () => {
    const code = `
// tscheck-ignore-next-line any
const a: any = 1;
const b: any = 2;
`;
    const sf = ts.createSourceFile("test.ts", code, ts.ScriptTarget.Latest, true);
    const map = new CommentSuppressionMap(sf);

    expect(map.isSuppressed(3, "noExplicitAny")).toBe(true);
    expect(map.isSuppressed(4, "noExplicitAny")).toBe(false);
  });

  it("suppresses multiple rules on next line", () => {
    const code = `
// tscheck-ignore-next-line any, deprecated
const a: any = legacyFn();
`;
    const sf = ts.createSourceFile("test.ts", code, ts.ScriptTarget.Latest, true);
    const map = new CommentSuppressionMap(sf);

    expect(map.isSuppressed(3, "noExplicitAny")).toBe(true);
    expect(map.isSuppressed(3, "deprecated")).toBe(true);
    expect(map.isSuppressed(3, "unused")).toBe(false);
  });

  it("suppresses range with /* tscheck-disable */ and /* tscheck-enable */", () => {
    const code = `
/* tscheck-disable */
const a: any = 1;
const b: any = 2;
/* tscheck-enable */
const c: any = 3;
`;
    const sf = ts.createSourceFile("test.ts", code, ts.ScriptTarget.Latest, true);
    const map = new CommentSuppressionMap(sf);

    expect(map.isSuppressed(3, "noExplicitAny")).toBe(true);
    expect(map.isSuppressed(4, "noExplicitAny")).toBe(true);
    expect(map.isSuppressed(6, "noExplicitAny")).toBe(false);
  });
});

describe("AutoFixer", () => {
  it("safely prefixes unused variables with underscore", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tscheck-fix-"));
    const tmpFile = path.join(tmpDir, "fix-test.ts");
    fs.writeFileSync(tmpFile, "export function calc(param: number) {\n  const unusedVal = 100;\n  return param * 2;\n}\n");

    const unusedItems: UnusedItem[] = [
      {
        file: tmpFile,
        line: 2,
        column: 9,
        name: "unusedVal",
        type: "unused-variable",
        message: "'unusedVal' is declared but its value is never read.",
        package: "test-pkg",
      },
    ];

    const result = applyAutoFixes(unusedItems);
    expect(result.fixedCount).toBe(1);
    expect(result.modifiedFiles).toContain(tmpFile);

    const updated = fs.readFileSync(tmpFile, "utf-8");
    expect(updated).toContain("const _unusedVal = 100;");

    // Cleanup
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});

describe("GitHubAnnotations", () => {
  it("emits formatted workflow commands to stdout", () => {
    const logs: string[] = [];
    const origLog = console.log;
    console.log = (msg: string) => logs.push(msg);

    try {
      const mockReport: AuditReport = {
        timestamp: new Date().toISOString(),
        durationMs: 100,
        summary: {
          totalDeprecatedUsages: 1,
          totalUnusedItems: 1,
          totalAnyUsages: 1,
          totalCircularDependencies: 0,
          totalBoundaryViolations: 0,
          suppressedCount: 0,
          fixedCount: 0,
          filesScanned: 3,
          cleanFilesCount: 0,
          workspacesScanned: 1,
        },
        deprecatedUsages: [
          {
            file: path.resolve("src/index.ts"),
            line: 10,
            column: 5,
            symbol: "oldFunc",
            reason: "Use newFunc instead",
            codeSnippet: "oldFunc()",
            package: "mock-pkg",
          },
        ],
        unusedItems: [
          {
            file: path.resolve("src/index.ts"),
            line: 15,
            column: 3,
            name: "unusedVar",
            type: "unused-variable",
            message: "'unusedVar' is declared but its value is never read.",
            package: "mock-pkg",
          },
        ],
        anyUsages: [
          {
            file: path.resolve("src/index.ts"),
            line: 20,
            column: 12,
            context: "variable 'x'",
            codeSnippet: "const x: any = 1;",
            package: "mock-pkg",
          },
        ],
        circularDependencies: [],
        boundaryViolations: [],
        workspaces: [],
      };

      emitGitHubAnnotations(mockReport, false);

      expect(logs.some((l) => l.startsWith("::warning") && l.includes("title=Deprecated API"))).toBe(true);
      expect(logs.some((l) => l.startsWith("::warning") && l.includes("title=Unused Diagnostic"))).toBe(true);
      expect(logs.some((l) => l.startsWith("::warning") && l.includes("title=Explicit Any Type"))).toBe(true);
    } finally {
      console.log = origLog;
    }
  });
});
