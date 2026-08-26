import { render } from "ink";
import * as path from "node:path";
import { Command } from "commander";
import { loadConfig } from "./config/loadConfig.js";
import type { TsCheckConfig, AuditReport, SupportedEditor } from "./config/types.js";
import { App } from "./ui/App.js";
import { runAuditEngine } from "./core/engine.js";
import { writeAuditReports, emitGitHubAnnotations } from "./core/reporter.js";
import { generateAiPrompt } from "./core/aiPrompt.js";
import { startReportServer, openInBrowser } from "./core/server.js";
import { getTscheckVersion } from "./version.js";

const VERSION = getTscheckVersion();

const program = new Command();

program
  .name("tscheck")
  .description("Modern, high-performance TypeScript AST code audit CLI")
  .version(VERSION)
  .option("-c, --config <path>", "Path to custom tscheck configuration file")
  .option("-o, --output <dir>", "Custom directory to write audit reports")
  .option("-s, --serve [port]", "Start local HTTP server to view the interactive HTML report (default: 5500)")
  .option("--no-serve", "Do not start local HTTP report server")
  .option("-O, --open", "Automatically open the HTML report in your default web browser")
  .option("--editor <editor>", "Default editor scheme (vscode, cursor, antigravity, windsurf, zed, webstorm, sublime)", "vscode")
  .option("--ai", "Output token-efficient AI prompt markdown to stdout (shorthand for --format ai)")
  .option("--staged", "Only scan files currently staged in Git")
  .option("--since <ref>", "Only scan files changed since a specific git branch or commit")
  .option("--fix", "Automatically fix safe issues like prefixing unused variables/parameters with _")
  .option("-f, --format <format>", "Output format: pretty (default), json, github, or ai", "pretty")
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

      let format = options.json ? "json" : options.ai ? "ai" : options.format || config.format || "pretty";

      const isCI = Boolean(process.env.CI || process.env.CONTINUOUS_INTEGRATION);
      let shouldServe: boolean;
      if (options.serve === false) {
        shouldServe = false;
      } else if (options.serve !== undefined) {
        shouldServe = true;
      } else if (isCI) {
        shouldServe = false;
      } else if (config.serve !== undefined) {
        shouldServe = config.serve;
      } else if (config.reporters?.serve !== undefined) {
        shouldServe = config.reporters.serve;
      } else {
        shouldServe = true;
      }

      const serverPort = typeof options.serve === "string" && !isNaN(Number(options.serve))
        ? Number(options.serve)
        : (config.port || config.reporters?.port || 5500);

      const shouldOpen = options.open || config.open || config.reporters?.open;
      const editor: SupportedEditor = (options.editor || config.editor || config.reporters?.editor || "vscode") as SupportedEditor;

      // CLI flags override config
      const finalConfig: TsCheckConfig = {
        ...config,
        staged: options.staged ?? config.staged,
        since: options.since ?? config.since,
        fix: options.fix ?? config.fix,
        format,
        serve: shouldServe,
        open: shouldOpen,
        port: serverPort,
        editor,
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
          editor,
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

      // AI Token-Efficient Output Mode
      if (format === "ai") {
        const report = await runAuditEngine(finalConfig);
        const reportFiles = writeAuditReports(report, finalConfig);
        report.reportFiles = reportFiles;
        console.log(generateAiPrompt(report));

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
      let generatedReportFiles: { json?: string; markdown?: string; html?: string; ai?: string } | undefined;

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
            generatedReportFiles = report.reportFiles;
          }}
        />
      );

      await waitUntilExit();

      // Handle HTML report server and browser opening if requested
      if (shouldServe || shouldOpen) {
        const rootDir = finalConfig.rootDir || process.cwd();
        const outputDir = path.isAbsolute(finalConfig.reporters?.outputDir || ".temp/tscheck")
          ? finalConfig.reporters!.outputDir!
          : path.resolve(rootDir, finalConfig.reporters?.outputDir || ".temp/tscheck");
        const htmlFileName = finalConfig.reporters?.htmlFileName || "audit-report.html";
        const htmlFilePath = path.join(outputDir, htmlFileName);

        const serverInstance = await startReportServer(htmlFilePath, serverPort);
        console.log(`\n  \x1b[36m➜\x1b[0m  \x1b[1mTSCheck Report Server\x1b[0m: \x1b[4m${serverInstance.url}\x1b[0m`);
        console.log(`  \x1b[90mPress Ctrl+C to stop the server\x1b[0m\n`);

        if (shouldOpen) {
          openInBrowser(serverInstance.url);
        }

        // Keep process running until interrupted
        await new Promise(() => {});
      }

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
