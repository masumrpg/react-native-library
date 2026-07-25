import { Box, Card, Divider, Text } from "@masumdev/rn-ui";
import { Palette } from "lucide-react-native";
import { Section, type RnUiSectionContext } from "../shared";

export function BoxCardDividerSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { colors, styles } = ctx;

  return (
    <Section title="Box, Card, Divider">
      <Card padded={false} outlined>
        <Box p="lg" gap="md">
          <Box row center gap="md">
            <Box center bg="primarySoft" radius="lg" style={styles.sampleTile}>
              <Palette color={colors.primary} size={22} />
            </Box>
            <Box flex={1}>
              <Text variant="subtitle">Composable layout primitives</Text>
              <Text variant="bodySmall" color="textMuted">
                Box handles common spacing, color, radius, and row layout.
              </Text>
            </Box>
          </Box>

          <Divider />

          <Box row gap="sm">
            <Box flex={1} bg="backgroundMuted" radius="lg" p="md">
              <Text variant="label">Surface A</Text>
              <Text variant="caption" color="textMuted">
                muted bg
              </Text>
            </Box>
            <Box flex={1} bg="primarySoft" radius="lg" p="md">
              <Text variant="label" color="primary">
                Surface B
              </Text>
              <Text variant="caption" color="textMuted">
                primary soft
              </Text>
            </Box>
          </Box>
        </Box>
      </Card>
    </Section>
  );
}
