import type React from "react";
import { useState } from "react";
import { Box, Text, useApp } from "ink";
import TextInputComponent from "ink-text-input";
import type { AuditReport } from "../config/types.js";

// Handle ESM/CJS interop for ink-text-input
const TextInput = (TextInputComponent as unknown as { default?: typeof TextInputComponent }).default || TextInputComponent;

export interface InteractiveExplorerProps {
  report: AuditReport;
  initialQuery?: string;
  onExit?: () => void;
}

export function handleInteractiveExplorerSubmit(query: string, exitFn: () => void): boolean {
  if (query === ":q" || query === "exit") {
    exitFn();
    return true;
  }
  return false;
}

export function InteractiveExplorer({
  report,
  initialQuery = "",
  onExit,
}: InteractiveExplorerProps): React.JSX.Element {
  const [query, setQuery] = useState(initialQuery);
  const { exit } = useApp();

  const lowerQuery = query.toLowerCase().trim();

  // Filter deprecated usages
  const filteredDeprecated = report.deprecatedUsages.filter(
    (item) =>
      item.symbol.toLowerCase().includes(lowerQuery) ||
      item.package.toLowerCase().includes(lowerQuery) ||
      item.file.toLowerCase().includes(lowerQuery) ||
      item.reason.toLowerCase().includes(lowerQuery)
  );

  // Filter unused items
  const filteredUnused = report.unusedItems.filter(
    (item) =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.package.toLowerCase().includes(lowerQuery) ||
      item.file.toLowerCase().includes(lowerQuery)
  );

  // Filter any type usages
  const filteredAny = report.anyUsages.filter(
    (item) =>
      item.context.toLowerCase().includes(lowerQuery) ||
      item.package.toLowerCase().includes(lowerQuery) ||
      item.file.toLowerCase().includes(lowerQuery)
  );

  const totalResults =
    filteredDeprecated.length + filteredUnused.length + filteredAny.length;

  const handleSubmit = () => {
    handleInteractiveExplorerSubmit(query, onExit || exit);
  };

  return (
    <Box flexDirection="column" marginTop={1} padding={1} borderStyle="round" borderColor="cyan">
      <Box justifyContent="space-between" marginBottom={1}>
        <Text bold color="cyan">
          [INTERACTIVE AUDIT EXPLORER]
        </Text>
        <Text color="gray">Press Ctrl+C to exit</Text>
      </Box>

      <Box flexDirection="row" marginBottom={1}>
        <Text bold color="yellow">
          Search Filter:{" "}
        </Text>
        <TextInput
          value={query}
          onChange={setQuery}
          placeholder="Type symbol, package, or rule..."
          onSubmit={handleSubmit}
        />
      </Box>

      <Box marginBottom={1}>
        <Text color="gray">
          Found <Text bold color="white">{totalResults}</Text> matching items across all workspaces
        </Text>
      </Box>

      {/* Deprecated Matches */}
      {filteredDeprecated.length > 0 && (
        <Box flexDirection="column" marginBottom={1}>
          <Text bold color="yellow">
            Deprecated Usages ({filteredDeprecated.length})
          </Text>
          {filteredDeprecated.slice(0, 5).map((item, idx) => (
            <Text key={idx} color="gray">
              {" "}● [{item.package}] <Text color="white">{item.symbol}</Text> in {item.file}:{item.line} ({item.reason})
            </Text>
          ))}
          {filteredDeprecated.length > 5 && (
            <Text color="dim">
              {" "}... and {filteredDeprecated.length - 5} more items
            </Text>
          )}
        </Box>
      )}

      {/* Unused Matches */}
      {filteredUnused.length > 0 && (
        <Box flexDirection="column" marginBottom={1}>
          <Text bold color="yellow">
            Unused Items ({filteredUnused.length})
          </Text>
          {filteredUnused.slice(0, 5).map((item, idx) => (
            <Text key={idx} color="gray">
              {" "}● [{item.package}] <Text color="white">{item.name}</Text> ({item.type}) in {item.file}:{item.line}
            </Text>
          ))}
          {filteredUnused.length > 5 && (
            <Text color="dim">
              {" "}... and {filteredUnused.length - 5} more items
            </Text>
          )}
        </Box>
      )}

      {/* Any Matches */}
      {filteredAny.length > 0 && (
        <Box flexDirection="column">
          <Text bold color="yellow">
            Explicit Any Usages ({filteredAny.length})
          </Text>
          {filteredAny.slice(0, 5).map((item, idx) => (
            <Text key={idx} color="gray">
              {" "}● [{item.package}] {item.context} in {item.file}:{item.line}
            </Text>
          ))}
          {filteredAny.length > 5 && (
            <Text color="dim">
              {" "}... and {filteredAny.length - 5} more items
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
}
