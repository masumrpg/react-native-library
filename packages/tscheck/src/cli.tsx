import { render } from "ink";
import * as path from "node:path";
import * as fs from "node:fs";
import { Command } from "commander";
import { loadConfig } from "./config/loadConfig.js";
import { resolveTsCheckConfig } from "./config/resolveConfig.js";
import type { AuditReport, NormalizedTsCheckConfig } from "./config/types.js";
import { App } from "./ui/App.js";
import { runAuditEngine } from "./core/engine.js";
import { writeAuditReports, emitGitHubAnnotations } from "./core/reporter.js";
import { generateAiPrompt } from "./core/aiPrompt.js";
import { startReportServer, openInBrowser } from "./core/server.js";
import { getTscheckVersion } from "./version.js";

// Suppress Node.js v22+ typeless package.json ESM warning during dynamic config import
process.on("warning", (warning: Error & { code?: string }) => {
  if (
    warning.name === "MODULE_TYPELESS_PACKAGE_JSON" ||
    warning.code === "MODULE_TYPELESS_PACKAGE_JSON"
  ) {
    return;
  }
  console.warn(warning);
});

const VERSION = getTscheckVersion();

/**
 * Starts a debounced file watcher that re-audits code when TypeScript source files change.
 */
function setupFileWatcher(
  auditConfig: NormalizedTsCheckConfig,
  targetDir: string
): void {
  console.log(
    `\n  \x1b[36m[WATCH]\x1b[0m Watching for changes in \x1b[1m${targetDir}\x1b[0m... (Press Ctrl+C to stop)\n`
  );

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let isReauditing = false;

  try {
    fs.watch(targetDir, { recursive: true }, (_event, filename) => {
      if (!filename) return;

      // Ignore common non-source directories and output files
      if (
        filename.includes("node_modules") ||
        filename.includes(".temp") ||
        filename.includes("dist") ||
        filename.includes(".git") ||
        filename.includes(".turbo")
      ) {
        return;
      }

      const isTsFile =
        /\.(tsx?|jsx?|mts|cts)$/.test(filename) && !filename.endsWith(".d.ts");
      const isConfigFile = filename.includes("tscheck");

      if (isTsFile || isConfigFile) {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          if (isReauditing) return;
          isReauditing = true;
          try {
            console.log(
              `  \x1b[36m[WATCH]\x1b[0m ${new Date().toLocaleTimeString()} Change detected in ${filename}. Re-auditing...`
            );
            const report = await runAuditEngine(auditConfig);
            writeAuditReports(report, auditConfig);

            const totalIssues =
              report.summary.totalDeprecatedUsages +
              report.summary.totalUnusedItems +
              report.summary.totalAnyUsages +
              (report.summary.totalCircularDependencies || 0);

            if (totalIssues === 0) {
              console.log(
                `  \x1b[32m[PASS]\x1b[0m Audit clean (${report.summary.filesScanned} files, 0 issues) in ${report.durationMs}ms\n`
              );
            } else {
              console.log(
                `  \x1b[33m[WARN]\x1b[0m ${totalIssues} issue(s) detected: ` +
                  `D:${report.summary.totalDeprecatedUsages} U:${report.summary.totalUnusedItems} ` +
                  `A:${report.summary.totalAnyUsages} C:${report.summary.totalCircularDependencies || 0} ` +
                  `in ${report.durationMs}ms\n`
              );
            }
          } catch (err) {
            console.error(
              `  \x1b[31m[ERROR]\x1b[0m ${err instanceof Error ? err.message : String(err)}`
            );
          } finally {
            isReauditing = false;
          }
        }, 150);
      }
    });
  } catch {
    // Graceful fallback if platform does not support recursive fs.watch
  }
}

const program = new Command();

program
  .name("tscheck")
  .description("Modern, high-performance TypeScript AST code audit CLI")
  .version(VERSION, "-V, --version", "Output the current tscheck version")
  .argument("[target]", "Target directory, workspace pattern, or file to audit", ".")
  .option("-c, --config <path>", "Path to custom tscheck configuration file")
  .option("-o, --output <dir>", "Custom directory to write audit reports")
  .option("-s, --serve [port]", "Start local HTTP server to view the interactive HTML report (default port: 5500)")
  .option("-p, --port <number>", "Port for local HTTP server (default: 5500)")
  .option("--no-serve", "Do not start local HTTP report server")
  .option("-O, --open", "Automatically open the HTML report in your default web browser")
  .option("-w, --watch", "Watch target directory for TypeScript file changes and re-audit", false)
  .option("--editor <editor>", "Default editor scheme (vscode, cursor, antigravity, windsurf, zed, webstorm, sublime)")
  .option("--ai", "Output token-efficient AI prompt markdown to stdout (shorthand for --format ai)")
  .option("--staged", "Only scan files currently staged in Git")
  .option("--since <ref>", "Only scan files changed since a specific git branch or commit")
  .option("--fix", "Automatically fix safe issues like prefixing unused variables/parameters with _")
  .option("-f, --format <format>", "Output format: pretty (default), json, github, or ai")
  .option("--no-deprecated", "Disable deprecated API usages check")
  .option("--no-unused", "Disable unused variables and imports check")
  .option("--no-any", "Disable explicit any usages check")
  .option("--no-circular", "Disable circular module dependencies check")
  .option("-i, --interactive", "Launch interactive terminal dashboard to filter and search issues")
  .option("--fail-on-warning", "Exit with non-zero code if any violations are found")
  .option("--json", "Output pure JSON report to stdout without Ink UI (shorthand for --format json)")
  .action(async (target: string, options) => {
    try {
      const targetArg = typeof target === "string" ? target : program.args[0] || ".";
      const { config, configPath } = await loadConfig(options.config);

      const isCI = Boolean(process.env.CI || process.env.CONTINUOUS_INTEGRATION);
      let shouldServe: boolean | undefined;
      if (options.serve === false) {
        shouldServe = false;
      } else if (options.serve !== undefined || options.port !== undefined || options.open) {
        shouldServe = true;
      } else if (isCI) {
        shouldServe = false;
      }

      let shouldOpen: boolean | undefined;
      if (options.serve === false) {
        shouldOpen = false;
      } else if (options.open !== undefined) {
        shouldOpen = Boolean(options.open);
      } else if (isCI) {
        shouldOpen = false;
      }

      const serverPort = options.port
        ? Number(options.port)
        : typeof options.serve === "string" && !isNaN(Number(options.serve))
        ? Number(options.serve)
        : undefined;

      const format = options.json ? "json" : options.ai ? "ai" : options.format;

      // Handle positional target argument: if user specified specific directory / pattern, override workspaces
      const hasSpecificTarget = targetArg && targetArg !== ".";
      const workspacesOverride = hasSpecificTarget ? [targetArg] : undefined;

      // Canonical normalized config resolution
      const finalConfig = resolveTsCheckConfig(config, {
        workspaces: workspacesOverride,
        staged: options.staged,
        since: options.since,
        fix: options.fix,
        format,
        serve: shouldServe,
        open: shouldOpen,
        port: serverPort,
        editor: options.editor,
        failOnWarning: options.failOnWarning,
        rules: {
          deprecated: options.deprecated,
          unused: options.unused,
          noExplicitAny: options.any,
          circular: options.circular,
        },
        reporters: {
          outputDir: options.output,
        },
      });

      // GitHub Actions Annotation format (headless)
      if (finalConfig.format === "github") {
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
          process.exitCode = 1;
          return;
        }
        process.exitCode = 0;
        return;
      }

      // AI Token-Efficient Output Mode (headless)
      if (finalConfig.format === "ai") {
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
          process.exitCode = 1;
          return;
        }
        process.exitCode = 0;
        return;
      }

      // Pure JSON output mode (headless / CI integration)
      if (finalConfig.format === "json") {
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
          process.exitCode = 1;
          return;
        }
        process.exitCode = 0;
        return;
      }

      // Ink React Mode (Default Terminal UI)
      let exitCode = 0;

      const { waitUntilExit, unmount } = render(
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

            if (!options.interactive && !options.watch) {
              setTimeout(() => {
                unmount();
              }, 50);
            }
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
        const htmlFilePath = path.join(outputDir, "audit-report.html");

        const serverInstance = await startReportServer(htmlFilePath, serverPort);
        console.log(`\n  \x1b[36m➜\x1b[0m  \x1b[1mTSCheck Report Server\x1b[0m: \x1b[4m${serverInstance.url}\x1b[0m`);
        console.log(`  \x1b[90mPress Ctrl+C to stop the server\x1b[0m\n`);

        if (shouldOpen) {
          openInBrowser(serverInstance.url);
        }

        // Keep process running until interrupted
        await new Promise(() => {});
      }

      // Handle Watch Mode
      if (options.watch) {
        const rootDir = finalConfig.rootDir || process.cwd();
        const targetDir = hasSpecificTarget ? path.resolve(rootDir, targetArg) : rootDir;
        setupFileWatcher(finalConfig, targetDir);

        // Keep watch process running until interrupted
        await new Promise(() => {});
      }

      if (exitCode !== 0) {
        process.exitCode = exitCode;
      }
    } catch (error) {
      console.error(
        `[ERROR] ${error instanceof Error ? error.message : String(error)}`
      );
      process.exitCode = 1;
    }
  });

program.parse(process.argv);
