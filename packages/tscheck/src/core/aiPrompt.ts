import type { AuditReport } from "../config/types.js";

/**
 * Generates a dense, token-efficient AI prompt and action plan for LLMs (Claude, GPT, Gemini, Antigravity)
 * to automatically remediate TypeScript audit violations with zero token waste.
 */
export function generateAiPrompt(report: AuditReport): string {
  const lines: string[] = [];

  lines.push("# TSCheck AI Code Remediation Instructions");
  lines.push("");
  lines.push("> **Task**: Remediate the TypeScript code audit issues listed below. Follow strict type safety, zero `any` tolerance, and preserve existing runtime behavior.");
  lines.push("");
  lines.push(`**Audit Summary**: ${report.summary.filesScanned} files scanned, ${report.summary.totalDeprecatedUsages} deprecated, ${report.summary.totalUnusedItems} unused, ${report.summary.totalAnyUsages} explicit any, ${report.summary.totalCircularDependencies} circular dependencies.`);
  lines.push("");

  // Group all issues by file
  const fileIssuesMap = new Map<
    string,
    {
      deprecated: typeof report.deprecatedUsages;
      unused: typeof report.unusedItems;
      any: typeof report.anyUsages;
      circular: typeof report.circularDependencies;
    }
  >();

  for (const item of report.deprecatedUsages) {
    if (!fileIssuesMap.has(item.file)) {
      fileIssuesMap.set(item.file, { deprecated: [], unused: [], any: [], circular: [] });
    }
    fileIssuesMap.get(item.file)!.deprecated.push(item);
  }

  for (const item of report.unusedItems) {
    if (!fileIssuesMap.has(item.file)) {
      fileIssuesMap.set(item.file, { deprecated: [], unused: [], any: [], circular: [] });
    }
    fileIssuesMap.get(item.file)!.unused.push(item);
  }

  for (const item of report.anyUsages) {
    if (!fileIssuesMap.has(item.file)) {
      fileIssuesMap.set(item.file, { deprecated: [], unused: [], any: [], circular: [] });
    }
    fileIssuesMap.get(item.file)!.any.push(item);
  }

  for (const item of report.circularDependencies) {
    if (!fileIssuesMap.has(item.file)) {
      fileIssuesMap.set(item.file, { deprecated: [], unused: [], any: [], circular: [] });
    }
    fileIssuesMap.get(item.file)!.circular.push(item);
  }

  if (fileIssuesMap.size === 0) {
    lines.push("🎉 All files are 100% clean! No violations discovered.");
    return lines.join("\n");
  }

  lines.push("## Actionable Issues by File");
  lines.push("");

  for (const [filePath, issues] of fileIssuesMap.entries()) {
    lines.push(`### File: \`${filePath}\``);
    lines.push("");

    // Deprecated
    for (const d of issues.deprecated) {
      lines.push(`- **[DEPRECATED]** Line ${d.line}:${d.column}`);
      lines.push(`  - Symbol: \`${d.symbol}\`${d.origin ? ` (${d.origin})` : ""}`);
      lines.push(`  - Notice: ${d.reason}`);
      if (d.suggestedFix) {
        lines.push(`  - Suggested Fix: **${d.suggestedFix}**`);
      }
      lines.push(`  - Snippet: \`${d.codeSnippet}\``);
      lines.push(`  - Ignore Directive: \`// tscheck-ignore-next-line deprecated\``);
      lines.push("");
    }

    // Unused
    for (const u of issues.unused) {
      lines.push(`- **[UNUSED]** Line ${u.line}:${u.column}`);
      lines.push(`  - Identifier: \`${u.name}\` (${u.type})`);
      lines.push(`  - Message: ${u.message}`);
      if (u.suggestedFix) {
        lines.push(`  - Suggested Fix: **${u.suggestedFix}**`);
      }
      lines.push(`  - Ignore Directive: \`// tscheck-ignore-next-line unused\``);
      lines.push("");
    }

    // Any Usages
    for (const a of issues.any) {
      lines.push(`- **[EXPLICIT ANY]** Line ${a.line}:${a.column}`);
      lines.push(`  - Context: ${a.context}`);
      lines.push(`  - Snippet: \`${a.codeSnippet}\``);
      lines.push(`  - Suggested Fix: **Replace \`any\` with a specific interface, type parameter, or \`unknown\`**`);
      lines.push(`  - Ignore Directive: \`// tscheck-ignore-next-line any\``);
      lines.push("");
    }

    // Circular
    for (const c of issues.circular) {
      lines.push(`- **[CIRCULAR]** Line ${c.line}:${c.column}`);
      lines.push(`  - Cycle: ${c.cycle.join(" -> ")}`);
      lines.push(`  - Snippet: \`${c.codeSnippet}\``);
      lines.push(`  - Suggested Fix: **Extract shared types into a leaf file or use \`import type\`**`);
      lines.push(`  - Ignore Directive: \`// tscheck-ignore-next-line circular\``);
      lines.push("");
    }
  }

  lines.push("---");
  lines.push("## Instructions for AI Agent:");
  lines.push("1. Edit each file directly to apply the recommended suggested fixes.");
  lines.push("2. For unused variables that are required by signatures/interfaces, prefix them with an underscore (e.g. `_name`).");
  lines.push("3. For `any` annotations, infer the strongest possible TypeScript type or interface.");
  lines.push("4. If a deprecation cannot be refactored immediately due to legacy constraints, add the exact ignore comment directly above the offending line.");
  lines.push("");

  return lines.join("\n");
}
