import { render } from "ink";
import { Command } from "commander";
import { loadConfig } from "./config/loadConfig.js";
import type { TsCheckConfig, AuditReport } from "./config/types.js";
import { App } from "./ui/App.js";
import { runAuditEngine } from "./core/engine.js";
import { writeAuditReports } from "./core/reporter.js";

const VERSION = "0.1.0";

const program = new Command();

program
  .name("tscheck")
  .description("Modern, high-performance TypeScript AST code audit CLI")
  .version(VERSION)
  .option("-c, --config <path>", "Path to custom tscheck configuration file")
  .option("-o, --output <dir>", "Custom directory to write audit reports")
  .option("--no-deprecated", "Disable deprecated API usages check")
  .option("--no-unused", "Disable unused variables and imports check")
  .option("--no-any", "Disable explicit any usages check")
  .option("-i, --interactive", "Launch interactive terminal dashboard to filter and search issues")
  .option("--fail-on-warning", "Exit with non-zero code if any violations are found")
  .option("--json", "Output pure JSON report to stdout without Ink UI")
  .action(async (options) => {
    try {
      const { config, configPath } = await loadConfig(options.config);

      // CLI flags override config
      const finalConfig: TsCheckConfig = {
        ...config,
        rules: {
          ...config.rules,
          deprecated: options.deprecated !== false && config.rules?.deprecated !== false,
          unused: options.unused !== false && config.rules?.unused !== false,
          noExplicitAny: options.any !== false && config.rules?.noExplicitAny !== false,
        },
        reporters: {
          ...config.reporters,
          ...(options.output ? { outputDir: options.output } : {}),
        },
        failOnWarning: options.failOnWarning ?? config.failOnWarning,
      };

      // Pure JSON output mode (headless / CI integration)
      if (options.json) {
        const report = await runAuditEngine(finalConfig);
        const reportFiles = writeAuditReports(report, finalConfig);
        report.reportFiles = reportFiles;
        console.log(JSON.stringify(report, null, 2));

        const hasViolations =
          report.summary.totalDeprecatedUsages > 0 ||
          report.summary.totalUnusedItems > 0 ||
          report.summary.totalAnyUsages > 0;

        if (finalConfig.failOnWarning && hasViolations) {
          process.exit(1);
        }
        process.exit(0);
      }

      // Ink React Mode
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
              report.summary.totalAnyUsages > 0;

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
