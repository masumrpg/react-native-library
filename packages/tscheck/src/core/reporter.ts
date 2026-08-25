import * as fs from "node:fs";
import * as path from "node:path";
import type { TsCheckConfig, AuditReport } from "../config/types.js";

/**
 * Generates and saves JSON and Markdown audit reports to disk.
 */
export function writeAuditReports(
  report: AuditReport,
  config: TsCheckConfig
): { json?: string; markdown?: string } {
  const rootDir = config.rootDir || process.cwd();
  const outputDir = path.isAbsolute(config.reporters?.outputDir || ".temp/tscheck")
    ? config.reporters!.outputDir!
    : path.resolve(rootDir, config.reporters?.outputDir || ".temp/tscheck");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const result: { json?: string; markdown?: string } = {};

  // 1. JSON Report
  if (config.reporters?.json !== false) {
    const jsonFileName = config.reporters?.jsonFileName || "audit-report.json";
    const jsonPath = path.join(outputDir, jsonFileName);
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), "utf-8");
    result.json = path.relative(rootDir, jsonPath);
  }

  // 2. Markdown Report
  if (config.reporters?.markdown !== false) {
    const markdownFileName = config.reporters?.markdownFileName || "audit-report.md";
    const markdownPath = path.join(outputDir, markdownFileName);
    const mdContent = generateMarkdownReport(report, rootDir);
    fs.writeFileSync(markdownPath, mdContent, "utf-8");
    result.markdown = path.relative(rootDir, markdownPath);
  }

  return result;
}

function generateMarkdownReport(report: AuditReport, rootDir: string): string {
  const lines: string[] = [];
  const hasViolations =
    report.summary.totalDeprecatedUsages > 0 ||
    report.summary.totalUnusedItems > 0 ||
    report.summary.totalAnyUsages > 0;

  lines.push("# TypeScript Codebase Audit Report");
  lines.push("");
  lines.push(`> **Status**: \`${hasViolations ? "[FAILED] VIOLATIONS DETECTED" : "[PASSED] 100% CLEAN"}\` | **Generated**: \`${report.timestamp}\` | **Duration**: \`${(report.durationMs / 1000).toFixed(2)}s\``);
  lines.push("");

  // 1. Executive Summary Table
  lines.push("## Executive Summary");
  lines.push("");
  lines.push("| Metric | Count | Target / Policy | Status |");
  lines.push("| :--- | :---: | :---: | :---: |");
  lines.push(
    `| Total Workspaces Scanned | \`${report.summary.workspacesScanned}\` | All active projects | \`[OK]\` |`
  );
  lines.push(
    `| Total Files Scanned | \`${report.summary.filesScanned}\` | \`${report.summary.cleanFilesCount} clean\` | \`[OK]\` |`
  );
  lines.push(
    `| Deprecated API Usages | \`${report.summary.totalDeprecatedUsages}\` | 0 allowed | ${
      report.summary.totalDeprecatedUsages === 0 ? "`[PASSED]`" : "`[WARN]`"
    } |`
  );
  lines.push(
    `| Unused Variables / Imports | \`${report.summary.totalUnusedItems}\` | 0 allowed | ${
      report.summary.totalUnusedItems === 0 ? "`[PASSED]`" : "`[WARN]`"
    } |`
  );
  lines.push(
    `| Explicit \`any\` Type Usages | \`${report.summary.totalAnyUsages}\` | 0 allowed | ${
      report.summary.totalAnyUsages === 0 ? "`[PASSED]`" : "`[WARN]`"
    } |`
  );
  lines.push("");

  // 2. Workspaces Breakdown Table
  lines.push("## Workspaces Breakdown");
  lines.push("");
  lines.push("| Workspace | Files | Clean Files | Deprecated | Unused | Explicit Any | Status |");
  lines.push("| :--- | :---: | :---: | :---: | :---: | :---: | :---: |");
  for (const ws of report.workspaces) {
    const isClean = ws.deprecatedCount === 0 && ws.unusedCount === 0 && ws.anyCount === 0;
    const cleanFilesCount = Math.max(0, ws.filesScanned - (ws.deprecatedCount + ws.unusedCount + ws.anyCount));
    lines.push(
      `| \`${ws.name}\` | ${ws.filesScanned} | ${cleanFilesCount} | ${ws.deprecatedCount} | ${ws.unusedCount} | ${
        ws.anyCount
      } | ${isClean ? "`[PASSED]`" : "`[FAILED]`"} |`
    );
  }
  lines.push("");

  // 3. Deprecated Usages Section
  if (report.deprecatedUsages.length > 0) {
    lines.push("## Deprecated API Usages");
    lines.push("");
    lines.push("| Symbol | Package | Location | Reason |");
    lines.push("| :--- | :--- | :--- | :--- |");
    for (const item of report.deprecatedUsages) {
      const relFile = path.relative(rootDir, item.file);
      const cleanReason = item.reason.replace(/\|/g, "\\|").replace(/\n/g, " ");
      lines.push(
        `| \`${item.symbol}\` | \`${item.package}\` | \`${relFile}:${item.line}:${item.column}\` | ${cleanReason} |`
      );
    }
    lines.push("");

    lines.push("### Code Snippets");
    lines.push("");
    for (const item of report.deprecatedUsages) {
      const relFile = path.relative(rootDir, item.file);
      lines.push(`#### \`${item.symbol}\` in \`${relFile}:${item.line}\``);
      lines.push(`- **Reason**: ${item.reason}`);
      lines.push("```typescript");
      lines.push(item.codeSnippet);
      lines.push("```");
      lines.push("");
    }
  }

  // 4. Unused Items Section
  if (report.unusedItems.length > 0) {
    lines.push("## Unused Variables & Imports");
    lines.push("");
    lines.push("| Identifier | Type | Package | Location | Diagnostic Message |");
    lines.push("| :--- | :--- | :--- | :--- | :--- |");
    for (const item of report.unusedItems) {
      const relFile = path.relative(rootDir, item.file);
      const cleanMsg = item.message.replace(/\|/g, "\\|").replace(/\n/g, " ");
      lines.push(
        `| \`${item.name}\` | \`${item.type}\` | \`${item.package}\` | \`${relFile}:${item.line}:${item.column}\` | ${cleanMsg} |`
      );
    }
    lines.push("");
  }

  // 5. Explicit Any Usages Section
  if (report.anyUsages.length > 0) {
    lines.push("## Explicit Any Usages");
    lines.push("");
    lines.push("| Package | Location | Context | Snippet |");
    lines.push("| :--- | :--- | :--- | :--- |");
    for (const item of report.anyUsages) {
      const relFile = path.relative(rootDir, item.file);
      const cleanSnippet = item.codeSnippet.replace(/\|/g, "\\|").replace(/\n/g, " ");
      lines.push(
        `| \`${item.package}\` | \`${relFile}:${item.line}:${item.column}\` | \`${item.context}\` | \`${cleanSnippet}\` |`
      );
    }
    lines.push("");

    lines.push("### Any Usages Code Snippets");
    lines.push("");
    for (const item of report.anyUsages) {
      const relFile = path.relative(rootDir, item.file);
      lines.push(`#### \`${relFile}:${item.line}\` (${item.context})`);
      lines.push("```typescript");
      lines.push(item.codeSnippet);
      lines.push("```");
      lines.push("");
    }
  }

  return lines.join("\n");
}
