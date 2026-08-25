import { describe, it, expect } from "bun:test";
import { render } from "ink-testing-library";
import { Header } from "../src/ui/Header.js";
import { LiveProgress } from "../src/ui/LiveProgress.js";
import { SummaryTable } from "../src/ui/SummaryTable.js";
import type { AuditReport } from "../src/config/types.js";

describe("Ink UI Components", () => {
  it("renders Header without crashing", () => {
    const { lastFrame } = render(
      <Header
        version="0.1.0"
        rootDir="/test/dir"
        configPath="/test/dir/tscheck.config.json"
      />
    );
    expect(lastFrame()).toContain("TSCHECK AUDIT ENGINE");
    expect(lastFrame()).toContain("v0.1.0");
  });

  it("renders LiveProgress with progress bar and file info", () => {
    const { lastFrame } = render(
      <LiveProgress
        activeWorkspace="@masumdev/rn-ui"
        currentFile="src/Button.tsx"
        fileIndex={10}
        totalFiles={20}
        completedWorkspaces={1}
        totalWorkspaces={3}
        recentLogs={["Loading TypeScript program..."]}
      />
    );
    expect(lastFrame()).toContain("[SCANNING]");
    expect(lastFrame()).toContain("@masumdev/rn-ui");
    expect(lastFrame()).toContain("50%");
  });

  it("renders SummaryTable with status badge", () => {
    const mockReport: AuditReport = {
      timestamp: new Date().toISOString(),
      durationMs: 1200,
      summary: {
        totalDeprecatedUsages: 0,
        totalUnusedItems: 0,
        totalAnyUsages: 0,
        filesScanned: 50,
        cleanFilesCount: 50,
        workspacesScanned: 2,
      },
      deprecatedUsages: [],
      unusedItems: [],
      anyUsages: [],
      workspaces: [
        {
          name: "@masumdev/rn-ui",
          tsconfig: "/test/tsconfig.json",
          filesScanned: 50,
          deprecatedCount: 0,
          unusedCount: 0,
          anyCount: 0,
        },
      ],
    };

    const { lastFrame } = render(<SummaryTable report={mockReport} />);
    expect(lastFrame()).toContain("AUDIT SUMMARY");
    expect(lastFrame()).toContain("[PASSED]");
    expect(lastFrame()).toContain("Workspaces Scanned");
  });
});
