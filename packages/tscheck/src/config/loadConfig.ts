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
  serve: true,
  open: true,
  port: 5500,
  editor: "vscode",
  ai: true,
  rules: {
    deprecated: true,
    unused: true,
    noExplicitAny: true,
    circular: true,
  },
  reporters: {
    outputDir: ".temp/tscheck",
    json: true,
    markdown: true,
    html: true,
    ai: true,
    serve: true,
    open: false,
    port: 5500,
    editor: "vscode",
    githubAnnotations: false,
    jsonFileName: "audit-report.json",
    markdownFileName: "audit-report.md",
    htmlFileName: "audit-report.html",
    aiFileName: "audit-report.ai.md",
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
    resolvedPath = path.isAbsolute(customPath)
      ? customPath
      : path.resolve(cwd, customPath);

    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Configuration file not found at: ${resolvedPath}`);
    }
  } else {
    for (const filename of DEFAULT_CONFIG_FILENAMES) {
      const candidate = path.join(cwd, filename);
      if (fs.existsSync(candidate)) {
        resolvedPath = candidate;
        break;
      }
    }
  }

  if (!resolvedPath) {
    return { config: { ...DEFAULT_CONFIG }, configPath: null };
  }

  const ext = path.extname(resolvedPath).toLowerCase();
  let userConfig: Partial<TsCheckConfig> = {};

  if (ext === ".json" || resolvedPath.endsWith("rc")) {
    const raw = fs.readFileSync(resolvedPath, "utf-8");
    userConfig = JSON.parse(raw);
  } else if (ext === ".yaml" || ext === ".yml") {
    const raw = fs.readFileSync(resolvedPath, "utf-8");
    userConfig = YAML.parse(raw);
  } else if (ext === ".ts" || ext === ".js" || ext === ".mjs" || ext === ".cjs") {
    const fileUrl = pathToFileURL(resolvedPath).href;
    const mod = await import(fileUrl);
    userConfig = mod.default || mod;
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

  return { config: mergedConfig, configPath: resolvedPath };
}
