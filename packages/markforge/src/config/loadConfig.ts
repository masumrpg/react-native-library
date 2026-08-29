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

export const DEFAULT_CONFIG: Required<Omit<MarkforgeConfig, "outputDir" | "css" | "margins" | "header" | "footer" | "watermark" | "metadata" | "syntaxTheme" | "signatures">> & {
  outputDir?: string;
  css?: string | string[];
  margins?: MarkforgeConfig["margins"];
  header?: MarkforgeConfig["header"];
  footer?: MarkforgeConfig["footer"];
  signatures?: MarkforgeConfig["signatures"];
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
 * Searches for a configuration file starting from `startDir` and walking up to filesystem root,
 * and also checks `process.cwd()`.
 */
function discoverConfigFile(startDir: string): string | null {
  const dirsToCheck: string[] = [];

  // 1. Walk up from startDir to root
  let curr = path.resolve(startDir);
  while (curr) {
    dirsToCheck.push(curr);
    const parent = path.dirname(curr);
    if (parent === curr) break;
    curr = parent;
  }

  // 2. Also ensure process.cwd() is checked
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
 * Resolves and loads markforge configuration from disk.
 */
export async function loadConfig(
  customPath?: string,
  startDir: string = process.cwd()
): Promise<{ config: MarkforgeConfig; configPath: string | null }> {
  let resolvedPath: string | null = null;

  if (customPath) {
    resolvedPath = path.isAbsolute(customPath)
      ? customPath
      : path.resolve(process.cwd(), customPath);

    if (!fs.existsSync(resolvedPath)) {
      // Also try resolving relative to startDir
      const altPath = path.resolve(startDir, customPath);
      if (fs.existsSync(altPath)) {
        resolvedPath = altPath;
      } else {
        throw new Error(`Configuration file not found: ${resolvedPath}`);
      }
    }
  } else {
    resolvedPath = discoverConfigFile(startDir);
  }

  if (!resolvedPath) {
    return {
      config: { ...DEFAULT_CONFIG },
      configPath: null,
    };
  }

  const ext = path.extname(resolvedPath).toLowerCase();
  let userConfig: Record<string, unknown> = {};

  try {
    if (ext === ".json" || ext === "" || resolvedPath.endsWith(".markforgerc")) {
      const raw = fs.readFileSync(resolvedPath, "utf-8").trim();
      try {
        userConfig = JSON.parse(raw);
      } catch {
        // Fallback: parse as YAML in case .markforgerc contains YAML
        userConfig = (YAML.parse(raw) || {}) as Record<string, unknown>;
      }
    } else if (ext === ".yaml" || ext === ".yml") {
      const raw = fs.readFileSync(resolvedPath, "utf-8");
      userConfig = (YAML.parse(raw) || {}) as Record<string, unknown>;
    } else if (ext === ".ts" || ext === ".js" || ext === ".mjs" || ext === ".cjs") {
      try {
        const fileUrl = `${pathToFileURL(resolvedPath).href}?t=${Date.now()}`;
        const mod = await import(fileUrl);
        const rawExport = mod.default ?? mod.config ?? mod;
        userConfig = (typeof rawExport === "function" ? await rawExport() : rawExport) || {};
      } catch (importErr) {
        // Fallback for CommonJS
        try {
          const mod = require(resolvedPath);
          const rawExport = mod.default ?? mod.config ?? mod;
          userConfig = (typeof rawExport === "function" ? await rawExport() : rawExport) || {};
        } catch {
          throw importErr;
        }
      }
    }
  } catch (err) {
    throw new Error(
      `Failed to parse configuration file at ${resolvedPath}: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  // Remove $schema if present in JSON config so it doesn't pollute the typed config
  if (userConfig && typeof userConfig === "object" && "$schema" in userConfig) {
    delete userConfig.$schema;
  }

  const parsedConfig = userConfig as Partial<MarkforgeConfig>;

  const mergedConfig: MarkforgeConfig = {
    ...DEFAULT_CONFIG,
    ...parsedConfig,
    margins: {
      ...DEFAULT_CONFIG.margins,
      ...(parsedConfig.margins || {}),
    },
    header: parsedConfig.header !== undefined ? parsedConfig.header : DEFAULT_CONFIG.header,
    footer: parsedConfig.footer !== undefined ? parsedConfig.footer : DEFAULT_CONFIG.footer,
    metadata: {
      ...(DEFAULT_CONFIG.metadata || {}),
      ...(parsedConfig.metadata || {}),
    },
  };

  return {
    config: mergedConfig,
    configPath: resolvedPath,
  };
}
