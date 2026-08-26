import type React from "react";
import { Box, Text } from "ink";
import { Table } from "./Table.js";
import type { AuditReport } from "../config/types.js";
import { symbols } from "./theme.js";

interface SummaryTableProps {
  report: AuditReport;
  failOnWarning?: boolean;
}

export const SummaryTable: React.FC<SummaryTableProps> = ({
  report,
  failOnWarning,
}) => {
  const { summary } = report;
  const isAllClean =
    summary.totalDeprecatedUsages === 0 &&
    summary.totalUnusedItems === 0 &&
    summary.totalAnyUsages === 0 &&
    (summary.totalCircularDependencies || 0) === 0;

  const statusBadge = isAllClean
    ? symbols.badges.pass
    : failOnWarning
      ? symbols.badges.fail
      : symbols.badges.warn;

  const statusColor = isAllClean ? "green" : failOnWarning ? "red" : "yellow";

  // Prepare table data for ink-table
  const workspaceTableData = report.workspaces.map((ws) => ({
    Workspace: ws.name,
    Files: String(ws.filesScanned),
    Deprecated: ws.deprecatedCount === 0 ? "0" : `[WARN] ${ws.deprecatedCount}`,
    Unused: ws.unusedCount === 0 ? "0" : `[WARN] ${ws.unusedCount}`,
    Any: ws.anyCount === 0 ? "0" : `[WARN] ${ws.anyCount}`,
    Circular: (ws.circularCount || 0) === 0 ? "0" : `[FAIL] ${ws.circularCount}`,
    Status:
      ws.deprecatedCount === 0 &&
      ws.unusedCount === 0 &&
      ws.anyCount === 0 &&
      (ws.circularCount || 0) === 0
        ? "[PASSED]"
        : "[WARN]",
  }));

  return (
    <Box flexDirection="column" marginTop={1}>
      {/* 1. Workspaces Table rendered via ink-table */}
      {workspaceTableData.length > 0 && (
        <Box flexDirection="column" marginBottom={1}>
          <Text bold color="cyan">
            [WORKSPACES BREAKDOWN]
          </Text>
          <Table data={workspaceTableData} />
        </Box>
      )}

      {/* 2. Overall Summary Box */}
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor={statusColor}
        paddingX={2}
        paddingY={1}
      >
        <Box justifyContent="space-between" marginBottom={1}>
          <Text bold>Overall Codebase Audit Summary</Text>
          <Text color={statusColor} bold>
            {statusBadge}
          </Text>
        </Box>

        <Box marginY={0}>
          <Text color="gray">
            {"─".repeat(50)}
          </Text>
        </Box>

        <Box justifyContent="space-between">
          <Text color="gray">Workspaces Scanned</Text>
          <Text bold>{summary.workspacesScanned}</Text>
        </Box>

        <Box justifyContent="space-between">
          <Text color="gray">Files Scanned</Text>
          <Text bold>
            {summary.filesScanned} ({summary.cleanFilesCount} Clean)
          </Text>
        </Box>

        <Box justifyContent="space-between">
          <Text color="gray">Deprecated API Usages</Text>
          <Text
            bold
            color={summary.totalDeprecatedUsages === 0 ? "green" : "yellow"}
          >
            {summary.totalDeprecatedUsages}
          </Text>
        </Box>

        <Box justifyContent="space-between">
          <Text color="gray">Unused Variables / Imports</Text>
          <Text
            bold
            color={summary.totalUnusedItems === 0 ? "green" : "yellow"}
          >
            {summary.totalUnusedItems}
          </Text>
        </Box>

        <Box justifyContent="space-between">
          <Text color="gray">Explicit any Type Annotations</Text>
          <Text
            bold
            color={summary.totalAnyUsages === 0 ? "green" : "red"}
          >
            {summary.totalAnyUsages}
          </Text>
        </Box>

        <Box justifyContent="space-between">
          <Text color="gray">Circular Dependency Cycles</Text>
          <Text
            bold
            color={(summary.totalCircularDependencies || 0) === 0 ? "green" : "red"}
          >
            {summary.totalCircularDependencies || 0}
          </Text>
        </Box>

        {summary.suppressedCount > 0 && (
          <Box justifyContent="space-between">
            <Text color="gray">Suppressed via Comments</Text>
            <Text bold color="cyan">
              {summary.suppressedCount}
            </Text>
          </Box>
        )}

        {summary.fixedCount > 0 && (
          <Box justifyContent="space-between">
            <Text color="gray">Auto-Fixed Violations</Text>
            <Text bold color="green">
              {summary.fixedCount}
            </Text>
          </Box>
        )}

        {report.reportFiles && (
          <>
            <Box marginY={0}>
              <Text color="gray">
                {"─".repeat(50)}
              </Text>
            </Box>
            {report.reportFiles.json && (
              <Box justifyContent="space-between">
                <Text color="dim">JSON Report</Text>
                <Text color="cyan">{report.reportFiles.json}</Text>
              </Box>
            )}
            {report.reportFiles.markdown && (
              <Box justifyContent="space-between">
                <Text color="dim">Markdown Report</Text>
                <Text color="cyan">{report.reportFiles.markdown}</Text>
              </Box>
            )}
            {report.reportFiles.html && (
              <Box justifyContent="space-between">
                <Text color="dim">HTML Report</Text>
                <Text color="cyan">{report.reportFiles.html}</Text>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* 3. Violation Previews if any */}
      {(summary.totalCircularDependencies || 0) > 0 && (
        <Box flexDirection="column" marginTop={1}>
          <Text bold color="red">
            [CIRCULAR DEPENDENCY PREVIEW]
          </Text>
          {report.circularDependencies.slice(0, 3).map((item, idx) => (
            <Text key={idx} color="gray">
              {" "}
              {symbols.bullet} {item.package}: {item.cycle.map((p) => p.split("/").pop()).join(" ➔ ")}
            </Text>
          ))}
        </Box>
      )}

      {summary.totalDeprecatedUsages > 0 && (
        <Box flexDirection="column" marginTop={1}>
          <Text bold color="yellow">
            [DEPRECATED USAGES PREVIEW]
          </Text>
          {report.deprecatedUsages.slice(0, 3).map((item, idx) => (
            <Text key={idx} color="gray">
              {" "}
              {symbols.bullet} {item.package}: {item.symbol} ({item.reason})
            </Text>
          ))}
        </Box>
      )}

      {summary.totalUnusedItems > 0 && (
        <Box flexDirection="column" marginTop={1}>
          <Text bold color="yellow">
            [UNUSED ITEMS PREVIEW]
          </Text>
          {report.unusedItems.slice(0, 3).map((item, idx) => (
            <Text key={idx} color="gray">
              {" "}
              {symbols.bullet} {item.package}: {item.name} ({item.type})
            </Text>
          ))}
        </Box>
      )}

      {summary.totalAnyUsages > 0 && (
        <Box flexDirection="column" marginTop={1}>
          <Text bold color="red">
            [EXPLICIT ANY PREVIEW]
          </Text>
          {report.anyUsages.slice(0, 3).map((item, idx) => (
            <Text key={idx} color="gray">
              {" "}
              {symbols.bullet} {item.package}: {item.context}
            </Text>
          ))}
        </Box>
      )}
    </Box>
  );
};
