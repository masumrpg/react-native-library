import { Box, Card, Text } from "@masumdev/rn-ui";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function CardSection({ ctx: _ctx }: { ctx: RnUiSectionContext }) {
  return (
    <Section title="Card">
      <Box gap="md">
        <Card outlined padded>
          <Box gap="xs">
            <Text variant="title">Outlined Card</Text>
            <Text variant="bodySmall" color="textMuted">
              Default card with flat border and padded content.
            </Text>
          </Box>
        </Card>

        <Card elevated padded>
          <Box gap="xs">
            <Text variant="title">Elevated Card</Text>
            <Text variant="bodySmall" color="textMuted">
              Card with subtle elevation shadow tokens.
            </Text>
          </Box>
        </Card>

        <Card outlined={false} padded style={{ backgroundColor: "rgba(6, 182, 212, 0.08)" }}>
          <Box gap="xs">
            <Text variant="title" color="primary">Border-less Tinted Card</Text>
            <Text variant="bodySmall" color="textMuted">
              Flat card without outline, using custom background tint.
            </Text>
          </Box>
        </Card>
      </Box>
    </Section>
  );
}
