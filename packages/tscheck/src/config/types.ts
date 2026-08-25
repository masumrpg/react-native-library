/**
 * Configuration options for specific inspection rules in tscheck.
 */
export interface TsCheckRulesConfig {
  /**
   * Check for deprecated API, function, property, and type usages.
   * @default true
   */
  deprecated?: boolean;

  /**
   * Check for unused variables, imports, parameters, and expressions.
   * @default true
   */
  unused?: boolean;

  /**
   * Check for explicit `any` type annotations and assertions.
   * @default true
   */
  noExplicitAny?: boolean;
}

/**
 * Configuration options for audit reporters and generated files.
 */
export interface TsCheckReporterConfig {
  /**
   * Output directory where audit reports will be stored.
   * @default ".temp/tscheck"
   */
  outputDir?: string;

  /**
   * Whether to generate a machine-readable JSON report file (`audit-report.json`).
   * @default true
   */
  json?: boolean;

  /**
   * Whether to generate a formatted Markdown report file (`audit-report.md`).
   * @default true
   */
  markdown?: boolean;

  /**
   * Custom file name for the JSON report (without path).
   * @default "audit-report.json"
   */
  jsonFileName?: string;

  /**
   * Custom file name for the Markdown report (without path).
   * @default "audit-report.md"
   */
  markdownFileName?: string;
}

/**
 * Root configuration interface for `@masumdev/tscheck`.
 */
export interface TsCheckConfig {
  /**
   * Base directory to run the audit against.
   * Defaults to the current working directory (`process.cwd()`).
   * @default process.cwd()
   */
  rootDir?: string;

  /**
   * Glob patterns or relative paths to discover TypeScript projects / packages.
   * If not specified, tscheck will automatically inspect `packages/*`, `apps/*`, or fallback to root `tsconfig.json`.
   * @example ["packages/*", "apps/*", "."]
   */
  workspaces?: string[];

  /**
   * Glob patterns to ignore / exclude during scan.
   * @default ["node_modules", "dist", "build", ".expo", ".turbo", ".temp"]
   */
  exclude?: string[];

  /**
   * Granular rule toggles for audit checks.
   */
  rules?: TsCheckRulesConfig;

  /**
   * Reporter and output file configuration.
   */
  reporters?: TsCheckReporterConfig;

  /**
   * Whether to exit with a non-zero exit code if warnings or deprecations are discovered.
   * @default false
   */
  failOnWarning?: boolean;

  /**
   * Custom project tsconfig file name to search for.
   * @default "tsconfig.json"
   */
  tsconfigName?: string;
}

/**
 * Discovered deprecated usage record.
 */
export interface DeprecatedUsage {
  file: string;
  line: number;
  column: number;
  symbol: string;
  reason: string;
  codeSnippet: string;
  package: string;
}

/**
 * Discovered unused identifier record.
 */
export interface UnusedItem {
  file: string;
  line: number;
  column: number;
  name: string;
  type: "unused-variable" | "unused-parameter" | "unused-import" | "other";
  message: string;
  package: string;
}

/**
 * Discovered explicit any type record.
 */
export interface AnyTypeUsage {
  file: string;
  line: number;
  column: number;
  context: string;
  codeSnippet: string;
  package: string;
}

/**
 * Scan results for an individual workspace / package.
 */
export interface WorkspaceScanResult {
  name: string;
  tsconfig: string;
  filesScanned: number;
  deprecatedCount: number;
  unusedCount: number;
  anyCount: number;
}

/**
 * Complete audit report data structure.
 */
export interface AuditReport {
  timestamp: string;
  durationMs: number;
  summary: {
    totalDeprecatedUsages: number;
    totalUnusedItems: number;
    totalAnyUsages: number;
    filesScanned: number;
    cleanFilesCount: number;
    workspacesScanned: number;
  };
  deprecatedUsages: DeprecatedUsage[];
  unusedItems: UnusedItem[];
  anyUsages: AnyTypeUsage[];
  workspaces: WorkspaceScanResult[];
  reportFiles?: {
    json?: string;
    markdown?: string;
  };
}
