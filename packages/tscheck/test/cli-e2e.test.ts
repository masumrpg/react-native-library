import { describe, it, expect } from "bun:test";
import { execSync } from "node:child_process";
import * as path from "node:path";
import * as fs from "node:fs";
import { getTscheckVersion } from "../src/version.js";

describe("CLI E2E", () => {
  const distCli = path.resolve(__dirname, "../dist/cli.mjs");
  const srcCli = path.resolve(__dirname, "../src/cli.tsx");
  const cliPath = fs.existsSync(distCli) ? distCli : srcCli;
  const bunPath = process.execPath;
  const expectedVersion = getTscheckVersion();

  it("outputs help screen on --help", () => {
    const stdout = execSync(`"${bunPath}" "${cliPath}" --help`, { encoding: "utf-8" });
    expect(stdout).toContain("tscheck [options]");
    expect(stdout).toContain("--staged");
    expect(stdout).toContain("--fix");
    expect(stdout).toContain("--format");
    expect(stdout).toContain("--serve");
    expect(stdout).toContain("--ai");
  });

  it("outputs version number on -V", () => {
    const stdout = execSync(`"${bunPath}" "${cliPath}" -V`, { encoding: "utf-8" });
    expect(stdout.trim()).toBe(expectedVersion);
  });

  it(
    "outputs valid JSON when --json flag is passed",
    () => {
      const stdout = execSync(`"${bunPath}" "${cliPath}" --json`, {
        cwd: path.resolve(__dirname, ".."),
        encoding: "utf-8",
      });
      const parsed = JSON.parse(stdout);
      expect(parsed.version).toBe(expectedVersion);
      expect(parsed.summary).toBeDefined();
      expect(parsed.summary.filesScanned).toBeGreaterThan(0);
    },
    20000
  );

  it(
    "outputs AI markdown prompt when --ai flag is passed",
    () => {
      const stdout = execSync(`"${bunPath}" "${cliPath}" --ai`, {
        cwd: path.resolve(__dirname, ".."),
        encoding: "utf-8",
      });
      expect(stdout).toContain("TSCheck AI Code Remediation Instructions");
      expect(stdout).toContain("Audit Summary");
    },
    20000
  );
});
