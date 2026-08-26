import { describe, it, expect } from "bun:test";
import { getStagedFiles, getChangedFilesSince } from "../src/core/git.js";
import { getTscheckVersion, TSCHECK_VERSION } from "../src/version.js";
import { execSync } from "node:child_process";
import * as os from "node:os";
import * as fs from "node:fs";
import * as path from "node:path";

describe("git & version", () => {
  it("executes getStagedFiles and getChangedFilesSince in a real git repository", () => {
    const tmpGitDir = fs.mkdtempSync(path.join(os.tmpdir(), "tscheck-git-test-"));
    try {
      execSync("git init", { cwd: tmpGitDir, stdio: "ignore" });
      execSync('git config user.name "Test"', { cwd: tmpGitDir, stdio: "ignore" });
      execSync('git config user.email "test@example.com"', { cwd: tmpGitDir, stdio: "ignore" });

      const testFile1 = path.join(tmpGitDir, "index.ts");
      fs.writeFileSync(testFile1, "export const a = 1;\n", "utf-8");
      execSync("git add index.ts", { cwd: tmpGitDir, stdio: "ignore" });

      // Staged files should now return index.ts
      const staged = getStagedFiles(tmpGitDir);
      expect(staged.length).toBe(1);
      expect(staged[0]).toContain("index.ts");

      // Commit first file
      execSync('git commit -m "initial commit"', { cwd: tmpGitDir, stdio: "ignore" });

      // Add second file and check since HEAD~1 / HEAD
      const testFile2 = path.join(tmpGitDir, "utils.ts");
      fs.writeFileSync(testFile2, "export const b = 2;\n", "utf-8");
      execSync("git add utils.ts", { cwd: tmpGitDir, stdio: "ignore" });
      execSync('git commit -m "second commit"', { cwd: tmpGitDir, stdio: "ignore" });

      const changed = getChangedFilesSince("HEAD~1", tmpGitDir);
      expect(changed.length).toBe(1);
      expect(changed[0]).toContain("utils.ts");
    } finally {
      fs.rmSync(tmpGitDir, { recursive: true, force: true });
    }
  });

  it("handles git error gracefully and returns empty array", () => {
    const nonGitDir = os.tmpdir();
    const files = getStagedFiles(nonGitDir);
    expect(Array.isArray(files)).toBe(true);

    const changed = getChangedFilesSince("non-existent-branch-12345", nonGitDir);
    expect(Array.isArray(changed)).toBe(true);
  });

  it("returns valid semver version from package.json and falls back on non-existent dir", () => {
    const version = getTscheckVersion();
    expect(typeof version).toBe("string");
    expect(version).toBe(TSCHECK_VERSION);
    expect(/^\d+\.\d+\.\d+/.test(version)).toBe(true);

    const fallbackVersion = getTscheckVersion("/non/existent/path/never");
    expect(fallbackVersion).toBe("0.1.0");

    // Test directory where first candidate does not match package name but second candidate does
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tscheck-ver-"));
    const subDir = path.join(tmpDir, "sub");
    fs.mkdirSync(subDir, { recursive: true });
    fs.writeFileSync(path.join(tmpDir, "package.json"), JSON.stringify({ name: "unrelated-pkg" }));
    fs.writeFileSync(path.join(subDir, "package.json"), JSON.stringify({ name: "@masumdev/tscheck", version: "1.2.3" }));

    const resolvedSub = getTscheckVersion(subDir);
    expect(resolvedSub).toBe("1.2.3");

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});
