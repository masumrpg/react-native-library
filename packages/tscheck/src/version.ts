import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Dynamically resolves the version of @masumdev/tscheck from its package.json.
 */
export function getTscheckVersion(fromDir?: string): string {
  try {
    const currentDir =
      fromDir ??
      (typeof __dirname !== "undefined"
        ? __dirname
        : path.dirname(fileURLToPath(import.meta.url)));

    const candidatePaths = [
      path.resolve(currentDir, "../package.json"),
      path.resolve(currentDir, "package.json"),
    ];

    for (const candidate of candidatePaths) {
      if (fs.existsSync(candidate)) {
        const pkgData = JSON.parse(fs.readFileSync(candidate, "utf-8")) as {
          name?: string;
          version?: string;
        };
        if (pkgData.name === "@masumdev/tscheck" && pkgData.version) {
          return pkgData.version;
        }
      }
    }
  } catch {
    // fallback if unresolvable
  }

  return "0.1.0";
}

export const TSCHECK_VERSION = getTscheckVersion();
