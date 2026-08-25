import type React from "react";
import { Box, Text } from "ink";

interface HeaderProps {
  version: string;
  rootDir: string;
  configPath: string | null;
}

export const Header: React.FC<HeaderProps> = ({ version, rootDir, configPath }) => {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box
        borderStyle="round"
        borderColor="cyan"
        paddingX={1}
        flexDirection="column"
      >
        <Box justifyContent="space-between">
          <Text bold color="cyan">
            TSCHECK AUDIT ENGINE
          </Text>
          <Text color="gray">v{version}</Text>
        </Box>
        <Box marginTop={0}>
          <Text color="gray">Target: </Text>
          <Text color="white">{rootDir}</Text>
        </Box>
        {configPath && (
          <Box>
            <Text color="gray">Config: </Text>
            <Text color="dim">{configPath}</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};
