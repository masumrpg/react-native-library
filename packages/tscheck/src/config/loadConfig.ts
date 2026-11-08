import * as fs from "node:fs";
import * as path from "node:path";
import { pathToFileURL } from "node:url";
import type { TsCheckConfig, NormalizedTsCheckConfig } from "./types.js";
import { resolveTsCheckConfig } from "./resolveConfig.js";

import { DEFAULT_CONFIG, DEFAULT_CONFIG_FILENAMES } from "./defaults.js";
export { DEFAULT_CONFIG, DEFAULT_CONFIG_FILENAMES } from "./defaults.js";

/**
 * Searches for a TypeScript/JavaScript configuration file starting from startDir
 * and walking up to the filesystem root, and checks process.cwd().
 */
function discoverConfigFile(startDir: string): string | null {
  const dirsToCheck: string[] = [];

  let curr = path.resolve(startDir);
  while (curr) {
    dirsToCheck.push(curr);
    const parent = path.dirname(curr);
    if (parent === curr) break;
    curr = parent;
  }

  const cwd = path.resolve(process.cwd());
  if (!dirsToCheck.includes(cwd)) {
    dirsToCheck.push(cwd);
  }

  for (const dir of dirsToCheck) {
    for (const filename of DEFAULT_CONFIG_FILENAMES) {
      const candidate = path.join(dir, filename);
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return candidate;
      }
    }
  }

  return null;
}

/**
 * Resolves and loads the type-safe TypeScript/JavaScript configuration file.
 */
export async function loadConfig(
  customPath?: string,
  startDir: string = process.cwd()
): Promise<{ config: NormalizedTsCheckConfig; configPath: string | null }> {
  let resolvedPath: string | null = null;

  if (customPath) {
    resolvedPath = path.isAbsolute(customPath)
      ? customPath
      : path.resolve(process.cwd(), customPath);

    if (!fs.existsSync(resolvedPath)) {
      const altPath = path.resolve(startDir, customPath);
      if (fs.existsSync(altPath)) {
        resolvedPath = altPath;
      } else {
        throw new Error(`Configuration file not found at: ${resolvedPath}`);
      }
    }
  } else {
    resolvedPath = discoverConfigFile(startDir);
  }

  if (!resolvedPath) {
    return {
      config: resolveTsCheckConfig({ ...DEFAULT_CONFIG }),
      configPath: null,
    };
  }

  const ext = path.extname(resolvedPath).toLowerCase();
  if (ext !== ".ts" && ext !== ".js" && ext !== ".mjs" && ext !== ".cjs") {
    throw new Error(
      `Unsupported configuration file format "${resolvedPath}". tscheck exclusively uses type-safe TypeScript/JavaScript configuration (tscheck.config.ts, tscheck.config.js, tscheck.config.mjs, tscheck.config.cjs).`
    );
  }

  let userConfig: Partial<TsCheckConfig> = {};

  try {
    const fileUrl = `${pathToFileURL(resolvedPath).href}?t=${Date.now()}`;
    const mod = await import(fileUrl);
    const rawExport = mod.default ?? mod.config ?? mod;
    userConfig = (typeof rawExport === "function" ? await rawExport() : rawExport) || {};
  } catch (err) {
    // Fallback for CommonJS
    try {
      const mod = require(resolvedPath);
      const rawExport = mod.default ?? mod.config ?? mod;
      userConfig = (typeof rawExport === "function" ? await rawExport() : rawExport) || {};
    } catch {
      throw new Error(
        `Failed to parse configuration file at ${resolvedPath}: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  return {
    config: resolveTsCheckConfig(userConfig),
    configPath: resolvedPath,
  };
}
