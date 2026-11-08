export { defineConfig } from "./config/defineConfig.js";
export { loadConfig } from "./config/loadConfig.js";
export { resolveTsCheckConfig } from "./config/resolveConfig.js";
export { DEFAULT_CONFIG, DEFAULT_EXCLUDE, DEFAULT_CONFIG_FILENAMES } from "./config/defaults.js";
export { Editor, AuditFormat } from "./config/types.js";
export { runAuditEngine, runAuditEngine as audit, formatServerTimestamp } from "./core/engine.js";
export { writeAuditReports, emitGitHubAnnotations } from "./core/reporter.js";
export { getTscheckVersion, TSCHECK_VERSION } from "./version.js";
export { CommentSuppressionMap } from "./core/suppression.js";
export { getStagedFiles, getChangedFilesSince } from "./core/git.js";
export { applyAutoFixes } from "./core/fixer.js";
export { checkCircularDependencies, checkCircularAndBoundaryRules } from "./core/rules/circular.js";
export { generateAiPrompt } from "./core/aiPrompt.js";
export { startReportServer, openInBrowser } from "./core/server.js";
export { inferSuggestedFix, resolveDeclarationOrigin } from "./core/rules/deprecated.js";

export type {
  TsCheckConfig,
  NormalizedTsCheckConfig,
  TsCheckRulesConfig,
  TsCheckReporterConfig,
  AuditReport,
  DeprecatedUsage,
  UnusedItem,
  AnyTypeUsage,
  CircularDependency,
  WorkspaceScanResult,
  SupportedEditor,
  EditorType,
  AuditFormatType,
} from "./config/types.js";
