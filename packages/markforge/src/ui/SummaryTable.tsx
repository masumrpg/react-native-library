import React from "react";
import * as path from "node:path";
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

function formatDisplayPath(p?: string): string {
  if (!p) return "";
  try {
    const rel = path.relative(process.cwd(), p);
    return rel && !rel.startsWith("..") && rel.length < p.length ? `./${rel}` : p;
  } catch {
    return p;
  }
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
        {/* Status header */}
        <Box justifyContent="space-between" alignItems="center">
          <Box>
            <Text bold color={hasErrors ? "red" : "green"}>
              {hasErrors ? "[COMPILATION FAILED]" : "[COMPILATION SUCCESSFUL]"}
            </Text>
          </Box>
          <Box>
            <Text color="gray">Duration: </Text>
            <Text color="yellow" bold>
              {result.durationMs}ms
            </Text>
          </Box>
        </Box>

        {/* Output Documents List */}
        {result.files.length > 0 && (
          <Box marginTop={1} flexDirection="column">
            <Text bold color="white">
              Generated Documents ({result.files.length}):
            </Text>
            {result.files.map((f, i) => {
              const formatColor =
                f.format === "docx"
                  ? "blue"
                  : f.format === "pdf"
                  ? "red"
                  : f.format === "html"
                  ? "yellow"
                  : f.format === "png"
                  ? "magenta"
                  : "green";
              const paddedBadge = `[${f.format.toUpperCase()}]`.padEnd(7, " ");

              return (
                <Box key={i} marginTop={0} flexDirection="column" marginLeft={1}>
                  <Box justifyContent="space-between" alignItems="center">
                    <Box>
                      <Text color={formatColor} bold>
                        {paddedBadge}
                      </Text>
                      <Text color="white" bold>
                        {f.fileName}
                      </Text>
                    </Box>
                    <Text color="cyan" bold>
                      {formatBytes(f.sizeBytes)}
                    </Text>
                  </Box>
                  <Box marginLeft={2}>
                    <Text color="gray">
                      └─ {formatDisplayPath(f.filePath)}
                    </Text>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}

        {/* Errors list */}
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

        {/* Bottom credits */}
        <Box marginTop={1} justifyContent="space-between" alignItems="center">
          <Box>
            <Text color="gray">Author: </Text>
            <Text color="cyan" bold>
              Ma'sum
            </Text>
            <Text color="gray"> (@masumrpg)</Text>
          </Box>
          <Box>
            <Text color="gray">GitHub: </Text>
            <Text color="blue" underline>
              https://github.com/masumrpg
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
