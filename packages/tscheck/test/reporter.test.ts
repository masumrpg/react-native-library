import { describe, it, expect } from "bun:test";
import { writeAuditReports, emitGitHubAnnotations } from "../src/core/reporter.js";
import type { AuditReport, TsCheckConfig } from "../src/config/types.js";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

describe("reporter", () => {
  const mockReport: AuditReport = {
    timestamp: new Date().toISOString(),
    version: "0.2.0",
    durationMs: 1200,
    summary: {
      filesScanned: 5,
      totalDeprecatedUsages: 1,
      totalUnusedItems: 1,
      totalAnyUsages: 1,
      totalCircularDependencies: 1,
      cleanFilesCount: 4,
      suppressedCount: 2,
      fixedCount: 3,
      workspacesScanned: 1,
    },
    workspaces: [
      {
        name: "@test/pkg",
        tsconfig: "/root/tsconfig.json",
        filesScanned: 5,
        deprecatedCount: 1,
        unusedCount: 1,
        anyCount: 1,
        circularCount: 1,
      },
    ],
    deprecatedUsages: [
      {
        file: "/root/src/deprecated.ts",
        line: 10,
        column: 5,
        symbol: "legacyFn",
        reason: "Use modernFn instead",
        codeSnippet: "legacyFn()",
        package: "@test/pkg",
      },
    ],
    unusedItems: [
      {
        file: "/root/src/unused.ts",
        line: 15,
        column: 3,
        name: "unusedVar",
        type: "unused-variable",
        message: "declared but never used",
        package: "@test/pkg",
      },
    ],
    anyUsages: [
      {
        file: "/root/src/any.ts",
        line: 20,
        column: 7,
        context: "variable 'x'",
        codeSnippet: "const x: any = 1;",
        package: "@test/pkg",
      },
    ],
    circularDependencies: [
      {
        package: "@test/pkg",
        cycle: ["/a.ts", "/b.ts", "/a.ts"],
        file: "/a.ts",
        line: 1,
        column: 1,
        codeSnippet: "import './b'",
      },
    ],
  };

  it("writes JSON, Markdown, and HTML reports to disk and handles githubAnnotations", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tscheck-rep-"));
    const config: TsCheckConfig = {
      rootDir: tmpDir,
      reporters: {
        outputDir: ".temp/reports",
        json: true,
        markdown: true,
        html: true,
        githubAnnotations: true,
      },
    };

    const lines: string[] = [];
    const originalLog = console.log;
    console.log = (msg: string) => lines.push(msg);

    try {
      const result = writeAuditReports(mockReport, config);

      expect(result.json).toBeDefined();
      expect(result.markdown).toBeDefined();
      expect(result.html).toBeDefined();

      expect(fs.existsSync(path.join(tmpDir, result.json!))).toBe(true);
      expect(fs.existsSync(path.join(tmpDir, result.markdown!))).toBe(true);
      expect(fs.existsSync(path.join(tmpDir, result.html!))).toBe(true);
      expect(lines.length).toBeGreaterThanOrEqual(4);
    } finally {
      console.log = originalLog;
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it("writes reports to an absolute output directory", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tscheck-rep-abs-"));
    const absOut = path.join(tmpDir, "absolute-reports");

    const config: TsCheckConfig = {
      rootDir: tmpDir,
      reporters: {
        outputDir: absOut,
        json: true,
        markdown: true,
        html: true,
      },
    };

    const result = writeAuditReports(mockReport, config);
    expect(result.json).toBeDefined();
    expect(fs.existsSync(path.join(tmpDir, result.json!))).toBe(true);

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("emits GitHub workflow commands correctly with failOnWarning", () => {
    const lines: string[] = [];
    const originalLog = console.log;
    console.log = (msg: string) => lines.push(msg);

    try {
      emitGitHubAnnotations(mockReport, true);
    } finally {
      console.log = originalLog;
    }

    expect(lines.length).toBeGreaterThanOrEqual(4);
    expect(lines.some((l) => l.includes("title=Deprecated API"))).toBe(true);
    expect(lines.some((l) => l.includes("title=Unused Diagnostic"))).toBe(true);
    expect(lines.some((l) => l.includes("title=Explicit Any Type"))).toBe(true);
    expect(lines.some((l) => l.includes("title=Circular Dependency"))).toBe(true);
  });
});
