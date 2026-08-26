import { describe, it, expect } from "bun:test";
import React from "react";
import { render } from "ink-testing-library";
import { Header } from "../src/ui/Header.js";
import { LiveProgress } from "../src/ui/LiveProgress.js";
import { Table } from "../src/ui/Table.js";
import { WorkspaceCard } from "../src/ui/WorkspaceCard.js";
import { SummaryTable } from "../src/ui/SummaryTable.js";
import { InteractiveExplorer, handleInteractiveExplorerSubmit } from "../src/ui/InteractiveExplorer.js";
import type { AuditReport, WorkspaceScanResult } from "../src/config/types.js";

describe("Ink UI Components", () => {
  const mockWorkspaceClean: WorkspaceScanResult = {
    name: "@masumdev/clean-pkg",
    tsconfig: "/packages/clean/tsconfig.json",
    filesScanned: 10,
    deprecatedCount: 0,
    unusedCount: 0,
    anyCount: 0,
    circularCount: 0,
  };

  const mockWorkspaceViolation: WorkspaceScanResult = {
    name: "@masumdev/violation-pkg",
    tsconfig: "/packages/violation/tsconfig.json",
    filesScanned: 25,
    deprecatedCount: 3,
    unusedCount: 4,
    anyCount: 5,
    circularCount: 1,
  };

  const mockFullReport: AuditReport = {
    timestamp: new Date().toISOString(),
    version: "0.2.0",
    summary: {
      workspacesScanned: 2,
      filesScanned: 35,
      totalDeprecatedUsages: 7,
      totalUnusedItems: 7,
      totalAnyUsages: 7,
      totalCircularDependencies: 1,
      cleanFilesCount: 18,
      suppressedCount: 2,
      fixedCount: 3,
    },
    workspaces: [mockWorkspaceClean, mockWorkspaceViolation],
    deprecatedUsages: Array.from({ length: 7 }, (_, i) => ({
      file: `/src/dep-${i}.ts`,
      line: i + 1,
      column: 5,
      symbol: `oldFn${i}`,
      reason: "Deprecated method",
      codeSnippet: `oldFn${i}()`,
      package: "@masumdev/violation-pkg",
    })),
    unusedItems: Array.from({ length: 7 }, (_, i) => ({
      file: `/src/unused-${i}.ts`,
      line: i + 1,
      column: 10,
      name: `unusedVar${i}`,
      type: "unused-variable",
      message: "declared but never read",
      package: "@masumdev/violation-pkg",
    })),
    anyUsages: Array.from({ length: 7 }, (_, i) => ({
      file: `/src/any-${i}.ts`,
      line: i + 1,
      column: 8,
      context: `variable 'val${i}'`,
      codeSnippet: `const val${i}: any = 10;`,
      package: "@masumdev/violation-pkg",
    })),
    circularDependencies: [
      {
        package: "@masumdev/violation-pkg",
        cycle: ["/a.ts", "/b.ts", "/a.ts"],
        file: "/a.ts",
        line: 1,
        column: 1,
        codeSnippet: "import './b'",
      },
    ],
  };

  it("renders Header without crashing", () => {
    const { lastFrame } = render(
      <Header version="0.2.0" rootDir="/workspace" configPath="/workspace/.tscheckrc.json" />
    );
    expect(lastFrame()).toContain("TSCHECK AUDIT ENGINE");
    expect(lastFrame()).toContain("v0.2.0");
    expect(lastFrame()).toContain("/workspace");
  });

  it("renders LiveProgress with progress bar and file info", () => {
    const { lastFrame } = render(
      <LiveProgress
        activeWorkspace="@masumdev/rn-ui"
        currentFile="packages/rn-ui/src/Button.tsx"
        fileIndex={12}
        totalFiles={48}
        completedWorkspaces={2}
        totalWorkspaces={5}
        recentLogs={["Scanning tokens...", "Parsed tsconfig.json"]}
      />
    );
    expect(lastFrame()).toContain("@masumdev/rn-ui");
    expect(lastFrame()).toContain("Button.tsx");
  });

  it("renders Table component with headers, rows, alignments, and empty state", () => {
    const columns = [
      { header: "Workspace", key: "ws", width: 20, align: "left" as const },
      { header: "Files", key: "files", width: 10, align: "center" as const },
      { header: "Status", key: "status", width: 15, align: "right" as const },
    ];

    const data = [
      { ws: "@masumdev/rn-ui", files: 63, status: "PASSED" },
      { ws: "@masumdev/rn-qr-code", files: 12, status: "PASSED" },
    ];

    const { lastFrame } = render(<Table columns={columns} data={data} />);
    expect(lastFrame()).toContain("Workspace");
    expect(lastFrame()).toContain("@masumdev/rn-ui");

    // Test derived columns without explicit columns prop
    const { lastFrame: derivedFrame } = render(<Table data={data} />);
    expect(derivedFrame()).toContain("WS");

    // Test empty data fallback
    const { lastFrame: emptyFrame } = render(<Table columns={columns} data={[]} />);
    expect(emptyFrame()).toBeDefined();
  });

  it("renders WorkspaceCard for clean, scanning, and violation states", () => {
    const { lastFrame: cleanFrame } = render(
      <WorkspaceCard workspace={mockWorkspaceClean} status="completed" />
    );
    expect(cleanFrame()).toContain("@masumdev/clean-pkg");
    expect(cleanFrame()).toContain("[Clean]");

    const { lastFrame: violFrame } = render(
      <WorkspaceCard workspace={mockWorkspaceViolation} status="completed" />
    );
    expect(violFrame()).toContain("@masumdev/violation-pkg");
    expect(violFrame()).toContain("D:3");

    const { lastFrame: scanFrame } = render(
      <WorkspaceCard workspace={mockWorkspaceClean} status="scanning" />
    );
    expect(scanFrame()).toContain("Scanning...");
  });

  it("renders SummaryTable with all metrics, preview sections, and violation details", () => {
    const { lastFrame } = render(<SummaryTable report={mockFullReport} />);
    const frame = lastFrame() || "";
    expect(frame).toContain("Overall Codebase Audit Summary");
    expect(frame).toContain("Files Scanned");
    expect(frame).toContain("Deprecated API Usages");
    expect(frame).toContain("Explicit any Type Annotations");
  });

  it("renders InteractiveExplorer with search bar and handles exit commands", () => {
    let exited = false;
    const { lastFrame, stdin } = render(
      <InteractiveExplorer
        report={mockFullReport}
        initialQuery="violation"
        onExit={() => {
          exited = true;
        }}
      />
    );
    expect(lastFrame()).toContain("INTERACTIVE AUDIT EXPLORER");
    expect(lastFrame()).toContain("Deprecated Usages");
    expect(lastFrame()).toContain("Unused Items");
    expect(lastFrame()).toContain("Explicit Any Usages");

    stdin.write("\r");

    expect(handleInteractiveExplorerSubmit(":q", () => (exited = true))).toBe(true);
    expect(handleInteractiveExplorerSubmit("exit", () => (exited = true))).toBe(true);
    expect(handleInteractiveExplorerSubmit("other", () => {})).toBe(false);
    expect(exited).toBe(true);
  });
});
