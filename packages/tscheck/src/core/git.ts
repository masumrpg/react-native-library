import { execSync } from "node:child_process";
import * as path from "node:path";
import * as fs from "node:fs";

/**
 * Retrieves the list of files staged in Git.
 */
export function getStagedFiles(cwd: string = process.cwd()): string[] {
  try {
    const stdout = execSync("git diff --name-only --cached", {
      cwd,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "ignore"],
    });

    return stdout
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f.length > 0)
      .map((f) => path.resolve(cwd, f))
      .filter((f) => fs.existsSync(f));
  } catch {
    return [];
  }
}

/**
 * Retrieves the list of files changed since a specific git commit / branch reference.
 */
export function getChangedFilesSince(
  ref: string,
  cwd: string = process.cwd()
): string[] {
  try {
    const stdout = execSync(`git diff --name-only ${ref}`, {
      cwd,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "ignore"],
    });

    return stdout
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f.length > 0)
      .map((f) => path.resolve(cwd, f))
      .filter((f) => fs.existsSync(f));
  } catch {
    return [];
  }
}
