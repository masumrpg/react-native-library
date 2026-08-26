/**
 * Supported IDE/Editor schemes for deep-linking from reports.
 */
export type SupportedEditor =
  | "vscode"
  | "cursor"
  | "antigravity"
  | "windsurf"
  | "zed"
  | "webstorm"
  | "sublime"
  | "vscode-insiders"
  | "auto";

/**
 * Granular rule options for enabling / disabling specific AST audit rules.
 */
export interface TsCheckRulesConfig {
  /**
   * Check for deprecated symbols, functions, methods, and classes tagged with JSDoc `@deprecated`.
   * @default true
   */
  deprecated?: boolean;

  /**
   * Check for unused variables, parameters, and imports using TypeScript compiler diagnostics.
   * @default true
   */
  unused?: boolean;

  /**
   * Check for explicit `any` type annotations, assertions, and generic type arguments.
   * @default true
   */
  noExplicitAny?: boolean;

  /**
   * Check for circular module dependency cycles across import / export graphs.
   * @default true
   */
  circular?: boolean;
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
   * Whether to generate an interactive HTML report file (`audit-report.html`).
   * @default true
   */
  html?: boolean;

  /**
   * Whether to generate an AI-optimized, token-efficient prompt context file (`audit-report.ai.md`).
   * @default true
   */
  ai?: boolean;

  /**
   * Whether to emit GitHub Actions workflow annotations (`::warning`, `::error`) to stdout.
   * @default false
   */
  githubAnnotations?: boolean;

  /**
   * Whether to start a local HTTP server to view the HTML report.
   * @default true
   */
  serve?: boolean;

  /**
   * Whether to automatically open the report in the default web browser.
   * @default false
   */
  open?: boolean;

  /**
   * Port for the local HTML report server.
   * @default 5500
   */
  port?: number;

  /**
   * Default editor scheme to use when clicking file links in reports.
   * @default "vscode"
   */
  editor?: SupportedEditor;

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

  /**
   * Custom file name for the HTML report (without path).
   * @default "audit-report.html"
   */
  htmlFileName?: string;

  /**
   * Custom file name for the AI-optimized prompt file (without path).
   * @default "audit-report.ai.md"
   */
  aiFileName?: string;
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
   * Only scan files that are currently staged in git.
   * @default false
   */
  staged?: boolean;

  /**
   * Only scan files changed since a specific git reference (branch or commit sha).
   * @example "main" or "HEAD~1"
   */
  since?: string;

  /**
   * Automatically fix safe violations (such as prefixing unused variables/parameters with `_`).
   * @default false
   */
  fix?: boolean;

  /**
   * Output report format for CLI stdout.
   * @default "pretty"
   */
  format?: "pretty" | "json" | "github" | "ai";

  /**
   * Whether to start a local HTTP server to view the HTML report.
   * @default true
   */
  serve?: boolean;

  /**
   * Whether to automatically open the report in the default web browser.
   * @default false
   */
  open?: boolean;

  /**
   * Port for the local HTML report server.
   * @default 5500
   */
  port?: number;

  /**
   * Default editor scheme to use when clicking file links.
   * @default "vscode"
   */
  editor?: SupportedEditor;

  /**
   * Whether to output token-efficient AI prompt markdown.
   * @default false
   */
  ai?: boolean;

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
  origin?: string;
  suggestedFix?: string;
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
  suggestedFix?: string;
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
  suggestedFix?: string;
}

/**
 * Discovered circular dependency record.
 */
export interface CircularDependency {
  package: string;
  file: string;
  line: number;
  column: number;
  cycle: string[];
  codeSnippet: string;
  suggestedFix?: string;
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
  circularCount: number;
}

/**
 * Complete audit report data structure.
 */
export interface AuditReport {
  version?: string;
  timestamp: string;
  durationMs: number;
  summary: {
    totalDeprecatedUsages: number;
    totalUnusedItems: number;
    totalAnyUsages: number;
    totalCircularDependencies: number;
    suppressedCount: number;
    fixedCount: number;
    filesScanned: number;
    cleanFilesCount: number;
    workspacesScanned: number;
  };
  deprecatedUsages: DeprecatedUsage[];
  unusedItems: UnusedItem[];
  anyUsages: AnyTypeUsage[];
  circularDependencies: CircularDependency[];
  workspaces: WorkspaceScanResult[];
  reportFiles?: {
    json?: string;
    markdown?: string;
    html?: string;
    ai?: string;
  };
}
