import {
  Box,
  Card,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Text,
} from "@masumdev/rn-ui";
import { Section, type RnUiSectionContext } from "../shared";

export function HoverCardSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { styles } = ctx;

  return (
    <Section title="Hover Card">
      <Card>
        <Box gap="md">
          <Text color="textMuted">
            Long-press preview for Expo React Native by Ma'sum in 2026.
          </Text>

          <HoverCard openDelay={10} closeDelay={100}>
            <HoverCardTrigger style={styles.hoverCardTrigger}>
              <Text variant="label" color="primary">
                Expo React Native
              </Text>
            </HoverCardTrigger>
            <HoverCardContent>
              <Box gap="xs">
                <Text variant="label">Expo React Native</Text>
                <Text variant="bodySmall" color="textMuted">
                  Expo React Native by Ma'sum.
                </Text>
                <Text variant="caption" color="textSubtle">
                  Highlight 2026
                </Text>
              </Box>
            </HoverCardContent>
          </HoverCard>
        </Box>
      </Card>
    </Section>
  );
}
