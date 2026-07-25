import { Box, Card, Text } from "@masumdev/rn-ui";
import { Section, type RnUiSectionContext } from "../shared";

export function TextSection({ ctx: _ctx }: { ctx: RnUiSectionContext }) {
  return (
    <Section title="Text">
      <Card>
        <Box gap="sm">
          <Text variant="display">Display</Text>
          <Text variant="h1">Heading One</Text>
          <Text variant="h2">Heading Two</Text>
          <Text variant="h3">Heading Three</Text>
          <Text variant="title">Title text</Text>
          <Text variant="subtitle">Subtitle text</Text>
          <Text variant="body">Body text for normal content.</Text>
          <Text variant="bodySmall" color="textMuted">
            Small body text for secondary information.
          </Text>
          <Text variant="caption" color="textSubtle">
            Caption text for compact metadata.
          </Text>
        </Box>
      </Card>
    </Section>
  );
}
