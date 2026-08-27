import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

// Stub globalThis.localStorage to prevent Node.js 22+ webstorage warning
try {
  if (
    typeof globalThis !== "undefined" &&
    (!globalThis.localStorage || typeof globalThis.localStorage.getItem !== "function")
  ) {
    Object.defineProperty(globalThis, "localStorage", {
      value: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
        key: () => null,
        length: 0,
      },
      configurable: true,
      writable: true,
    });
  }
} catch {
  // ignore
}

/** Hardcoded fallback — only used if package.json cannot be found at runtime. */
const FALLBACK_VERSION = "0.2.2";

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

function getPackageDir(): string {
  if (typeof __dirname !== "undefined") {
    return __dirname;
  }
  try {
    return path.dirname(fileURLToPath(import.meta.url));
  } catch {
    return process.cwd();
  }
}

/**
 * Dynamically resolved version — reads from the nearest package.json at runtime.
 * Falls back to the hardcoded FALLBACK_VERSION constant if not found.
 */
export const MARKFORGE_VERSION: string = readVersionFromPackageJson(getPackageDir());

/** @deprecated Use MARKFORGE_VERSION directly. */
export function getMarkforgeVersion(fromDir: string = getPackageDir()): string {
  return readVersionFromPackageJson(fromDir);
}

