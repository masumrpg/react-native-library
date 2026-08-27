import React from "react";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";

export interface LiveProgressProps {
  status: string;
  isCompiling: boolean;
}

export const LiveProgress: React.FC<LiveProgressProps> = ({ status, isCompiling }) => {
  if (!isCompiling) return null;

  return (
    <Box marginY={1} alignItems="center">
      <Text color="cyan">
        <Spinner type="dots" />
      </Text>
      <Box marginLeft={1}>
        <Text color="yellow">[COMPILING] </Text>
        <Text color="white">{status}</Text>
      </Box>
    </Box>
  );
};
