import React from "react";
import * as path from "node:path";
import { Box, Text } from "ink";
import { MARKFORGE_VERSION } from "../version.js";
import type { MarkforgeTheme } from "../config/types.js";

export interface HeaderProps {
  inputFile?: string;
  theme?: MarkforgeTheme;
  targetFormats?: string[];
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

export const Header: React.FC<HeaderProps> = ({
  inputFile,
  theme = "corporate",
  targetFormats = ["docx", "pdf"],
}) => {
  const themeLabel =
    typeof theme === "object" ? "Custom (ThemeProps)" : String(theme || "corporate");

  return (
    <Box flexDirection="column" marginY={1}>
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
              MARKFORGE
            </Text>
            <Text color="gray"> | Document Publishing Engine</Text>
          </Box>
          <Box>
            <Text color="black" backgroundColor="cyan" bold>
              {" "}v{MARKFORGE_VERSION}{" "}
            </Text>
          </Box>
        </Box>

        {/* Source & Configuration Info */}
        <Box flexDirection="column" marginTop={1}>
          {inputFile && (
            <Box>
              <Text color="gray">Source:  </Text>
              <Text color="white" bold>
                {formatDisplayPath(inputFile)}
              </Text>
            </Box>
          )}

          <Box justifyContent="space-between" marginTop={0}>
            <Box>
              <Text color="gray">Theme:   </Text>
              <Text color="magenta" bold>
                {themeLabel}
              </Text>
            </Box>
            {targetFormats && targetFormats.length > 0 && (
              <Box>
                <Text color="gray">Targets: </Text>
                <Text color="yellow" bold>
                  {targetFormats.map((f) => f.toUpperCase()).join(", ")}
                </Text>
              </Box>
            )}
          </Box>
        </Box>

        {/* Author & GitHub Footer in Header Box */}
        <Box marginTop={1} justifyContent="space-between">
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
