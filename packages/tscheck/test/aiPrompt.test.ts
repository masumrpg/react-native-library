import { describe, it, expect } from "bun:test";
import { generateAiPrompt } from "../src/core/aiPrompt.js";
import type { AuditReport } from "../src/config/types.js";

describe("aiPrompt", () => {
  it("generates a clean prompt when no violations are found", () => {
    const cleanReport: AuditReport = {
      timestamp: new Date().toISOString(),
      durationMs: 120,
      summary: {
        totalDeprecatedUsages: 0,
        totalUnusedItems: 0,
        totalAnyUsages: 0,
        totalCircularDependencies: 0,
        suppressedCount: 0,
        fixedCount: 0,
        filesScanned: 10,
        cleanFilesCount: 10,
        workspacesScanned: 1,
      },
      deprecatedUsages: [],
      unusedItems: [],
      anyUsages: [],
      circularDependencies: [],
      workspaces: [],
    };

    const prompt = generateAiPrompt(cleanReport);
    expect(prompt).toContain("TSCheck AI Code Remediation Instructions");
    expect(prompt).toContain("All files are 100% clean!");
  });

  it("generates structured remediation instructions for all violation types", () => {
    const reportWithViolations: AuditReport = {
      timestamp: new Date().toISOString(),
      durationMs: 250,
      summary: {
        totalDeprecatedUsages: 1,
        totalUnusedItems: 1,
        totalAnyUsages: 1,
        totalCircularDependencies: 1,
        suppressedCount: 0,
        fixedCount: 0,
        filesScanned: 5,
        cleanFilesCount: 2,
        workspacesScanned: 1,
      },
      deprecatedUsages: [
        {
          file: "/workspace/src/auth.ts",
          line: 12,
          column: 5,
          symbol: "legacyLogin",
          reason: "Use modernLogin() instead",
          codeSnippet: "legacyLogin();",
          package: "web-app",
          origin: "Local Code",
          suggestedFix: "Use modernLogin() instead",
        },
      ],
      unusedItems: [
        {
          file: "/workspace/src/auth.ts",
          line: 20,
          column: 7,
          name: "token",
          type: "unused-variable",
          message: "'token' is declared but its value is never read.",
          package: "web-app",
          suggestedFix: "Prefix with underscore '_token' or remove",
        },
      ],
      anyUsages: [
        {
          file: "/workspace/src/auth.ts",
          line: 30,
          column: 15,
          context: "variable 'userData'",
          codeSnippet: "const userData: any = fetchUser();",
          package: "web-app",
          suggestedFix: "Specify a concrete type interface or 'unknown' instead of 'any'",
        },
      ],
      circularDependencies: [
        {
          file: "/workspace/src/auth.ts",
          line: 1,
          column: 1,
          package: "web-app",
          cycle: ["/workspace/src/auth.ts", "/workspace/src/session.ts", "/workspace/src/auth.ts"],
          codeSnippet: "import { session } from './session';",
          suggestedFix: "Extract shared types into a leaf file or use 'import type'",
        },
      ],
      workspaces: [],
    };

    const prompt = generateAiPrompt(reportWithViolations);
    expect(prompt).toContain("TSCheck AI Code Remediation Instructions");
    expect(prompt).toContain("### File: `/workspace/src/auth.ts`");
    expect(prompt).toContain("[DEPRECATED]");
    expect(prompt).toContain("Symbol: `legacyLogin` (Local Code)");
    expect(prompt).toContain("Suggested Fix: **Use modernLogin() instead**");
    expect(prompt).toContain("[UNUSED]");
    expect(prompt).toContain("Identifier: `token` (unused-variable)");
    expect(prompt).toContain("[EXPLICIT ANY]");
    expect(prompt).toContain("[CIRCULAR]");
    expect(prompt).toContain("Instructions for AI Agent");
  });
});
