import * as fs from "node:fs";
import * as path from "node:path";
import type { AuditReport, TsCheckConfig, SupportedEditor } from "../config/types.js";
import { generateAiPrompt } from "./aiPrompt.js";

/**
 * Emits GitHub Actions workflow commands (::warning and ::error annotations).
 */
export function emitGitHubAnnotations(
  report: AuditReport,
  failOnWarning: boolean = false
): void {
  const level = failOnWarning ? "error" : "warning";

  for (const item of report.deprecatedUsages) {
    const title = `Deprecated API: ${item.symbol}`;
    const message = item.reason
      ? `Usage of deprecated '${item.symbol}': ${item.reason.replace(/\n/g, " ")}`
      : `Usage of deprecated '${item.symbol}'`;
    console.log(
      `::${level} file=${item.file},line=${item.line},col=${item.column},title=${title}::${message}`
    );
  }

  for (const item of report.unusedItems) {
    const title = `Unused Diagnostic: ${item.name} (${item.type})`;
    console.log(
      `::${level} file=${item.file},line=${item.line},col=${item.column},title=${title}::${item.message.replace(
        /\n/g,
        " "
      )}`
    );
  }

  for (const item of report.anyUsages) {
    const title = `Explicit Any Type in ${item.context}`;
    const message = `Explicit 'any' type annotation found in ${item.context}. Replace with strict type or unknown.`;
    console.log(
      `::${level} file=${item.file},line=${item.line},col=${item.column},title=${title}::${message}`
    );
  }

  if (report.circularDependencies) {
    for (const item of report.circularDependencies) {
      const title = `Circular Dependency in ${item.package}`;
      const cycleStr = item.cycle.join(" -> ");
      const message = `Circular module dependency detected: ${cycleStr}`;
      console.log(
        `::error file=${item.file},line=${item.line},col=${item.column},title=${title}::${message}`
      );
    }
  }
}

/**
 * Writes audit reports to disk based on configuration options.
 */
export function writeAuditReports(
  report: AuditReport,
  config: TsCheckConfig
): { json?: string; markdown?: string; html?: string; ai?: string } {
  const rootDir = config.rootDir || process.cwd();
  const outputDir = path.isAbsolute(config.reporters?.outputDir || ".temp/tscheck")
    ? config.reporters!.outputDir!
    : path.resolve(rootDir, config.reporters?.outputDir || ".temp/tscheck");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const result: { json?: string; markdown?: string; html?: string; ai?: string } = {};

  const silent = config.format === "json" || config.format === "ai";

  // 1. JSON Report
  if (config.reporters?.json !== false) {
    const jsonFileName = config.reporters?.jsonFileName || "audit-report.json";
    const jsonPath = path.join(outputDir, jsonFileName);
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), "utf-8");
    result.json = path.relative(rootDir, jsonPath);
    if (!silent) console.log(`[REPORT] JSON report written to: ${result.json}`);
  }

  // 2. Markdown Report
  if (config.reporters?.markdown !== false) {
    const mdFileName = config.reporters?.markdownFileName || "audit-report.md";
    const mdPath = path.join(outputDir, mdFileName);
    const mdContent = generateMarkdownReport(report, rootDir);
    fs.writeFileSync(mdPath, mdContent, "utf-8");
    result.markdown = path.relative(rootDir, mdPath);
    if (!silent) console.log(`[REPORT] Markdown report written to: ${result.markdown}`);
  }

  // 3. AI Token-Efficient Prompt Report
  if (config.reporters?.ai !== false) {
    const aiFileName = config.reporters?.aiFileName || "audit-report.ai.md";
    const aiPath = path.join(outputDir, aiFileName);
    const aiContent = generateAiPrompt(report);
    fs.writeFileSync(aiPath, aiContent, "utf-8");
    result.ai = path.relative(rootDir, aiPath);
    if (!silent) console.log(`[REPORT] AI remediation prompt written to: ${result.ai}`);
  }

  // 4. HTML Report
  if (config.reporters?.html !== false) {
    const htmlFileName = config.reporters?.htmlFileName || "audit-report.html";
    const htmlPath = path.join(outputDir, htmlFileName);
    const defaultEditor: SupportedEditor = (config.editor || config.reporters?.editor || "vscode") as SupportedEditor;
    const htmlContent = generateHtmlReport(report, rootDir, defaultEditor);
    fs.writeFileSync(htmlPath, htmlContent, "utf-8");
    result.html = path.relative(rootDir, htmlPath);
    if (!silent) console.log(`[REPORT] Interactive HTML report written to: ${result.html}`);
  }

  // 5. GitHub Annotations
  if (config.reporters?.githubAnnotations) {
    emitGitHubAnnotations(report, config.failOnWarning);
  }

  return result;
}

/**
 * Generates formatted Markdown report.
 */
function generateMarkdownReport(report: AuditReport, rootDir: string): string {
  const totalCirc = report.circularDependencies?.length || 0;
  const lines: string[] = [];

  lines.push("# TypeScript Code Audit Report");
  lines.push("");
  lines.push(`> Generated by **@masumdev/tscheck** v${report.version || "0.2.1"}`);
  lines.push(`> Timestamp: \`${report.timestamp}\` | Duration: \`${report.durationMs}ms\``);
  lines.push("");

  // 1. Summary Table
  lines.push("## Summary");
  lines.push("");
  lines.push("| Metric | Count | Threshold | Status |");
  lines.push("| :--- | :---: | :---: | :---: |");
  lines.push(`| Files Scanned | \`${report.summary.filesScanned}\` | - | - |`);
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

  // Circular Dependencies Section
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

  // Deprecated Usages Section
  if (report.deprecatedUsages.length > 0) {
    lines.push("## Deprecated API Usages");
    lines.push("");
    lines.push("| Symbol | Origin | Package | Location | Reason |");
    lines.push("| :--- | :--- | :--- | :--- | :--- |");
    for (const item of report.deprecatedUsages) {
      const relFile = path.relative(rootDir, item.file);
      const cleanReason = item.reason.replace(/\|/g, "\\|").replace(/\n/g, " ");
      const origin = item.origin ? `\`${item.origin}\`` : "`Local Code`";
      lines.push(
        `| \`${item.symbol}\` | ${origin} | \`${item.package}\` | \`${relFile}:${item.line}:${item.column}\` | ${cleanReason} |`
      );
    }
    lines.push("");
  }

  // Unused Items Section
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

  // Explicit Any Usages Section
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

function linkifyText(text: string): string {
  if (!text) return "";
  let escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  escaped = escaped.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="link-tag">$1 <svg class="inline-icon" viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>'
  );

  escaped = escaped.replace(
    /(^|[\s(])(https?:\/\/[^\s)]+)/g,
    '$1<a href="$2" target="_blank" rel="noopener noreferrer" class="link-tag">$2 <svg class="inline-icon" viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>'
  );

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
 * Generates clean, zero-emoji, responsive HTML audit report in the original sleek navy/cyan theme.
 */
function generateHtmlReport(
  report: AuditReport,
  rootDir: string,
  defaultEditor: SupportedEditor = "vscode"
): string {
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

  // Prepare structured violation records
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
    origin?: string;
    suggestedFix?: string;
    ignoreDirective: string;
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
        title: `Circular Cycle (${item.cycle.length} files)`,
        detail: `Circular module dependency: ${cycleStr}`,
        formattedDetail: `Dependency cycle detected: <span class="mono-chain">${escapeHtml(cycleStr)}</span>`,
        codeSnippet: item.codeSnippet,
        suggestedFix: item.suggestedFix || "Extract shared types or modules into a separate leaf file or use 'import type'",
        ignoreDirective: "// tscheck-ignore-next-line circular",
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
      origin: item.origin || "Local Code",
      suggestedFix: item.suggestedFix,
      ignoreDirective: "// tscheck-ignore-next-line deprecated",
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
      suggestedFix: item.suggestedFix || (item.type === "unused-import" ? `Remove unused import '${item.name}'` : `Prefix with underscore '_${item.name}' or remove`),
      ignoreDirective: "// tscheck-ignore-next-line unused",
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
      suggestedFix: item.suggestedFix || "Specify a concrete type interface or 'unknown' instead of 'any'",
      ignoreDirective: "// tscheck-ignore-next-line any",
    });
  }

  const aiPromptText = generateAiPrompt(report);

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
      --purple: #a855f7;
      --purple-bg: rgba(168, 85, 247, 0.1);
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
      --purple: #9333ea;
      --purple-bg: rgba(147, 51, 234, 0.08);
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
      flex-wrap: wrap;
      gap: 16px;
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
      gap: 10px;
      flex-wrap: wrap;
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

    /* Action Buttons in Header */
    .btn-action {
      background: var(--surface);
      border: 1px solid var(--surface-border);
      color: var(--text);
      padding: 6px 12px;
      border-radius: var(--radius-md);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
      font-family: inherit;
    }
    .btn-action:hover {
      background: var(--surface-hover);
      border-color: var(--primary);
      color: var(--text);
    }
    .btn-ai {
      background: var(--primary-bg);
      border-color: var(--primary);
      color: var(--primary-light);
    }
    .btn-ai:hover {
      background: var(--primary);
      color: #000;
    }

    /* Custom Theme-Aligned Dropdown */
    .custom-dropdown {
      position: relative;
      display: inline-block;
    }
    .dropdown-trigger {
      background: var(--surface);
      border: 1px solid var(--surface-border);
      color: var(--text);
      padding: 6px 12px;
      border-radius: var(--radius-md);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
      font-family: inherit;
      outline: none;
    }
    .dropdown-trigger:hover, .dropdown-trigger.open {
      background: var(--surface-hover);
      border-color: var(--primary);
      color: var(--text);
    }
    .dropdown-trigger .chevron-icon {
      color: var(--text-dim);
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .dropdown-trigger.open .chevron-icon {
      transform: rotate(180deg);
      color: var(--primary);
    }
    .dropdown-menu {
      position: absolute;
      top: calc(100% + 6px);
      right: 0;
      min-width: 190px;
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-md);
      box-shadow: 0 16px 36px -4px rgba(0, 0, 0, 0.7), 0 4px 12px rgba(0, 0, 0, 0.4);
      padding: 6px;
      display: none;
      flex-direction: column;
      gap: 2px;
      z-index: 100;
      backdrop-filter: blur(16px);
    }
    .dropdown-menu.show {
      display: flex;
      animation: dropdownFadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes dropdownFadeIn {
      from { opacity: 0; transform: translateY(-4px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .dropdown-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border-radius: var(--radius-sm);
      color: var(--text-muted);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
      user-select: none;
    }
    .dropdown-item:hover {
      background: var(--surface-hover);
      color: var(--text);
    }
    .dropdown-item.active {
      background: var(--primary-bg);
      color: var(--primary-light);
      font-weight: 600;
    }
    .dropdown-item .check-icon {
      display: none;
      color: var(--primary-light);
    }
    .dropdown-item.active .check-icon {
      display: block;
    }

    .theme-toggle {
      background: var(--surface);
      border: 1px solid var(--surface-border);
      color: var(--text-muted);
      cursor: pointer;
      width: 34px;
      height: 34px;
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
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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
    .metric-card.card-purple::before { background: var(--purple); }
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

    /* Explorer Controls Area */
    .explorer-header {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
    }
    .controls-top {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: space-between;
      align-items: center;
    }
    .search-box {
      flex: 1;
      min-width: 260px;
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

    .filter-tabs, .view-tabs {
      display: flex;
      gap: 6px;
      background: var(--surface);
      padding: 4px;
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-md);
      flex-wrap: wrap;
    }
    .tab-btn, .view-btn {
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
    .tab-btn.active, .view-btn.active {
      background: var(--primary);
      color: #000;
      font-weight: 700;
    }
    .tab-btn:hover:not(.active), .view-btn:hover:not(.active) {
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
    .tag-origin {
      background: var(--primary-bg);
      color: var(--primary-light);
      border: 1px solid rgba(6, 182, 212, 0.3);
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
      text-decoration: underline;
    }

    .card-actions {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .copy-btn {
      background: var(--surface);
      border: 1px solid var(--surface-border);
      color: var(--text-dim);
      border-radius: var(--radius-sm);
      padding: 4px 8px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: all 0.2s ease;
      font-family: inherit;
    }
    .copy-btn:hover {
      color: var(--text);
      border-color: var(--primary);
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
    .suggested-fix-box {
      font-size: 13px;
      color: var(--text);
      background: var(--success-bg);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-left: 3px solid var(--success);
      padding: 10px 14px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .suggested-fix-box strong {
      color: var(--success);
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

    /* Group Accordions */
    .group-container {
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-lg);
      overflow: hidden;
      margin-bottom: 14px;
      background: var(--surface);
    }
    .group-header {
      background: var(--surface-hover);
      padding: 12px 18px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--font-mono);
    }
    .group-body {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      border-top: 1px solid var(--surface-border);
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

    /* Footer & Author Card */
    footer {
      margin-top: 48px;
      border-top: 1px solid var(--surface-border);
      padding-top: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      color: var(--text-dim);
      font-size: 13px;
    }
    .author-card {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background: var(--surface);
      border: 1px solid var(--surface-border);
      padding: 10px 18px;
      border-radius: 9999px;
      box-shadow: var(--shadow);
    }
    .author-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid var(--primary);
    }
    .author-links {
      display: flex;
      gap: 10px;
    }
    .author-links a {
      color: var(--text-muted);
      text-decoration: none;
      font-weight: 500;
    }
    .author-links a:hover {
      color: var(--primary-light);
      text-decoration: underline;
    }

    /* Toast Notification */
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--surface);
      color: var(--text);
      border: 1px solid var(--primary);
      padding: 10px 16px;
      border-radius: var(--radius-md);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.2s ease;
      pointer-events: none;
      z-index: 1000;
    }
    .toast.show {
      opacity: 1;
      transform: translateY(0);
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

        <button id="copy-ai-btn" class="btn-action btn-ai" title="Copy AI-optimized remediation prompt">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM4 12a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm12 0a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z"></path>
            <rect x="6" y="6" width="12" height="12" rx="2"></rect>
          </svg>
          Copy for AI
        </button>

        <div class="custom-dropdown" id="editor-dropdown">
          <button type="button" class="dropdown-trigger" id="dropdown-trigger" aria-haspopup="listbox" aria-expanded="false" title="Choose editor deep-link target">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            <span id="selected-editor-label">VS Code</span>
            <svg class="chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="dropdown-menu" id="dropdown-menu" role="listbox">
            <div class="dropdown-item ${defaultEditor === 'vscode' ? 'active' : ''}" data-val="vscode" role="option">
              <span>VS Code</span>
              <svg class="check-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div class="dropdown-item ${defaultEditor === 'cursor' ? 'active' : ''}" data-val="cursor" role="option">
              <span>Cursor</span>
              <svg class="check-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div class="dropdown-item ${defaultEditor === 'antigravity' ? 'active' : ''}" data-val="antigravity" role="option">
              <span>Antigravity IDE</span>
              <svg class="check-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div class="dropdown-item ${defaultEditor === 'windsurf' ? 'active' : ''}" data-val="windsurf" role="option">
              <span>Windsurf</span>
              <svg class="check-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div class="dropdown-item ${defaultEditor === 'zed' ? 'active' : ''}" data-val="zed" role="option">
              <span>Zed</span>
              <svg class="check-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div class="dropdown-item ${defaultEditor === 'webstorm' ? 'active' : ''}" data-val="webstorm" role="option">
              <span>WebStorm</span>
              <svg class="check-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div class="dropdown-item ${defaultEditor === 'sublime' ? 'active' : ''}" data-val="sublime" role="option">
              <span>Sublime Text</span>
              <svg class="check-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div class="dropdown-item ${defaultEditor === 'vscode-insiders' ? 'active' : ''}" data-val="vscode-insiders" role="option">
              <span>VS Code Insiders</span>
              <svg class="check-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
          </div>
          <select id="editor-select" style="display: none;">
            <option value="vscode" ${defaultEditor === 'vscode' ? 'selected' : ''}>VS Code</option>
            <option value="cursor" ${defaultEditor === 'cursor' ? 'selected' : ''}>Cursor</option>
            <option value="antigravity" ${defaultEditor === 'antigravity' ? 'selected' : ''}>Antigravity IDE</option>
            <option value="windsurf" ${defaultEditor === 'windsurf' ? 'selected' : ''}>Windsurf</option>
            <option value="zed" ${defaultEditor === 'zed' ? 'selected' : ''}>Zed</option>
            <option value="webstorm" ${defaultEditor === 'webstorm' ? 'selected' : ''}>WebStorm</option>
            <option value="sublime" ${defaultEditor === 'sublime' ? 'selected' : ''}>Sublime Text</option>
            <option value="vscode-insiders" ${defaultEditor === 'vscode-insiders' ? 'selected' : ''}>VS Code Insiders</option>
          </select>
        </div>

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
        <span class="meta-value">${report.durationMs}ms</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Files Scanned</span>
        <span class="meta-value">${report.summary.filesScanned}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Clean Files</span>
        <span class="meta-value">${report.summary.cleanFilesCount || report.summary.filesScanned}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Workspaces</span>
        <span class="meta-value">${report.workspaces.length}</span>
      </div>
    </div>

    <!-- Metric Cards Grid -->
    <div class="metrics-grid">
      <div class="metric-card card-primary">
        <div class="metric-header">
          <span class="metric-title">Files Scanned</span>
          <span class="metric-count">${report.summary.filesScanned}</span>
        </div>
        <div class="metric-footer">Across ${report.workspaces.length} packages</div>
      </div>

      <div class="metric-card card-warning">
        <div class="metric-header">
          <span class="metric-title">Deprecated APIs</span>
          <span class="metric-count">${report.summary.totalDeprecatedUsages}</span>
        </div>
        <div class="metric-footer">${report.summary.totalDeprecatedUsages === 0 ? "0 allowed — Clean" : "Requires migration"}</div>
      </div>

      <div class="metric-card card-warning">
        <div class="metric-header">
          <span class="metric-title">Unused Diagnostics</span>
          <span class="metric-count">${report.summary.totalUnusedItems}</span>
        </div>
        <div class="metric-footer">${report.summary.totalUnusedItems === 0 ? "0 allowed — Clean" : "Variables & imports"}</div>
      </div>

      <div class="metric-card card-danger">
        <div class="metric-header">
          <span class="metric-title">Explicit Any Types</span>
          <span class="metric-count">${report.summary.totalAnyUsages}</span>
        </div>
        <div class="metric-footer">${report.summary.totalAnyUsages === 0 ? "0 allowed — Clean" : "Strict typing required"}</div>
      </div>

      <div class="metric-card card-purple">
        <div class="metric-header">
          <span class="metric-title">Circular Cycles</span>
          <span class="metric-count">${totalCirc}</span>
        </div>
        <div class="metric-footer">${totalCirc === 0 ? "0 allowed — Clean" : "Module dependency loops"}</div>
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
      <div class="controls-top">
        <div class="search-box">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="search-input" placeholder="Search by package, symbol, reason, or file path...">
        </div>

        <div class="view-tabs">
          <button class="view-btn active" data-view="flat">Flat List</button>
          <button class="view-btn" data-view="file">By File</button>
          <button class="view-btn" data-view="rule">By Rule</button>
          <button class="view-btn" data-view="package">By Package</button>
        </div>
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
        <div class="violation-card" data-type="${v.type}" data-pkg="${escapeHtml(v.package)}" data-file="${escapeHtml(v.relFile)}" data-text="${escapeHtml(
                  `${v.package} ${v.relFile} ${v.title} ${v.detail} ${v.origin || ''}`.toLowerCase()
                )}">
          <div class="violation-top">
            <div class="violation-meta">
              <span class="tag-${v.type}">${v.typeLabel}</span>
              <span class="tag-pkg">${escapeHtml(v.package)}</span>
              ${v.origin ? `<span class="tag-origin">${escapeHtml(v.origin)}</span>` : ''}
              <a href="#" class="file-link editor-link" data-abs="${escapeHtml(v.file)}" data-line="${v.line}" data-col="${v.column}" title="Click to open in Editor">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
                ${escapeHtml(v.relFile)}:${v.line}:${v.column}
              </a>
            </div>
            <div class="card-actions">
              <button class="copy-btn copy-ignore-btn" data-ignore="${escapeHtml(v.ignoreDirective)}" title="Copy Ignore Directive">
                Copy Ignore
              </button>
              <button class="copy-btn" onclick="navigator.clipboard.writeText('${escapeHtml(v.relFile)}:${v.line}:${v.column}')" title="Copy File Location">
                Copy Loc
              </button>
            </div>
          </div>

          <div class="violation-title">${escapeHtml(v.title)}</div>

          ${
            v.formattedDetail
              ? `<div class="violation-reason">${v.formattedDetail}</div>`
              : ""
          }

          ${
            v.suggestedFix
              ? `<div class="suggested-fix-box">
                  <strong>AI Suggested Fix:</strong>
                  <span>${escapeHtml(v.suggestedFix)}</span>
                </div>`
              : ""
          }

          ${
            v.codeSnippet
              ? `<div class="snippet-container">
                  <button class="copy-btn copy-code-btn" data-code="${escapeHtml(v.codeSnippet)}" style="position: absolute; top: 8px; right: 8px;" title="Copy Code Snippet">
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

    <!-- Footer with Author Profile Card -->
    <footer>
      <div class="author-card">
        <img class="author-avatar" src="https://github.com/masumrpg.png" alt="Ma'sum avatar" onerror="this.style.display='none'">
        <span>Created by <strong>Ma'sum</strong></span>
        <span style="color: var(--surface-border);">|</span>
        <div class="author-links">
          <a href="https://github.com/masumrpg" target="_blank" rel="noopener noreferrer">@masumrpg</a>
          <span>•</span>
          <a href="https://github.com/masumrpg/react-native-library" target="_blank" rel="noopener noreferrer">GitHub Repo</a>
          <span>•</span>
          <a href="https://react-native-library-docs.netlify.app" target="_blank" rel="noopener noreferrer">Docs Portal</a>
        </div>
      </div>
      <div>
        Generated by <a href="https://react-native-library-docs.netlify.app/tscheck" target="_blank" style="color: var(--primary); font-weight: 600;">@masumdev/tscheck</a> v${escapeHtml(report.version || "0.2.2")} — TypeScript AST Engine
      </div>
    </footer>
  </div>

  <!-- Toast Notification -->
  <div id="toast" class="toast">
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" style="color: var(--success);"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span id="toast-text">Copied to clipboard!</span>
  </div>

  <!-- Hidden AI Prompt Storage -->
  <textarea id="ai-prompt-content" style="display: none;">${escapeHtml(aiPromptText)}</textarea>

  <script>
    // Toast Notification
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    let toastTimer;
    function showToast(msg) {
      toastText.textContent = msg;
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
    }

    // Theme Toggle
    const themeBtn = document.getElementById('theme-btn');
    const htmlEl = document.documentElement;
    const savedTheme = localStorage.getItem('tscheck-theme') || 'dark';
    htmlEl.setAttribute('data-theme', savedTheme);

    themeBtn.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      htmlEl.setAttribute('data-theme', next);
      localStorage.setItem('tscheck-theme', next);
    });

    // Custom Editor Dropdown & Deep Linking Logic
    const editorDropdown = document.getElementById('editor-dropdown');
    const dropdownTrigger = document.getElementById('dropdown-trigger');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const selectedEditorLabel = document.getElementById('selected-editor-label');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const editorSelect = document.getElementById('editor-select');

    let currentEditor = localStorage.getItem('tscheck-editor') || (editorSelect ? editorSelect.value : 'vscode') || 'vscode';

    function buildEditorUrl(editor, absPath, line, col) {
      switch (editor) {
        case 'cursor':
          return 'cursor://file/' + absPath + ':' + line + ':' + col;
        case 'antigravity':
          return 'antigravity://file/' + absPath + ':' + line + ':' + col;
        case 'windsurf':
          return 'windsurf://file/' + absPath + ':' + line + ':' + col;
        case 'zed':
          return 'zed://file/' + absPath + ':' + line + ':' + col;
        case 'webstorm':
          return 'webstorm://open?file=' + encodeURIComponent(absPath) + '&line=' + line + '&column=' + col;
        case 'sublime':
          return 'subl://open?url=file://' + encodeURIComponent(absPath) + '&line=' + line + '&column=' + col;
        case 'vscode-insiders':
          return 'vscode-insiders://file/' + absPath + ':' + line + ':' + col;
        case 'vscode':
        default:
          return 'vscode://file/' + absPath + ':' + line + ':' + col;
      }
    }

    function updateEditorLinks() {
      localStorage.setItem('tscheck-editor', currentEditor);
      if (editorSelect) editorSelect.value = currentEditor;

      dropdownItems.forEach(item => {
        const val = item.getAttribute('data-val');
        if (val === currentEditor) {
          item.classList.add('active');
          if (selectedEditorLabel) {
            selectedEditorLabel.textContent = item.querySelector('span').textContent;
          }
        } else {
          item.classList.remove('active');
        }
      });

      document.querySelectorAll('.editor-link').forEach(el => {
        const abs = el.getAttribute('data-abs');
        const line = el.getAttribute('data-line');
        const col = el.getAttribute('data-col');
        if (abs && line) {
          el.setAttribute('href', buildEditorUrl(currentEditor, abs, line, col));
        }
      });
    }

    if (dropdownTrigger && dropdownMenu) {
      dropdownTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdownMenu.classList.contains('show');
        if (isOpen) {
          dropdownMenu.classList.remove('show');
          dropdownTrigger.classList.remove('open');
          dropdownTrigger.setAttribute('aria-expanded', 'false');
        } else {
          dropdownMenu.classList.add('show');
          dropdownTrigger.classList.add('open');
          dropdownTrigger.setAttribute('aria-expanded', 'true');
        }
      });

      dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const val = item.getAttribute('data-val');
          const text = item.querySelector('span').textContent;
          currentEditor = val;
          updateEditorLinks();
          dropdownMenu.classList.remove('show');
          dropdownTrigger.classList.remove('open');
          dropdownTrigger.setAttribute('aria-expanded', 'false');
          showToast('Editor scheme set to ' + text);
        });
      });

      document.addEventListener('click', (e) => {
        if (!editorDropdown.contains(e.target)) {
          dropdownMenu.classList.remove('show');
          dropdownTrigger.classList.remove('open');
          dropdownTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          dropdownMenu.classList.remove('show');
          dropdownTrigger.classList.remove('open');
          dropdownTrigger.setAttribute('aria-expanded', 'false');
        }
      });
    }

    if (editorSelect) {
      editorSelect.addEventListener('change', () => {
        currentEditor = editorSelect.value;
        updateEditorLinks();
      });
    }

    updateEditorLinks();

    // Copy for AI Button
    const copyAiBtn = document.getElementById('copy-ai-btn');
    const aiPromptContent = document.getElementById('ai-prompt-content');
    copyAiBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(aiPromptContent.value).then(() => {
        showToast('AI Remediation Prompt copied to clipboard!');
      });
    });

    // Copy Ignore Directive Buttons
    document.querySelectorAll('.copy-ignore-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const directive = btn.getAttribute('data-ignore');
        navigator.clipboard.writeText(directive).then(() => {
          showToast('Ignore directive copied!');
        });
      });
    });

    // Copy Code Buttons
    document.querySelectorAll('.copy-code-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.getAttribute('data-code');
        navigator.clipboard.writeText(code).then(() => {
          showToast('Code snippet copied!');
        });
      });
    });

    // Search, Filter and View Mode Switcher Logic
    const searchInput = document.getElementById('search-input');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const viewBtns = document.querySelectorAll('.view-btn');
    const container = document.getElementById('violations-container');
    const allCards = Array.from(document.querySelectorAll('.violation-card'));

    let currentFilter = 'all';
    let currentViewMode = 'flat';

    function renderViolations() {
      const query = (searchInput.value || '').trim().toLowerCase();

      const matchedCards = allCards.filter(card => {
        const type = card.getAttribute('data-type');
        const text = card.getAttribute('data-text');
        const matchesTab = currentFilter === 'all' || type === currentFilter;
        const matchesQuery = !query || text.includes(query);
        return matchesTab && matchesQuery;
      });

      container.innerHTML = '';

      if (matchedCards.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No matching issues found</h3><p>Try adjusting your search query or filter tab.</p></div>';
        return;
      }

      if (currentViewMode === 'flat') {
        matchedCards.forEach(c => container.appendChild(c));
      } else if (currentViewMode === 'file') {
        const fileMap = new Map();
        matchedCards.forEach(c => {
          const file = c.getAttribute('data-file');
          if (!fileMap.has(file)) fileMap.set(file, []);
          fileMap.get(file).push(c);
        });

        fileMap.forEach((cards, file) => {
          const group = document.createElement('div');
          group.className = 'group-container';
          const header = document.createElement('div');
          header.className = 'group-header';
          header.innerHTML = '<span>📄 ' + file + '</span><span class="badge-pill pill-warn">' + cards.length + ' issues</span>';

          const body = document.createElement('div');
          body.className = 'group-body';
          cards.forEach(c => body.appendChild(c));

          header.addEventListener('click', () => {
            body.style.display = body.style.display === 'none' ? 'flex' : 'none';
          });

          group.appendChild(header);
          group.appendChild(body);
          container.appendChild(group);
        });
      } else if (currentViewMode === 'rule') {
        const ruleMap = new Map();
        matchedCards.forEach(c => {
          const type = c.getAttribute('data-type');
          if (!ruleMap.has(type)) ruleMap.set(type, []);
          ruleMap.get(type).push(c);
        });

        ruleMap.forEach((cards, type) => {
          const group = document.createElement('div');
          group.className = 'group-container';
          const header = document.createElement('div');
          header.className = 'group-header';
          header.innerHTML = '<span>🏷️ ' + type.toUpperCase() + '</span><span class="badge-pill pill-warn">' + cards.length + ' issues</span>';

          const body = document.createElement('div');
          body.className = 'group-body';
          cards.forEach(c => body.appendChild(c));

          header.addEventListener('click', () => {
            body.style.display = body.style.display === 'none' ? 'flex' : 'none';
          });

          group.appendChild(header);
          group.appendChild(body);
          container.appendChild(group);
        });
      } else if (currentViewMode === 'package') {
        const pkgMap = new Map();
        matchedCards.forEach(c => {
          const pkg = c.getAttribute('data-pkg');
          if (!pkgMap.has(pkg)) pkgMap.set(pkg, []);
          pkgMap.get(pkg).push(c);
        });

        pkgMap.forEach((cards, pkg) => {
          const group = document.createElement('div');
          group.className = 'group-container';
          const header = document.createElement('div');
          header.className = 'group-header';
          header.innerHTML = '<span>📦 ' + pkg + '</span><span class="badge-pill pill-warn">' + cards.length + ' issues</span>';

          const body = document.createElement('div');
          body.className = 'group-body';
          cards.forEach(c => body.appendChild(c));

          header.addEventListener('click', () => {
            body.style.display = body.style.display === 'none' ? 'flex' : 'none';
          });

          group.appendChild(header);
          group.appendChild(body);
          container.appendChild(group);
        });
      }

      updateEditorLinks();
    }

    if (searchInput) {
      searchInput.addEventListener('input', renderViolations);
    }

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderViolations();
      });
    });

    viewBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        viewBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentViewMode = btn.getAttribute('data-view');
        renderViolations();
      });
    });
  </script>
</body>
</html>`;
}
