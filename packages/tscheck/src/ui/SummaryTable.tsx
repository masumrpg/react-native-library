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
    summary.totalAnyUsages === 0;

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
    Status:
      ws.deprecatedCount === 0 && ws.unusedCount === 0 && ws.anyCount === 0
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

      {/* 2. Audit Summary Box */}
      <Box
        borderStyle="single"
        borderColor={isAllClean ? "green" : "yellow"}
        flexDirection="column"
        paddingX={1}
      >
        <Box justifyContent="space-between" marginBottom={1}>
          <Text bold color="white">
            AUDIT SUMMARY
          </Text>
          <Text bold color={statusColor}>
            {statusBadge}
          </Text>
        </Box>

        <Box justifyContent="space-between">
          <Text color="gray">Workspaces Scanned</Text>
          <Text bold color="white">
            {summary.workspacesScanned}
          </Text>
        </Box>

        <Box justifyContent="space-between">
          <Text color="gray">Files Scanned</Text>
          <Text bold color="white">
            {summary.filesScanned} ({summary.cleanFilesCount} clean)
          </Text>
        </Box>

        <Box justifyContent="space-between">
          <Text color="gray">Scan Duration</Text>
          <Text color="white">{(report.durationMs / 1000).toFixed(2)}s</Text>
        </Box>

        <Box marginY={0}>
          <Text color="gray">
            {"─".repeat(50)}
          </Text>
        </Box>

        <Box justifyContent="space-between">
          <Text color="gray">Deprecated Usages</Text>
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
          <Text color="gray">Explicit Any Usages</Text>
          <Text
            bold
            color={summary.totalAnyUsages === 0 ? "green" : "yellow"}
          >
            {summary.totalAnyUsages}
          </Text>
        </Box>

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
          </>
        )}
      </Box>

      {/* 3. Violation Previews if any */}
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
          {report.deprecatedUsages.length > 3 && (
            <Text color="dim">
              {" "}
              ... and {report.deprecatedUsages.length - 3} more (see report)
            </Text>
          )}
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
              {symbols.bullet} {item.package}: {item.name} ({item.type}) - {item.file}:{item.line}
            </Text>
          ))}
          {report.unusedItems.length > 3 && (
            <Text color="dim">
              {" "}
              ... and {report.unusedItems.length - 3} more (see report)
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
};
