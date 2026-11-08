import type React from "react";
import { Box, Text } from "ink";
import type { WorkspaceScanResult } from "../config/types.js";
import { symbols } from "./theme.js";

interface WorkspaceCardProps {
  workspace: WorkspaceScanResult;
  status: "scanning" | "completed";
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
  workspace,
  status,
}) => {
  const circularCount = workspace.circularCount || 0;
  const hasViolations =
    workspace.deprecatedCount > 0 ||
    workspace.unusedCount > 0 ||
    workspace.anyCount > 0 ||
    circularCount > 0;

  let badgeColor = "green";
  let badgeText = symbols.badges.ok;

  if (status === "scanning") {
    badgeColor = "blue";
    badgeText = symbols.badges.scan;
  } else if (circularCount > 0) {
    badgeColor = "red";
    badgeText = symbols.badges.fail;
  } else if (hasViolations) {
    badgeColor = "yellow";
    badgeText = symbols.badges.warn;
  }

  return (
    <Box flexDirection="column" marginY={0}>
      <Box justifyContent="space-between">
        <Box>
          <Text color={badgeColor} bold>
            {badgeText}{" "}
          </Text>
          <Text bold color="white">
            {workspace.name}
          </Text>
        </Box>
        <Box>
          {status === "completed" && (
            <Text color="gray">
              {workspace.filesScanned} files
              {hasViolations ? (
                <Text color={circularCount > 0 ? "red" : "yellow"}>
                  {" "}
                  (D:{workspace.deprecatedCount} U:{workspace.unusedCount} A:
                  {workspace.anyCount}
                  {circularCount > 0 ? ` C:${circularCount}` : ""})
                </Text>
              ) : (
                <Text color="green"> [Clean]</Text>
              )}
            </Text>
          )}
          {status === "scanning" && (
            <Text color="blue" dimColor>
              Scanning...
            </Text>
          )}
        </Box>
      </Box>
    </Box>
  );
};
