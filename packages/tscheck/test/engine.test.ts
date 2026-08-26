import { describe, it, expect } from "bun:test";
import { discoverProjects, runAuditEngine } from "../src/core/engine.js";
import type { TsCheckConfig } from "../src/config/types.js";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

describe("engine", () => {
  it("discovers workspaces using glob patterns", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tscheck-eng-"));
    const pkgADir = path.join(tmpDir, "packages", "pkg-a");
    const pkgBDir = path.join(tmpDir, "packages", "pkg-b");

    fs.mkdirSync(pkgADir, { recursive: true });
    fs.mkdirSync(pkgBDir, { recursive: true });

    fs.writeFileSync(path.join(pkgADir, "package.json"), JSON.stringify({ name: "@test/pkg-a" }));
    fs.writeFileSync(path.join(pkgADir, "tsconfig.json"), JSON.stringify({}));
    fs.writeFileSync(path.join(pkgBDir, "package.json"), JSON.stringify({ name: "@test/pkg-b" }));
    fs.writeFileSync(path.join(pkgBDir, "tsconfig.json"), JSON.stringify({}));

    const config: TsCheckConfig = {
      rootDir: tmpDir,
      workspaces: ["packages/*"],
    };

    const projects = discoverProjects(config);
    expect(projects.length).toBe(2);

    const names = projects.map((p) => p.name);
    expect(names).toContain("@test/pkg-a");
    expect(names).toContain("@test/pkg-b");

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("discovers single project fallback when no workspaces are specified", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tscheck-eng-single-"));
    fs.writeFileSync(path.join(tmpDir, "tsconfig.json"), JSON.stringify({}));

    const projects = discoverProjects({ rootDir: tmpDir });
    expect(projects.length).toBe(1);

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("creates virtual project fallback when no tsconfig.json exists", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tscheck-eng-no-tsconfig-"));
    fs.writeFileSync(path.join(tmpDir, "package.json"), JSON.stringify({ name: "virtual-pkg" }));
    fs.writeFileSync(path.join(tmpDir, "index.ts"), "export const a = 1;");

    const projects = discoverProjects({ rootDir: tmpDir });
    expect(projects.length).toBe(1);
    expect(projects[0].name).toBe("virtual-pkg");
    expect(projects[0].tsconfig).toBe("");

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("audits a project with clean files and triggers progress callbacks", async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tscheck-eng-run-"));
    fs.writeFileSync(path.join(tmpDir, "tsconfig.json"), JSON.stringify({ compilerOptions: { strict: true } }));
    fs.writeFileSync(path.join(tmpDir, "index.ts"), "export const value: number = 42;\n");

    const events: string[] = [];
    const report = await runAuditEngine(
      {
        rootDir: tmpDir,
        workspaces: ["."],
      },
      (event) => {
        events.push(event.type);
      }
    );

    expect(events).toContain("start");
    expect(events).toContain("workspace-start");
    expect(events).toContain("file-progress");
    expect(events).toContain("workspace-done");
    expect(events).toContain("complete");

    expect(report.summary.filesScanned).toBe(1);
    expect(report.summary.cleanFilesCount).toBe(1);
    expect(report.summary.totalDeprecatedUsages).toBe(0);

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("audits a project with violations and executes auto-fixing", async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tscheck-eng-violation-"));
    fs.writeFileSync(
      path.join(tmpDir, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: {
          noUnusedLocals: true,
          noUnusedParameters: true,
        },
      })
    );
    fs.writeFileSync(
      path.join(tmpDir, "sample.ts"),
      `/** @deprecated Use modernFn */\nexport function oldFn() {}\n\nexport function testFn(unusedParam: string) {\n  const x: any = 10;\n  oldFn();\n  return x;\n}\n`
    );

    const report = await runAuditEngine({
      rootDir: tmpDir,
      fix: true,
    });

    expect(report.summary.totalDeprecatedUsages).toBeGreaterThanOrEqual(1);
    expect(report.summary.totalUnusedItems).toBeGreaterThanOrEqual(1);
    expect(report.summary.totalAnyUsages).toBeGreaterThanOrEqual(1);
    expect(report.summary.fixedCount).toBeGreaterThanOrEqual(1);

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("audits a project without tsconfig using recursive in-memory compiler fallback", async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tscheck-eng-inmemory-"));
    const subDir = path.join(tmpDir, "src", "nested");
    fs.mkdirSync(subDir, { recursive: true });
    fs.writeFileSync(path.join(subDir, "index.ts"), "export const pi = 3.14;\n");

    const report = await runAuditEngine({
      rootDir: tmpDir,
    });

    expect(report.summary.filesScanned).toBe(1);
    expect(report.summary.cleanFilesCount).toBe(1);

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("handles git staged and since filters without error", async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tscheck-eng-git-"));
    fs.writeFileSync(path.join(tmpDir, "tsconfig.json"), JSON.stringify({}));
    fs.writeFileSync(path.join(tmpDir, "file.ts"), "export const b = 2;\n");

    const reportStaged = await runAuditEngine({
      rootDir: tmpDir,
      staged: true,
    });
    expect(reportStaged.summary.filesScanned).toBe(0);

    const reportSince = await runAuditEngine({
      rootDir: tmpDir,
      since: "HEAD",
    });
    expect(typeof reportSince.summary.filesScanned).toBe("number");

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("skips invalid tsconfig file or empty directories gracefully", async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tscheck-eng-invalid-"));
    const invalidPkgDir = path.join(tmpDir, "pkg-invalid");
    fs.mkdirSync(invalidPkgDir, { recursive: true });
    fs.writeFileSync(path.join(invalidPkgDir, "tsconfig.json"), "{ invalid json }");

    const emptyPkgDir = path.join(tmpDir, "pkg-empty");
    fs.mkdirSync(emptyPkgDir, { recursive: true });
    fs.writeFileSync(path.join(emptyPkgDir, "readme.txt"), "no code here");

    const report = await runAuditEngine({
      rootDir: tmpDir,
      workspaces: ["pkg-invalid", "pkg-empty"],
    });

    expect(report.summary.filesScanned).toBe(0);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});
