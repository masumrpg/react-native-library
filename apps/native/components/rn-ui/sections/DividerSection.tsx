import { Box, Card, Divider, Text } from "@masumdev/rn-ui";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function DividerSection({ ctx: _ctx }: { ctx: RnUiSectionContext }) {
  return (
    <Section title="Divider">
      <Card outlined>
        <Box gap="md">
          <Text variant="bodySmall" color="textMuted">
            Horizontal Divider
          </Text>
          <Text variant="title">Content Section A</Text>
          <Divider />
          <Text variant="title">Content Section B</Text>
          <Divider />
          <Text variant="bodySmall" color="textSubtle">
            Divider uses soft border tokens for clean sectioning.
          </Text>
        </Box>
      </Card>
    </Section>
  );
}
