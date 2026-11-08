import * as path from "node:path";
import type { TsCheckConfig, NormalizedTsCheckConfig, SupportedEditor } from "./types.js";
import { DEFAULT_CONFIG } from "./defaults.js";

/**
 * Normalizes, resolves, and consolidates partial user config and CLI overrides into a canonical NormalizedTsCheckConfig.
 */
export function resolveTsCheckConfig(
  userConfig: Partial<TsCheckConfig> = {},
  cliOverrides: Partial<TsCheckConfig> = {}
): NormalizedTsCheckConfig {
  const rootDir = path.resolve(cliOverrides.rootDir || userConfig.rootDir || process.cwd());

  // Canonical editor resolution: CLI override > userConfig root > userConfig reporters > default
  const editor: SupportedEditor = (
    cliOverrides.editor ||
    cliOverrides.reporters?.editor ||
    userConfig.editor ||
    userConfig.reporters?.editor ||
    DEFAULT_CONFIG.editor ||
    "vscode"
  ) as SupportedEditor;

  // Canonical port resolution
  const port = Number(
    cliOverrides.port ||
    cliOverrides.reporters?.port ||
    userConfig.port ||
    userConfig.reporters?.port ||
    5500
  );

  // Canonical server & browser flags
  const serve = Boolean(
    cliOverrides.serve ??
    cliOverrides.reporters?.serve ??
    userConfig.serve ??
    userConfig.reporters?.serve ??
    false
  );

  const open = Boolean(
    cliOverrides.open ??
    cliOverrides.reporters?.open ??
    userConfig.open ??
    userConfig.reporters?.open ??
    false
  );

  // Canonical outputDir resolution
  const rawOutputDir =
    cliOverrides.reporters?.outputDir ||
    userConfig.reporters?.outputDir ||
    ".temp/tscheck";

  const outputDir = path.isAbsolute(rawOutputDir)
    ? rawOutputDir
    : path.resolve(rootDir, rawOutputDir);

  const format = cliOverrides.format || userConfig.format || "pretty";

  return {
    rootDir,
    workspaces: cliOverrides.workspaces || userConfig.workspaces,
    exclude: cliOverrides.exclude || userConfig.exclude || DEFAULT_CONFIG.exclude,
    staged: cliOverrides.staged ?? userConfig.staged ?? false,
    since: cliOverrides.since || userConfig.since,
    fix: cliOverrides.fix ?? userConfig.fix ?? false,
    format,
    serve,
    open,
    port,
    editor,
    failOnWarning: cliOverrides.failOnWarning ?? userConfig.failOnWarning ?? false,
    tsconfigName: cliOverrides.tsconfigName || userConfig.tsconfigName || "tsconfig.json",
    rules: {
      deprecated: cliOverrides.rules?.deprecated ?? userConfig.rules?.deprecated ?? true,
      unused: cliOverrides.rules?.unused ?? userConfig.rules?.unused ?? true,
      noExplicitAny: cliOverrides.rules?.noExplicitAny ?? userConfig.rules?.noExplicitAny ?? true,
      circular: cliOverrides.rules?.circular ?? userConfig.rules?.circular ?? true,
    },
    reporters: {
      outputDir,
      json: cliOverrides.reporters?.json ?? userConfig.reporters?.json ?? true,
      markdown: cliOverrides.reporters?.markdown ?? userConfig.reporters?.markdown ?? true,
      html: cliOverrides.reporters?.html ?? userConfig.reporters?.html ?? true,
      ai: cliOverrides.reporters?.ai ?? userConfig.reporters?.ai ?? true,
      githubAnnotations: cliOverrides.reporters?.githubAnnotations ?? userConfig.reporters?.githubAnnotations ?? false,
      editor,
      port,
      serve,
      open,
    },
  };
}
