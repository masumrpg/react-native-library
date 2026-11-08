import type React from "react";
import * as path from "node:path";
import { Box, Text } from "ink";
import type { TsCheckConfig } from "../config/types.js";

export interface HeaderProps {
  version: string;
  rootDir: string;
  configPath: string | null;
  config?: TsCheckConfig;
}

function formatDisplayPath(p?: string | null): string {
  if (!p) return "";
  try {
    const rel = path.relative(process.cwd(), p);
    return rel && !rel.startsWith("..") && rel.length < p.length ? `./${rel}` : p;
  } catch {
    return p;
  }
}

export const Header: React.FC<HeaderProps> = ({
  version,
  rootDir,
  configPath,
  config,
}) => {
  // Collect active audit rules
  const activeRules: string[] = [];
  if (config?.rules?.deprecated !== false) activeRules.push("Deprecated");
  if (config?.rules?.unused !== false) activeRules.push("Unused");
  if (config?.rules?.noExplicitAny !== false) activeRules.push("Explicit Any");
  if (config?.rules?.circular !== false) activeRules.push("Circular");

  // Determine scan mode
  let scanMode = "Full";
  if (config?.staged) {
    scanMode = "Staged (Git)";
  } else if (config?.since) {
    scanMode = `Since (${config.since})`;
  }

  // Collect enabled report types
  const activeReports: string[] = [];
  if (config?.reporters?.json !== false) activeReports.push("JSON");
  if (config?.reporters?.markdown !== false) activeReports.push("Markdown");
  if (config?.reporters?.html !== false) activeReports.push("HTML");
  if (config?.reporters?.ai !== false) activeReports.push("AI Prompt");

  const displayTarget = formatDisplayPath(rootDir) || "./ (current)";
  const displayConfig = configPath ? formatDisplayPath(configPath) : "(default auto-discovery)";

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box
        borderStyle="round"
        borderColor="cyan"
        paddingX={2}
        paddingY={1}
        flexDirection="column"
      >
        {/* Top Header Row */}
        <Box justifyContent="space-between" alignItems="center">
          <Box>
            <Text bold color="cyan">
              TSCHECK
            </Text>
            <Text color="gray"> | TypeScript Code Audit Engine</Text>
          </Box>
          <Box>
            <Text color="black" backgroundColor="cyan" bold>
              {" "}v{version}{" "}
            </Text>
          </Box>
        </Box>

        {/* Target & Mode */}
        <Box marginTop={1} justifyContent="space-between">
          <Box>
            <Text color="gray">Target: </Text>
            <Text color="white" bold>
              {displayTarget}
            </Text>
          </Box>
          <Box>
            <Text color="gray">Mode: </Text>
            <Text color="cyan">{scanMode}</Text>
          </Box>
        </Box>

        {/* Config & Workspaces */}
        <Box justifyContent="space-between">
          <Box>
            <Text color="gray">Config: </Text>
            <Text color="dim">{displayConfig}</Text>
          </Box>
          {config?.workspaces && config.workspaces.length > 0 && (
            <Box>
              <Text color="gray">Scope: </Text>
              <Text color="dim">{config.workspaces.join(", ")}</Text>
            </Box>
          )}
        </Box>

        {/* Active Rules Badge */}
        {activeRules.length > 0 && (
          <Box marginTop={1}>
            <Text color="gray">Rules:  </Text>
            <Text color="green">{activeRules.join(" | ")}</Text>
          </Box>
        )}

        {/* Active Reports Badge */}
        {activeReports.length > 0 && (
          <Box>
            <Text color="gray">Reports:</Text>
            <Text color="magenta"> {activeReports.join(" | ")}</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};
