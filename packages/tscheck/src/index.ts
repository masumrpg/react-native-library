export { defineConfig } from "./config/defineConfig.js";
export { loadConfig } from "./config/loadConfig.js";
export { runAuditEngine, runAuditEngine as audit } from "./core/engine.js";
export { writeAuditReports } from "./core/reporter.js";

export type {
  TsCheckConfig,
  TsCheckRulesConfig,
  TsCheckReporterConfig,
  AuditReport,
  DeprecatedUsage,
  UnusedItem,
  AnyTypeUsage,
  WorkspaceScanResult,
} from "./config/types.js";
