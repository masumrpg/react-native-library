import type React from "react";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";

interface LiveProgressProps {
  activeWorkspace: string | null;
  currentFile: string | null;
  fileIndex: number;
  totalFiles: number;
  completedWorkspaces: number;
  totalWorkspaces: number;
  recentLogs: string[];
}

function renderProgressBar(current: number, total: number, barWidth = 24): string {
  if (total <= 0) return `[${" ".repeat(barWidth)}] 0%`;
  const percentage = Math.min(100, Math.round((current / total) * 100));
  const filled = Math.round((percentage / 100) * barWidth);
  const empty = barWidth - filled;
  const bar = "=".repeat(Math.max(0, filled - 1)) + (filled > 0 ? ">" : "") + " ".repeat(empty);
  return `[${bar}] ${percentage}%`;
}

export const LiveProgress: React.FC<LiveProgressProps> = ({
  activeWorkspace,
  currentFile,
  fileIndex,
  totalFiles,
  completedWorkspaces,
  totalWorkspaces,
  recentLogs,
}) => {
  return (
    <Box flexDirection="column" marginTop={1} marginBottom={1}>
      <Box flexDirection="row" alignItems="center">
        <Text color="cyan">
          <Spinner type="dots" />
        </Text>
        <Text bold color="cyan">
          {" "}
          [SCANNING]
        </Text>
        {activeWorkspace && (
          <Text color="white">
            {" "}
            Workspace: <Text bold color="yellow">{activeWorkspace}</Text>
          </Text>
        )}
      </Box>

      {totalFiles > 0 && (
        <Box flexDirection="row" marginTop={1}>
          <Text color="gray">  Progress: </Text>
          <Text color="green">{renderProgressBar(fileIndex, totalFiles)}</Text>
          <Text color="gray">
            {" "}
            ({fileIndex}/{totalFiles} files)
          </Text>
        </Box>
      )}

      {currentFile && (
        <Box flexDirection="row">
          <Text color="gray">  File:     </Text>
          <Text color="blue">{currentFile}</Text>
        </Box>
      )}

      <Box flexDirection="row">
        <Text color="gray">  Workspaces: </Text>
        <Text color="cyan">
          {completedWorkspaces}/{totalWorkspaces} completed
        </Text>
      </Box>

      {recentLogs.length > 0 && (
        <Box flexDirection="column" marginTop={1} paddingLeft={2}>
          <Text color="gray" dimColor>
            --- Activity Log ---
          </Text>
          {recentLogs.slice(-2).map((log, index) => (
            <Text key={index} color="gray" dimColor>
              {`> ${log}`}
            </Text>
          ))}
        </Box>
      )}
    </Box>
  );
};
