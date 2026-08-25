import * as fs from "node:fs";
import * as path from "node:path";
import { pathToFileURL } from "node:url";
import * as YAML from "yaml";
import type { TsCheckConfig } from "./types.js";

const DEFAULT_CONFIG_FILENAMES = [
  "tscheck.config.json",
  ".tscheckrc.json",
  "tscheck.config.yaml",
  "tscheck.config.yml",
  ".tscheckrc.yaml",
  ".tscheckrc.yml",
  ".tscheckrc",
  "tscheck.config.ts",
  "tscheck.config.js",
  "tscheck.config.mjs",
  "tscheck.config.cjs",
];

const DEFAULT_CONFIG: Required<Omit<TsCheckConfig, "workspaces">> & { workspaces?: string[] } = {
  rootDir: process.cwd(),
  workspaces: undefined,
  exclude: ["node_modules", "dist", "build", ".expo", ".turbo", ".temp"],
  rules: {
    deprecated: true,
    unused: true,
    noExplicitAny: true,
  },
  reporters: {
    outputDir: ".temp/tscheck",
    json: true,
    markdown: true,
    jsonFileName: "audit-report.json",
    markdownFileName: "audit-report.md",
  },
  failOnWarning: false,
  tsconfigName: "tsconfig.json",
};

/**
 * Resolves and loads the configuration file (JSON, YAML, or JS/TS).
 */
export async function loadConfig(
  customPath?: string,
  cwd: string = process.cwd()
): Promise<{ config: TsCheckConfig; configPath: string | null }> {
  let resolvedPath: string | null = null;

  if (customPath) {
    const directPath = path.isAbsolute(customPath)
      ? customPath
      : path.resolve(cwd, customPath);
    if (fs.existsSync(directPath)) {
      resolvedPath = directPath;
    } else {
      throw new Error(`Configuration file not found at specified path: ${customPath}`);
    }
  } else {
    for (const filename of DEFAULT_CONFIG_FILENAMES) {
      const candidate = path.resolve(cwd, filename);
      if (fs.existsSync(candidate)) {
        resolvedPath = candidate;
        break;
      }
    }
  }

  let userConfig: TsCheckConfig = {};

  if (resolvedPath) {
    const ext = path.extname(resolvedPath).toLowerCase();
    const basename = path.basename(resolvedPath).toLowerCase();

    if (ext === ".json" || basename === ".tscheckrc") {
      const content = fs.readFileSync(resolvedPath, "utf-8");
      userConfig = JSON.parse(content) as TsCheckConfig;
    } else if (ext === ".yaml" || ext === ".yml") {
      const content = fs.readFileSync(resolvedPath, "utf-8");
      userConfig = YAML.parse(content) as TsCheckConfig;
    } else {
      try {
        const fileUrl = pathToFileURL(resolvedPath).href;
        const loadedModule = (await import(fileUrl)) as { default?: TsCheckConfig };
        userConfig = loadedModule.default ?? (loadedModule as TsCheckConfig);
      } catch (err) {
        throw new Error(
          `Failed to load configuration from ${resolvedPath}: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      }
    }
  }

  const mergedConfig: TsCheckConfig = {
    ...DEFAULT_CONFIG,
    ...userConfig,
    rootDir: userConfig.rootDir ? path.resolve(cwd, userConfig.rootDir) : cwd,
    rules: {
      ...DEFAULT_CONFIG.rules,
      ...(userConfig.rules ?? {}),
    },
    reporters: {
      ...DEFAULT_CONFIG.reporters,
      ...(userConfig.reporters ?? {}),
    },
    exclude: userConfig.exclude ?? DEFAULT_CONFIG.exclude,
  };

  return {
    config: mergedConfig,
    configPath: resolvedPath,
  };
}
