import { render } from "ink";
import { Command } from "commander";
import { loadConfig } from "./config/loadConfig.js";
import type { TsCheckConfig, AuditReport } from "./config/types.js";
import { App } from "./ui/App.js";
import { runAuditEngine } from "./core/engine.js";
import { writeAuditReports, emitGitHubAnnotations } from "./core/reporter.js";
import { getTscheckVersion } from "./version.js";

const VERSION = getTscheckVersion();

const program = new Command();

program
  .name("tscheck")
  .description("Modern, high-performance TypeScript AST code audit CLI")
  .version(VERSION)
  .option("-c, --config <path>", "Path to custom tscheck configuration file")
  .option("-o, --output <dir>", "Custom directory to write audit reports")
  .option("--staged", "Only scan files currently staged in Git")
  .option("--since <ref>", "Only scan files changed since a specific git branch or commit")
  .option("--fix", "Automatically fix safe issues like prefixing unused variables/parameters with _")
  .option("-f, --format <format>", "Output format: pretty (default), json, or github", "pretty")
  .option("--no-deprecated", "Disable deprecated API usages check")
  .option("--no-unused", "Disable unused variables and imports check")
  .option("--no-any", "Disable explicit any usages check")
  .option("--no-circular", "Disable circular module dependencies check")
  .option("-i, --interactive", "Launch interactive terminal dashboard to filter and search issues")
  .option("--fail-on-warning", "Exit with non-zero code if any violations are found")
  .option("--json", "Output pure JSON report to stdout without Ink UI (shorthand for --format json)")
  .action(async (options) => {
    try {
      const { config, configPath } = await loadConfig(options.config);

      const format = options.json ? "json" : options.format || config.format || "pretty";

      // CLI flags override config
      const finalConfig: TsCheckConfig = {
        ...config,
        staged: options.staged ?? config.staged,
        since: options.since ?? config.since,
        fix: options.fix ?? config.fix,
        format,
        rules: {
          ...config.rules,
          deprecated: options.deprecated !== false && config.rules?.deprecated !== false,
          unused: options.unused !== false && config.rules?.unused !== false,
          noExplicitAny: options.any !== false && config.rules?.noExplicitAny !== false,
          circular: options.circular !== false && config.rules?.circular !== false,
        },
        reporters: {
          ...config.reporters,
          ...(options.output ? { outputDir: options.output } : {}),
        },
        failOnWarning: options.failOnWarning ?? config.failOnWarning,
      };

      // GitHub Actions Annotation format
      if (format === "github") {
        const report = await runAuditEngine(finalConfig);
        const reportFiles = writeAuditReports(report, finalConfig);
        report.reportFiles = reportFiles;
        emitGitHubAnnotations(report, finalConfig.failOnWarning);

        const hasViolations =
          report.summary.totalDeprecatedUsages > 0 ||
          report.summary.totalUnusedItems > 0 ||
          report.summary.totalAnyUsages > 0 ||
          (report.summary.totalCircularDependencies || 0) > 0;

        if (finalConfig.failOnWarning && hasViolations) {
          process.exit(1);
        }
        process.exit(0);
      }

      // Pure JSON output mode (headless / CI integration)
      if (format === "json") {
        const report = await runAuditEngine(finalConfig);
        const reportFiles = writeAuditReports(report, finalConfig);
        report.reportFiles = reportFiles;
        console.log(JSON.stringify(report, null, 2));

        const hasViolations =
          report.summary.totalDeprecatedUsages > 0 ||
          report.summary.totalUnusedItems > 0 ||
          report.summary.totalAnyUsages > 0 ||
          (report.summary.totalCircularDependencies || 0) > 0;

        if (finalConfig.failOnWarning && hasViolations) {
          process.exit(1);
        }
        process.exit(0);
      }

      // Ink React Mode (Default)
      let exitCode = 0;
      const { waitUntilExit } = render(
        <App
          config={finalConfig}
          configPath={configPath}
          version={VERSION}
          interactive={options.interactive}
          onDone={(report: AuditReport) => {
            const hasViolations =
              report.summary.totalDeprecatedUsages > 0 ||
              report.summary.totalUnusedItems > 0 ||
              report.summary.totalAnyUsages > 0 ||
              (report.summary.totalCircularDependencies || 0) > 0;

            if (finalConfig.failOnWarning && hasViolations) {
              exitCode = 1;
            }
          }}
        />
      );

      await waitUntilExit();
      if (exitCode !== 0) {
        process.exit(exitCode);
      }
    } catch (error) {
      console.error(
        `[ERROR] ${error instanceof Error ? error.message : String(error)}`
      );
      process.exit(1);
    }
  });

program.parse(process.argv);
