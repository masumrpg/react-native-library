import React from "react";
import { Box, Text } from "ink";
import type { CompilationResult } from "../config/types.js";

export interface SummaryTableProps {
  result: CompilationResult | null;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export const SummaryTable: React.FC<SummaryTableProps> = ({ result }) => {
  if (!result) return null;

  const hasErrors = result.errors.length > 0;

  return (
    <Box flexDirection="column" marginY={1}>
      <Box
        borderStyle="round"
        borderColor={hasErrors ? "red" : "green"}
        paddingX={2}
        paddingY={1}
        flexDirection="column"
      >
        <Box justifyContent="space-between">
          <Text bold color={hasErrors ? "red" : "green"}>
            {hasErrors ? "[COMPILATION ERRORS]" : "[COMPILATION SUCCESSFUL]"}
          </Text>
          <Text color="gray">{result.durationMs}ms</Text>
        </Box>

        <Box marginTop={1} flexDirection="column">
          <Text bold color="white">
            Output Documents ({result.files.length}):
          </Text>
          {result.files.map((f, i) => (
            <Box key={i} marginLeft={2} justifyContent="space-between">
              <Box>
                <Text color="cyan">[{f.format.toUpperCase()}] </Text>
                <Text color="gray">{f.filePath}</Text>
              </Box>
              <Text color="yellow"> {formatBytes(f.sizeBytes)}</Text>
            </Box>
          ))}
        </Box>

        {hasErrors && (
          <Box marginTop={1} flexDirection="column">
            <Text bold color="red">
              Errors:
            </Text>
            {result.errors.map((err, i) => (
              <Box key={i} marginLeft={2}>
                <Text color="red">- {err}</Text>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};
