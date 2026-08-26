export { defineConfig } from "./config/defineConfig.js";
export { loadConfig } from "./config/loadConfig.js";
export { runAuditEngine, runAuditEngine as audit } from "./core/engine.js";
export { writeAuditReports, emitGitHubAnnotations } from "./core/reporter.js";
export { getTscheckVersion, TSCHECK_VERSION } from "./version.js";
export { CommentSuppressionMap } from "./core/suppression.js";
export { getStagedFiles, getChangedFilesSince } from "./core/git.js";
export { applyAutoFixes } from "./core/fixer.js";
export { checkCircularAndBoundaryRules } from "./core/rules/circular.js";

export type {
  TsCheckConfig,
  TsCheckRulesConfig,
  TsCheckReporterConfig,
  AuditReport,
  DeprecatedUsage,
  UnusedItem,
  AnyTypeUsage,
  CircularDependency,
  BoundaryViolation,
  WorkspaceScanResult,
} from "./config/types.js";
