import * as fs from "node:fs";
import * as path from "node:path";

/** Hardcoded fallback — only used if package.json cannot be found at runtime. */
const FALLBACK_VERSION = "0.2.1";

/**
 * Walks up the directory tree from `fromDir` to find the nearest
 * `package.json` belonging to `@masumdev/markforge` and returns its version.
 */
function readVersionFromPackageJson(fromDir: string): string {
  let currentDir = fromDir;
  for (let i = 0; i < 6; i++) {
    try {
      const pkgJsonPath = path.join(currentDir, "package.json");
      if (fs.existsSync(pkgJsonPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8")) as {
          name?: string;
          version?: string;
        };
        if (pkg.name === "@masumdev/markforge" && pkg.version) {
          return pkg.version;
        }
      }
    } catch {
      // keep walking up
    }
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) break;
    currentDir = parentDir;
  }
  return FALLBACK_VERSION;
}

/**
 * Dynamically resolved version — reads from the nearest package.json at runtime.
 * Falls back to the hardcoded FALLBACK_VERSION constant if not found.
 */
export const MARKFORGE_VERSION: string = readVersionFromPackageJson(
  // __dirname points to dist/ after build; walk up to find the package root
  typeof __dirname !== "undefined" ? __dirname : process.cwd()
);

/** @deprecated Use MARKFORGE_VERSION directly. */
export function getMarkforgeVersion(fromDir: string = process.cwd()): string {
  return readVersionFromPackageJson(fromDir);
}
