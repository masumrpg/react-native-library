import { describe, it, expect } from "bun:test";
import { execSync } from "node:child_process";
import * as path from "node:path";
import * as fs from "node:fs";

describe("CLI E2E", () => {
  const distCli = path.resolve(__dirname, "../dist/cli.mjs");
  const srcCli = path.resolve(__dirname, "../src/cli.tsx");
  const cliPath = fs.existsSync(distCli) ? distCli : srcCli;
  const bunPath = process.execPath;

  it("outputs help screen on --help", () => {
    const stdout = execSync(`"${bunPath}" "${cliPath}" --help`, { encoding: "utf-8" });
    expect(stdout).toContain("tscheck [options]");
    expect(stdout).toContain("--staged");
    expect(stdout).toContain("--fix");
    expect(stdout).toContain("--format");
  });

  it("outputs version number on -V", () => {
    const stdout = execSync(`"${bunPath}" "${cliPath}" -V`, { encoding: "utf-8" });
    expect(stdout.trim()).toContain("0.2.0");
  });

  it(
    "outputs valid JSON when --json flag is passed",
    () => {
      const stdout = execSync(`"${bunPath}" "${cliPath}" --json`, {
        cwd: path.resolve(__dirname, ".."),
        encoding: "utf-8",
      });
      const parsed = JSON.parse(stdout);
      expect(parsed.version).toBe("0.2.0");
      expect(parsed.summary).toBeDefined();
      expect(parsed.summary.filesScanned).toBeGreaterThan(0);
    },
    20000
  );
});
