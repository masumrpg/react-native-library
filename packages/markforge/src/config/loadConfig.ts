import * as fs from "node:fs";
import * as path from "node:path";
import { pathToFileURL } from "node:url";
import * as YAML from "yaml";
import type { MarkforgeConfig } from "./types.js";

const DEFAULT_CONFIG_FILENAMES = [
  "markforge.config.json",
  ".markforgerc.json",
  "markforge.config.yaml",
  "markforge.config.yml",
  ".markforgerc.yaml",
  ".markforgerc.yml",
  ".markforgerc",
  "markforge.config.ts",
  "markforge.config.js",
  "markforge.config.mjs",
  "markforge.config.cjs",
];

export const DEFAULT_CONFIG: Required<Omit<MarkforgeConfig, "outputDir" | "css" | "margins" | "header" | "footer" | "watermark" | "metadata" | "syntaxTheme">> & {
  outputDir?: string;
  css?: string | string[];
  margins?: MarkforgeConfig["margins"];
  header?: MarkforgeConfig["header"];
  footer?: MarkforgeConfig["footer"];
  watermark?: string;
  metadata?: MarkforgeConfig["metadata"];
  syntaxTheme?: string;
} = {
  to: ["docx", "pdf"],
  outputDir: undefined,
  theme: "default",
  css: undefined,
  orientation: "portrait",
  paperSize: "A4",
  margins: {
    top: "2.5cm",
    bottom: "2.5cm",
    left: "2.5cm",
    right: "2.5cm",
  },
  header: undefined,
  footer: {
    right: "Page {page} of {pages}",
  },
  toc: false,
  watermark: undefined,
  embedImages: true,
  metadata: undefined,
  watch: false,
  serve: false,
  port: 4000,
  open: false,
  bundleHtml: true,
  syntaxTheme: "github-dark",
};

/**
 * Resolves and loads markforge configuration from disk.
 */
export async function loadConfig(
  customPath?: string,
  cwd: string = process.cwd()
): Promise<{ config: MarkforgeConfig; configPath: string | null }> {
  let resolvedPath: string | null = null;

  if (customPath) {
    resolvedPath = path.isAbsolute(customPath)
      ? customPath
      : path.resolve(cwd, customPath);

    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Configuration file not found: ${resolvedPath}`);
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
  let userConfig: Partial<MarkforgeConfig> = {};

  if (ext === ".json" || resolvedPath.endsWith(".markforgerc")) {
    const raw = fs.readFileSync(resolvedPath, "utf-8");
    userConfig = JSON.parse(raw);
  } else if (ext === ".yaml" || ext === ".yml") {
    const raw = fs.readFileSync(resolvedPath, "utf-8");
    userConfig = YAML.parse(raw);
  } else if (ext === ".ts" || ext === ".js" || ext === ".mjs" || ext === ".cjs") {
    try {
      const fileUrl = pathToFileURL(resolvedPath).href;
      const mod = await import(fileUrl);
      userConfig = mod.default || mod;
    } catch {
      // Fallback require
      const required = require(resolvedPath);
      userConfig = required.default || required;
    }
  }

  const mergedConfig: MarkforgeConfig = {
    ...DEFAULT_CONFIG,
    ...userConfig,
    margins: {
      ...DEFAULT_CONFIG.margins,
      ...userConfig.margins,
    },
    header: userConfig.header || DEFAULT_CONFIG.header,
    footer: userConfig.footer || DEFAULT_CONFIG.footer,
    metadata: userConfig.metadata,
  };

  return {
    config: mergedConfig,
    configPath: resolvedPath,
  };
}
