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

const DEFAULT_CONFIG: Required<Omit<TsCheckConfig, "workspaces" | "since">> & {
  workspaces?: string[];
  since?: string;
} = {
  rootDir: process.cwd(),
  workspaces: undefined,
  exclude: ["node_modules", "dist", "build", ".expo", ".turbo", ".temp"],
  staged: false,
  since: undefined,
  fix: false,
  format: "pretty",
  rules: {
    deprecated: true,
    unused: true,
    noExplicitAny: true,
    circular: true,
    packageBoundary: true,
  },
  reporters: {
    outputDir: ".temp/tscheck",
    json: true,
    markdown: true,
    html: true,
    githubAnnotations: false,
    jsonFileName: "audit-report.json",
    markdownFileName: "audit-report.md",
    htmlFileName: "audit-report.html",
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

  if (!resolvedPath) {
    return {
      config: { ...DEFAULT_CONFIG },
      configPath: null,
    };
  }

  const ext = path.extname(resolvedPath).toLowerCase();
  let userConfig: Partial<TsCheckConfig> = {};

  if (ext === ".json" || path.basename(resolvedPath) === ".tscheckrc") {
    const content = fs.readFileSync(resolvedPath, "utf-8");
    userConfig = JSON.parse(content) as Partial<TsCheckConfig>;
  } else if (ext === ".yaml" || ext === ".yml") {
    const content = fs.readFileSync(resolvedPath, "utf-8");
    userConfig = YAML.parse(content) as Partial<TsCheckConfig>;
  } else if (ext === ".ts" || ext === ".js" || ext === ".mjs" || ext === ".cjs") {
    // Dynamic import for TS/JS configuration
    const fileUrl = pathToFileURL(resolvedPath).href;
    const mod = await import(fileUrl);
    userConfig = (mod.default ?? mod) as Partial<TsCheckConfig>;
  }

  const mergedConfig: TsCheckConfig = {
    ...DEFAULT_CONFIG,
    ...userConfig,
    rules: {
      ...DEFAULT_CONFIG.rules,
      ...userConfig.rules,
    },
    reporters: {
      ...DEFAULT_CONFIG.reporters,
      ...userConfig.reporters,
    },
  };

  return {
    config: mergedConfig,
    configPath: resolvedPath,
  };
}
