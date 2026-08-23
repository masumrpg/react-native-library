import { Progress, Card, Box, Text } from "@masumdev/rn-ui";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function ProgressSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { sliderValue } = ctx;

  return (
    <Section title="Progress Bar">
      <Card outlined>
        <Box gap="md">
          <Box row style={{ justifyContent: "space-between", alignItems: "center" }}>
            <Text variant="label">Uploading Progress</Text>
            <Text variant="labelSmall" color="primary">{sliderValue}%</Text>
          </Box>
          <Progress value={sliderValue} tone="primary" />

          <Box gap="xs" style={{ marginTop: 8 }}>
            <Text variant="caption" color="textMuted">Success Tone Progress</Text>
            <Progress value={85} tone="success" />
          </Box>

          <Box gap="xs" style={{ marginTop: 4 }}>
            <Text variant="caption" color="textMuted">Danger Tone Progress</Text>
            <Progress value={42} tone="danger" />
          </Box>
        </Box>
      </Card>
    </Section>
  );
}
