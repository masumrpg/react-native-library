import React from "react";
import { Box, Text } from "ink";
import { MARKFORGE_VERSION } from "../version.js";

import type { MarkforgeTheme } from "../config/types.js";

export interface HeaderProps {
  inputFile?: string;
  theme?: MarkforgeTheme;
}

export const Header: React.FC<HeaderProps> = ({ inputFile, theme = "corporate" }) => {
  const themeLabel = typeof theme === "object" ? "custom (ThemeProps)" : String(theme || "corporate");

  return (
    <Box flexDirection="column" marginY={1}>
      <Box
        borderStyle="round"
        borderColor="cyan"
        paddingX={2}
        paddingY={0}
        flexDirection="column"
      >
        <Box justifyContent="space-between">
          <Text bold color="cyan">
            MARKFORGE DOCUMENT ENGINE
          </Text>
          <Text color="gray">v{MARKFORGE_VERSION}</Text>
        </Box>
        {inputFile && (
          <Box marginTop={1}>
            <Text color="gray">Source: </Text>
            <Text color="white" bold>
              {inputFile}
            </Text>
          </Box>
        )}
        <Box>
          <Text color="gray">Theme:  </Text>
          <Text color="blue">{themeLabel}</Text>
        </Box>
      </Box>
    </Box>
  );
};
