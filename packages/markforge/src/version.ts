import * as fs from "node:fs";
import * as path from "node:path";

export const MARKFORGE_VERSION = "0.1.0";

export function getMarkforgeVersion(fromDir: string = __dirname): string {
  try {
    let currentDir = fromDir;
    for (let i = 0; i < 5; i++) {
      const pkgJsonPath = path.join(currentDir, "package.json");
      if (fs.existsSync(pkgJsonPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
        if (pkg.name === "@masumdev/markforge" && pkg.version) {
          return pkg.version;
        }
      }
      const parentDir = path.dirname(currentDir);
      if (parentDir === currentDir) break;
      currentDir = parentDir;
    }
  } catch {
    // fallback
  }
  return MARKFORGE_VERSION;
}
