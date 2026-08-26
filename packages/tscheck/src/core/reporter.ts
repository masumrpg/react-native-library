import * as fs from "node:fs";
import * as path from "node:path";
import type { TsCheckConfig, AuditReport } from "../config/types.js";

/**
 * Generates and saves JSON, Markdown, and HTML audit reports to disk.
 */
export function writeAuditReports(
  report: AuditReport,
  config: TsCheckConfig
): { json?: string; markdown?: string; html?: string } {
  const rootDir = config.rootDir || process.cwd();
  const outputDir = path.isAbsolute(config.reporters?.outputDir || ".temp/tscheck")
    ? config.reporters!.outputDir!
    : path.resolve(rootDir, config.reporters?.outputDir || ".temp/tscheck");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const result: { json?: string; markdown?: string; html?: string } = {};

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

  // 3. HTML Report
  if (config.reporters?.html !== false) {
    const htmlFileName = config.reporters?.htmlFileName || "audit-report.html";
    const htmlPath = path.join(outputDir, htmlFileName);
    const htmlContent = generateHtmlReport(report, rootDir);
    fs.writeFileSync(htmlPath, htmlContent, "utf-8");
    result.html = path.relative(rootDir, htmlPath);
  }

  // 4. GitHub Annotations
  if (config.reporters?.githubAnnotations) {
    emitGitHubAnnotations(report, config.failOnWarning);
  }

  return result;
}

/**
 * Emits GitHub Actions workflow commands (::warning / ::error) for each violation.
 */
export function emitGitHubAnnotations(report: AuditReport, failOnWarning: boolean = false): void {
  const level = failOnWarning ? "error" : "warning";
  const rootDir = process.cwd();

  // Deprecated
  for (const item of report.deprecatedUsages) {
    const relFile = path.relative(rootDir, item.file);
    const msg = `[DEPRECATED] Usage of '${item.symbol}': ${item.reason}`;
    console.log(`::${level} file=${relFile},line=${item.line},col=${item.column},title=Deprecated API::${msg}`);
  }

  // Unused
  for (const item of report.unusedItems) {
    const relFile = path.relative(rootDir, item.file);
    const msg = `[UNUSED] ${item.message}`;
    console.log(`::${level} file=${relFile},line=${item.line},col=${item.column},title=Unused Diagnostic::${msg}`);
  }

  // Explicit Any
  for (const item of report.anyUsages) {
    const relFile = path.relative(rootDir, item.file);
    const msg = `[EXPLICIT ANY] Explicit any in ${item.context}`;
    console.log(`::${level} file=${relFile},line=${item.line},col=${item.column},title=Explicit Any Type::${msg}`);
  }

  // Circular
  for (const item of report.circularDependencies) {
    const relFile = path.relative(rootDir, item.file);
    const cycleStr = item.cycle.map((p) => path.basename(p)).join(" -> ");
    const msg = `[CIRCULAR DEPENDENCY] Cycle detected: ${cycleStr}`;
    console.log(`::error file=${relFile},line=${item.line},col=${item.column},title=Circular Dependency::${msg}`);
  }

}

function generateMarkdownReport(report: AuditReport, rootDir: string): string {
  const lines: string[] = [];
  const totalCirc = report.circularDependencies?.length || 0;
  const hasViolations =
    report.summary.totalDeprecatedUsages > 0 ||
    report.summary.totalUnusedItems > 0 ||
    report.summary.totalAnyUsages > 0 ||
    totalCirc > 0;

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
  lines.push(
    `| Circular Dependency Cycles | \`${totalCirc}\` | 0 allowed | ${
      totalCirc === 0 ? "`[PASSED]`" : "`[FAILED]`"
    } |`
  );
  if (report.summary.suppressedCount > 0) {
    lines.push(
      `| Suppressed via Comments | \`${report.summary.suppressedCount}\` | Inline bypasses | \`[SUPPRESSED]\` |`
    );
  }
  if (report.summary.fixedCount > 0) {
    lines.push(
      `| Auto-Fixed Violations | \`${report.summary.fixedCount}\` | Safe fixes applied | \`[FIXED]\` |`
    );
  }
  lines.push("");

  // 2. Workspaces Breakdown Table
  lines.push("## Workspaces Breakdown");
  lines.push("");
  lines.push("| Workspace | Files | Clean Files | Deprecated | Unused | Any | Circular | Status |");
  lines.push("| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |");
  for (const ws of report.workspaces) {
    const wsCirc = ws.circularCount || 0;
    const isClean = ws.deprecatedCount === 0 && ws.unusedCount === 0 && ws.anyCount === 0 && wsCirc === 0;
    const cleanFilesCount = Math.max(0, ws.filesScanned - (ws.deprecatedCount + ws.unusedCount + ws.anyCount + wsCirc));
    lines.push(
      `| \`${ws.name}\` | ${ws.filesScanned} | ${cleanFilesCount} | ${ws.deprecatedCount} | ${ws.unusedCount} | ${
        ws.anyCount
      } | ${wsCirc} | ${isClean ? "`[PASSED]`" : "`[FAILED]`"} |`
    );
  }
  lines.push("");

  // 3. Circular Dependencies Section
  if (report.circularDependencies && report.circularDependencies.length > 0) {
    lines.push("## Circular Dependencies");
    lines.push("");
    lines.push("| Package | Location | Dependency Cycle |");
    lines.push("| :--- | :--- | :--- |");
    for (const item of report.circularDependencies) {
      const relFile = path.relative(rootDir, item.file);
      const cycleStr = item.cycle.map((p) => `\`${path.relative(rootDir, p)}\``).join(" ➔ ");
      lines.push(
        `| \`${item.package}\` | \`${relFile}:${item.line}:${item.column}\` | ${cycleStr} |`
      );
    }
    lines.push("");
  }

  // 5. Deprecated Usages Section
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
  }

  // 6. Unused Items Section
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

  // 7. Explicit Any Usages Section
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
  }

  return lines.join("\n");
}

/**
 * Parses markdown links and raw URLs in reason text into HTML anchor tags.
 */
function linkifyText(text: string): string {
  if (!text) return "";
  // Escape basic HTML
  let escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Markdown links: [Title](https://...)
  escaped = escaped.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="link-tag">$1 <svg class="inline-icon" viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>'
  );

  // Raw URLs: https://...
  escaped = escaped.replace(
    /(^|[\s(])(https?:\/\/[^\s)]+)/g,
    '$1<a href="$2" target="_blank" rel="noopener noreferrer" class="link-tag">$2 <svg class="inline-icon" viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>'
  );

  // Inline backticks: `code`
  escaped = escaped.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

  return escaped;
}

function escapeHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Generates modern, zero-emoji, responsive HTML audit report.
 */
function generateHtmlReport(report: AuditReport, rootDir: string): string {
  const totalCirc = report.circularDependencies?.length || 0;
  const hasViolations =
    report.summary.totalDeprecatedUsages > 0 ||
    report.summary.totalUnusedItems > 0 ||
    report.summary.totalAnyUsages > 0 ||
    totalCirc > 0;

  const totalViolations =
    report.summary.totalDeprecatedUsages +
    report.summary.totalUnusedItems +
    report.summary.totalAnyUsages +
    totalCirc;

  // Prepare violation cards data
  const violations: Array<{
    id: string;
    type: "deprecated" | "unused" | "any" | "circular";
    typeLabel: string;
    package: string;
    file: string;
    relFile: string;
    line: number;
    column: number;
    title: string;
    detail: string;
    formattedDetail: string;
    codeSnippet: string;
  }> = [];

  let vIdx = 0;
  if (report.circularDependencies) {
    for (const item of report.circularDependencies) {
      vIdx++;
      const relFile = path.relative(rootDir, item.file);
      const cycleStr = item.cycle.map((p) => path.relative(rootDir, p)).join(" ➔ ");
      violations.push({
        id: `v-${vIdx}`,
        type: "circular",
        typeLabel: "CIRCULAR",
        package: item.package,
        file: item.file,
        relFile,
        line: item.line,
        column: item.column,
        title: "Circular Module Dependency",
        detail: `Cycle: ${cycleStr}`,
        formattedDetail: `Dependency cycle: <code>${escapeHtml(cycleStr)}</code>`,
        codeSnippet: item.codeSnippet,
      });
    }
  }

  for (const item of report.deprecatedUsages) {
    vIdx++;
    const relFile = path.relative(rootDir, item.file);
    violations.push({
      id: `v-${vIdx}`,
      type: "deprecated",
      typeLabel: "DEPRECATED",
      package: item.package,
      file: item.file,
      relFile,
      line: item.line,
      column: item.column,
      title: item.symbol,
      detail: item.reason,
      formattedDetail: linkifyText(item.reason),
      codeSnippet: item.codeSnippet,
    });
  }

  for (const item of report.unusedItems) {
    vIdx++;
    const relFile = path.relative(rootDir, item.file);
    violations.push({
      id: `v-${vIdx}`,
      type: "unused",
      typeLabel: "UNUSED",
      package: item.package,
      file: item.file,
      relFile,
      line: item.line,
      column: item.column,
      title: `${item.name} (${item.type})`,
      detail: item.message,
      formattedDetail: linkifyText(item.message),
      codeSnippet: "",
    });
  }

  for (const item of report.anyUsages) {
    vIdx++;
    const relFile = path.relative(rootDir, item.file);
    violations.push({
      id: `v-${vIdx}`,
      type: "any",
      typeLabel: "ANY TYPE",
      package: item.package,
      file: item.file,
      relFile,
      line: item.line,
      column: item.column,
      title: item.context,
      detail: `Explicit any usage in ${item.context}`,
      formattedDetail: `Explicit <code>any</code> usage in ${escapeHtml(item.context)}`,
      codeSnippet: item.codeSnippet,
    });
  }

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TSCheck Audit Report — ${hasViolations ? "[FAILED] Violations Found" : "[PASSED] Clean"}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --surface: #0f172a;
      --surface-border: #1e293b;
      --surface-hover: #1e293b80;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --text-dim: #64748b;
      --primary: #06b6d4;
      --primary-light: #22d3ee;
      --primary-bg: rgba(6, 182, 212, 0.1);
      --success: #10b981;
      --success-bg: rgba(16, 185, 129, 0.1);
      --warning: #f59e0b;
      --warning-bg: rgba(245, 158, 11, 0.1);
      --danger: #ef4444;
      --danger-bg: rgba(239, 68, 68, 0.1);
      --code-bg: #050811;
      --code-border: #1e293b;
      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 14px;
      --shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
      --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    [data-theme="light"] {
      --bg: #f8fafc;
      --surface: #ffffff;
      --surface-border: #e2e8f0;
      --surface-hover: #f1f5f9;
      --text: #0f172a;
      --text-muted: #475569;
      --text-dim: #94a3b8;
      --primary: #0891b2;
      --primary-light: #06b6d4;
      --primary-bg: rgba(8, 145, 178, 0.08);
      --success: #059669;
      --success-bg: rgba(5, 150, 105, 0.08);
      --warning: #d97706;
      --warning-bg: rgba(217, 119, 6, 0.08);
      --danger: #dc2626;
      --danger-bg: rgba(220, 38, 38, 0.08);
      --code-bg: #f1f5f9;
      --code-border: #cbd5e1;
      --shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.08);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: var(--font-sans);
      line-height: 1.5;
      padding: 32px 24px;
      min-height: 100vh;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--surface-border);
      margin-bottom: 28px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .brand-icon {
      width: 42px;
      height: 42px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, var(--primary), #3b82f6);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 18px;
      letter-spacing: -0.5px;
      box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
    }
    .brand-title {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: var(--text);
    }
    .brand-subtitle {
      font-size: 13px;
      color: var(--text-muted);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.3px;
      text-transform: uppercase;
    }
    .status-passed {
      background: var(--success-bg);
      color: var(--success);
      border: 1px solid var(--success);
    }
    .status-failed {
      background: var(--danger-bg);
      color: var(--danger);
      border: 1px solid var(--danger);
    }

    .theme-toggle {
      background: var(--surface);
      border: 1px solid var(--surface-border);
      color: var(--text-muted);
      cursor: pointer;
      width: 38px;
      height: 38px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    .theme-toggle:hover {
      color: var(--text);
      border-color: var(--primary);
    }

    /* Meta bar */
    .meta-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-lg);
      padding: 16px 20px;
      margin-bottom: 28px;
      box-shadow: var(--shadow);
    }
    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .meta-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-dim);
    }
    .meta-value {
      font-size: 14px;
      font-weight: 600;
      color: var(--text);
      font-family: var(--font-mono);
    }

    /* Metric Cards Grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    .metric-card {
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-lg);
      padding: 20px;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      gap: 8px;
      position: relative;
      overflow: hidden;
    }
    .metric-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
    }
    .metric-card.card-primary::before { background: var(--primary); }
    .metric-card.card-warning::before { background: var(--warning); }
    .metric-card.card-danger::before { background: var(--danger); }
    .metric-card.card-success::before { background: var(--success); }

    .metric-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .metric-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted);
    }
    .metric-count {
      font-size: 32px;
      font-weight: 700;
      font-family: var(--font-mono);
      color: var(--text);
    }
    .metric-footer {
      font-size: 12px;
      color: var(--text-dim);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Workspaces Section */
    .section-title {
      font-size: 17px;
      font-weight: 700;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text);
    }
    .table-container {
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-lg);
      overflow: hidden;
      margin-bottom: 32px;
      box-shadow: var(--shadow);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 13px;
    }
    th {
      background: rgba(15, 23, 42, 0.6);
      padding: 12px 16px;
      font-weight: 600;
      color: var(--text-muted);
      border-bottom: 1px solid var(--surface-border);
    }
    [data-theme="light"] th {
      background: #f1f5f9;
    }
    td {
      padding: 12px 16px;
      border-bottom: 1px solid var(--surface-border);
      color: var(--text);
    }
    tr:last-child td {
      border-bottom: none;
    }
    tr:hover td {
      background: var(--surface-hover);
    }
    .badge-pill {
      display: inline-block;
      padding: 3px 8px;
      border-radius: var(--radius-sm);
      font-size: 11px;
      font-weight: 600;
      font-family: var(--font-mono);
    }
    .pill-clean { background: var(--success-bg); color: var(--success); }
    .pill-warn { background: var(--warning-bg); color: var(--warning); }
    .pill-danger { background: var(--danger-bg); color: var(--danger); }

    /* Explorer / Filter Area */
    .explorer-header {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .search-box {
      flex: 1;
      min-width: 240px;
      position: relative;
    }
    .search-box input {
      width: 100%;
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-md);
      padding: 10px 14px 10px 38px;
      color: var(--text);
      font-size: 13px;
      font-family: var(--font-sans);
      outline: none;
      transition: border-color 0.2s ease;
    }
    .search-box input:focus {
      border-color: var(--primary);
    }
    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-dim);
      pointer-events: none;
    }

    .filter-tabs {
      display: flex;
      gap: 6px;
      background: var(--surface);
      padding: 4px;
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-md);
    }
    .tab-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 600;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .tab-btn.active {
      background: var(--primary);
      color: white;
    }
    .tab-btn:hover:not(.active) {
      color: var(--text);
      background: var(--surface-hover);
    }

    /* Violation Cards */
    .violations-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .violation-card {
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-lg);
      padding: 18px 20px;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: transform 0.15s ease, border-color 0.15s ease;
    }
    .violation-card:hover {
      border-color: rgba(6, 182, 212, 0.4);
    }
    .violation-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      flex-wrap: wrap;
    }
    .violation-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .tag-deprecated {
      background: var(--warning-bg);
      color: var(--warning);
      border: 1px solid var(--warning);
      padding: 3px 8px;
      border-radius: var(--radius-sm);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }
    .tag-unused {
      background: rgba(148, 163, 184, 0.15);
      color: var(--text-muted);
      border: 1px solid var(--text-dim);
      padding: 3px 8px;
      border-radius: var(--radius-sm);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }
    .tag-any {
      background: var(--danger-bg);
      color: var(--danger);
      border: 1px solid var(--danger);
      padding: 3px 8px;
      border-radius: var(--radius-sm);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }
    .tag-circular {
      background: rgba(168, 85, 247, 0.15);
      color: #c084fc;
      border: 1px solid #a855f7;
      padding: 3px 8px;
      border-radius: var(--radius-sm);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }
    .tag-pkg {
      background: var(--surface-border);
      color: var(--text);
      padding: 3px 8px;
      border-radius: var(--radius-sm);
      font-size: 11px;
      font-weight: 600;
      font-family: var(--font-mono);
    }
    .file-link {
      color: var(--text-dim);
      font-size: 12px;
      font-family: var(--font-mono);
      display: inline-flex;
      align-items: center;
      gap: 4px;
      text-decoration: none;
      transition: color 0.15s ease;
    }
    .file-link:hover {
      color: var(--primary-light);
    }

    .violation-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--text);
      font-family: var(--font-mono);
    }
    .violation-reason {
      font-size: 13px;
      color: var(--text-muted);
      background: var(--surface-hover);
      padding: 10px 14px;
      border-radius: var(--radius-md);
      border-left: 3px solid var(--primary);
      line-height: 1.6;
    }
    .link-tag {
      color: var(--primary-light);
      text-decoration: underline;
      text-underline-offset: 2px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 3px;
    }
    .inline-code {
      background: var(--code-bg);
      border: 1px solid var(--code-border);
      padding: 2px 6px;
      border-radius: var(--radius-sm);
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--primary-light);
    }

    /* Code Snippet Container */
    .snippet-container {
      background: var(--code-bg);
      border: 1px solid var(--code-border);
      border-radius: var(--radius-md);
      padding: 12px 16px;
      position: relative;
      overflow-x: auto;
    }
    .snippet-code {
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--text);
      white-space: pre;
    }
    .copy-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      background: var(--surface);
      border: 1px solid var(--surface-border);
      color: var(--text-dim);
      border-radius: var(--radius-sm);
      padding: 4px 8px;
      font-size: 11px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: all 0.2s ease;
    }
    .copy-btn:hover {
      color: var(--text);
      border-color: var(--primary);
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;
      background: var(--surface);
      border: 1px dashed var(--surface-border);
      border-radius: var(--radius-lg);
      color: var(--text-muted);
    }
    .empty-icon {
      width: 48px;
      height: 48px;
      margin-bottom: 12px;
      color: var(--success);
    }

    footer {
      margin-top: 48px;
      text-align: center;
      font-size: 12px;
      color: var(--text-dim);
      border-top: 1px solid var(--surface-border);
      padding-top: 20px;
    }
    footer a {
      color: var(--text-muted);
      text-decoration: none;
    }
    footer a:hover {
      color: var(--primary);
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <header class="header">
      <div class="brand">
        <div class="brand-icon">TSC</div>
        <div>
          <h1 class="brand-title">TSCheck Audit Report</h1>
          <p class="brand-subtitle">TypeScript AST Codebase Quality & Policy Inspector</p>
        </div>
      </div>
      <div class="header-actions">
        <span class="status-badge ${hasViolations ? 'status-failed' : 'status-passed'}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            ${
              hasViolations
                ? '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
                : '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
            }
          </svg>
          ${hasViolations ? `${totalViolations} Violations Found` : '100% Passed'}
        </span>
        <button id="theme-btn" class="theme-toggle" title="Toggle Light/Dark Mode">
          <svg class="sun-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        </button>
      </div>
    </header>

    <!-- Meta Information Bar -->
    <div class="meta-bar">
      <div class="meta-item">
        <span class="meta-label">Audit Timestamp</span>
        <span class="meta-value">${escapeHtml(report.timestamp)}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Scan Duration</span>
        <span class="meta-value">${(report.durationMs / 1000).toFixed(2)}s</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Workspaces Scanned</span>
        <span class="meta-value">${report.summary.workspacesScanned}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Files Scanned</span>
        <span class="meta-value">${report.summary.filesScanned} (${report.summary.cleanFilesCount} Clean)</span>
      </div>
    </div>

    <!-- Executive Metrics Grid -->
    <div class="metrics-grid">
      <div class="metric-card card-primary">
        <div class="metric-header">
          <span class="metric-title">Files Scanned</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
        </div>
        <div class="metric-count">${report.summary.filesScanned}</div>
        <div class="metric-footer">
          <span>${report.summary.cleanFilesCount} completely clean</span>
        </div>
      </div>

      <div class="metric-card ${report.summary.totalDeprecatedUsages > 0 ? 'card-warning' : 'card-success'}">
        <div class="metric-header">
          <span class="metric-title">Deprecated APIs</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${report.summary.totalDeprecatedUsages > 0 ? 'var(--warning)' : 'var(--success)'}" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div class="metric-count">${report.summary.totalDeprecatedUsages}</div>
        <div class="metric-footer">
          <span>${report.summary.totalDeprecatedUsages === 0 ? 'Zero deprecated usages' : 'Requires refactoring'}</span>
        </div>
      </div>

      <div class="metric-card ${report.summary.totalUnusedItems > 0 ? 'card-warning' : 'card-success'}">
        <div class="metric-header">
          <span class="metric-title">Unused Variables</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${report.summary.totalUnusedItems > 0 ? 'var(--warning)' : 'var(--success)'}" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
        <div class="metric-count">${report.summary.totalUnusedItems}</div>
        <div class="metric-footer">
          <span>${report.summary.totalUnusedItems === 0 ? 'No unused code' : 'Unused vars/imports found'}</span>
        </div>
      </div>

      <div class="metric-card ${report.summary.totalAnyUsages > 0 ? 'card-danger' : 'card-success'}">
        <div class="metric-header">
          <span class="metric-title">Explicit Any Types</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${report.summary.totalAnyUsages > 0 ? 'var(--danger)' : 'var(--success)'}" stroke-width="2">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </div>
        <div class="metric-count">${report.summary.totalAnyUsages}</div>
        <div class="metric-footer">
          <span>${report.summary.totalAnyUsages === 0 ? 'Strict type safety achieved' : 'Unsafe any types present'}</span>
        </div>
      </div>
    </div>

    <!-- Workspaces Breakdown Table -->
    <h2 class="section-title">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
      Workspaces Breakdown
    </h2>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Workspace</th>
            <th>Total Files</th>
            <th>Clean Files</th>
            <th>Deprecated</th>
            <th>Unused</th>
            <th>Any</th>
            <th>Circular</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${report.workspaces
            .map((ws) => {
              const wsCirc = ws.circularCount || 0;
              const isClean = ws.deprecatedCount === 0 && ws.unusedCount === 0 && ws.anyCount === 0 && wsCirc === 0;
              const cleanCount = Math.max(0, ws.filesScanned - (ws.deprecatedCount + ws.unusedCount + ws.anyCount + wsCirc));
              return `<tr>
                <td><strong>${escapeHtml(ws.name)}</strong></td>
                <td><code>${ws.filesScanned}</code></td>
                <td><code>${cleanCount}</code></td>
                <td><span class="badge-pill ${ws.deprecatedCount === 0 ? 'pill-clean' : 'pill-warn'}">${ws.deprecatedCount}</span></td>
                <td><span class="badge-pill ${ws.unusedCount === 0 ? 'pill-clean' : 'pill-warn'}">${ws.unusedCount}</span></td>
                <td><span class="badge-pill ${ws.anyCount === 0 ? 'pill-clean' : 'pill-danger'}">${ws.anyCount}</span></td>
                <td><span class="badge-pill ${wsCirc === 0 ? 'pill-clean' : 'pill-danger'}">${wsCirc}</span></td>
                <td><span class="badge-pill ${isClean ? 'pill-clean' : 'pill-danger'}">${isClean ? 'PASSED' : 'FAILED'}</span></td>
              </tr>`;
            })
            .join("")}
        </tbody>
      </table>
    </div>

    <!-- Violations Explorer Section -->
    <h2 class="section-title">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
      Issues & Violations Explorer
    </h2>

    <div class="explorer-header">
      <div class="search-box">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" id="search-input" placeholder="Search by package, symbol, reason, or file path...">
      </div>

      <div class="filter-tabs">
        <button class="tab-btn active" data-filter="all">All (${violations.length})</button>
        <button class="tab-btn" data-filter="deprecated">Deprecated (${report.summary.totalDeprecatedUsages})</button>
        <button class="tab-btn" data-filter="unused">Unused (${report.summary.totalUnusedItems})</button>
        <button class="tab-btn" data-filter="any">Any (${report.summary.totalAnyUsages})</button>
        <button class="tab-btn" data-filter="circular">Circular (${totalCirc})</button>
      </div>
    </div>

    <div id="violations-container" class="violations-list">
      ${
        violations.length === 0
          ? `<div class="empty-state">
              <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <h3>Congratulations! 0 Violations Detected</h3>
              <p>Your codebase is fully compliant with strict TypeScript safety policies.</p>
            </div>`
          : violations
              .map(
                (v) => `
        <div class="violation-card" data-type="${v.type}" data-pkg="${escapeHtml(v.package)}" data-text="${escapeHtml(
                  `${v.package} ${v.relFile} ${v.title} ${v.detail}`.toLowerCase()
                )}">
          <div class="violation-top">
            <div class="violation-meta">
              <span class="tag-${v.type}">${v.typeLabel}</span>
              <span class="tag-pkg">${escapeHtml(v.package)}</span>
              <span class="file-link">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
                ${escapeHtml(v.relFile)}:${v.line}:${v.column}
              </span>
            </div>
            <button class="copy-btn" onclick="navigator.clipboard.writeText('${escapeHtml(v.relFile)}:${v.line}')" title="Copy File Location">
              Copy Loc
            </button>
          </div>

          <div class="violation-title">${escapeHtml(v.title)}</div>

          ${
            v.formattedDetail
              ? `<div class="violation-reason">${v.formattedDetail}</div>`
              : ""
          }

          ${
            v.codeSnippet
              ? `<div class="snippet-container">
                  <button class="copy-btn" onclick="navigator.clipboard.writeText(\`${escapeHtml(v.codeSnippet).replace(/`/g, "\\`")}\`)" title="Copy Code Snippet">
                    Copy Code
                  </button>
                  <pre class="snippet-code"><code>${escapeHtml(v.codeSnippet)}</code></pre>
                </div>`
              : ""
          }
        </div>`
              )
              .join("")
      }
    </div>

    <!-- Footer -->
    <footer>
      Generated by <a href="https://react-native-library-docs.netlify.app/tscheck" target="_blank"><strong>@masumdev/tscheck</strong></a> v${escapeHtml(report.version || "0.1.0")} — TypeScript AST Engine & Policy Inspector
    </footer>
  </div>

  <script>
    // Theme Toggle
    const themeBtn = document.getElementById('theme-btn');
    const htmlEl = document.documentElement;
    themeBtn.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      htmlEl.setAttribute('data-theme', next);
      localStorage.setItem('tscheck-theme', next);
    });

    // Search and Filter Logic
    const searchInput = document.getElementById('search-input');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const cards = document.querySelectorAll('.violation-card');
    let currentFilter = 'all';

    function updateVisibility() {
      const query = (searchInput.value || '').trim().toLowerCase();
      let visibleCount = 0;

      cards.forEach(card => {
        const type = card.getAttribute('data-type');
        const text = card.getAttribute('data-text');

        const matchesTab = currentFilter === 'all' || type === currentFilter;
        const matchesQuery = !query || text.includes(query);

        if (matchesTab && matchesQuery) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', updateVisibility);
    }

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        updateVisibility();
      });
    });
  </script>
</body>
</html>`;
}
