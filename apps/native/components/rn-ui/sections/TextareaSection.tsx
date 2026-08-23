import { Textarea, Card, Box, Text } from "@masumdev/rn-ui";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function TextareaSection({ ctx: _ctx }: { ctx: RnUiSectionContext }) {
  return (
    <Section title="Textarea">
      <Card outlined>
        <Box gap="md">
          <Text variant="label">Multiline Feedback</Text>
          <Textarea placeholder="Type your multi-line notes or feedback here..." numberOfLines={4} />
          <Text variant="caption" color="textMuted">
            Theme-aware multiline input with auto-growing line height.
          </Text>
        </Box>
      </Card>
    </Section>
  );
}
