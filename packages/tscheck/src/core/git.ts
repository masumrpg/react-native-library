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

    const results: string[] = [];
    for (const raw of stdout.split("\n")) {
      const line = raw.trim();
      if (!line) continue;
      const fullPath = path.resolve(cwd, line);
      if (fs.existsSync(fullPath)) {
        results.push(fullPath);
      }
    }
    return results;
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

    const results: string[] = [];
    for (const raw of stdout.split("\n")) {
      const line = raw.trim();
      if (!line) continue;
      const fullPath = path.resolve(cwd, line);
      if (fs.existsSync(fullPath)) {
        results.push(fullPath);
      }
    }
    return results;
  } catch {
    return [];
  }
}
