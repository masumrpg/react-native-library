import { describe, it, expect } from "bun:test";
import { getStagedFiles, getChangedFilesSince } from "../src/core/git.js";
import { getTscheckVersion, TSCHECK_VERSION } from "../src/version.js";
import * as os from "node:os";
import * as fs from "node:fs";
import * as path from "node:path";

describe("git & version", () => {
  it("executes getStagedFiles without throwing", () => {
    const files = getStagedFiles();
    expect(Array.isArray(files)).toBe(true);
  });

  it("handles git error gracefully and returns empty array", () => {
    const nonGitDir = os.tmpdir();
    const files = getStagedFiles(nonGitDir);
    expect(Array.isArray(files)).toBe(true);

    const changed = getChangedFilesSince("non-existent-branch-12345", nonGitDir);
    expect(Array.isArray(changed)).toBe(true);
  });

  it("executes getChangedFilesSince without throwing", () => {
    const files = getChangedFilesSince("HEAD");
    expect(Array.isArray(files)).toBe(true);
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
