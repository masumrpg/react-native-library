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

        <Card glass padded>
          <Box gap="xs">
            <Text variant="title" color="primary">Glassmorphism Card (Sequoia Style)</Text>
            <Text variant="bodySmall" color="textMuted">
              Frosted glass container with translucent background and soft highlight border.
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
      </Box>
    </Section>
  );
}
