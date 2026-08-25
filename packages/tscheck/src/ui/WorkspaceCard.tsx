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
  const hasViolations =
    workspace.deprecatedCount > 0 ||
    workspace.unusedCount > 0 ||
    workspace.anyCount > 0;

  let badgeColor = "green";
  let badgeText = symbols.badges.ok;

  if (status === "scanning") {
    badgeColor = "blue";
    badgeText = symbols.badges.scan;
  } else if (hasViolations) {
    badgeColor = "yellow";
    badgeText = symbols.badges.warn;
  }

  return (
    <Box flexDirection="column" marginY={0}>
      <Box justifyContent="space-between" width={70}>
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
                <Text color="yellow">
                  {" "}
                  (D:{workspace.deprecatedCount} U:{workspace.unusedCount} A:
                  {workspace.anyCount})
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
