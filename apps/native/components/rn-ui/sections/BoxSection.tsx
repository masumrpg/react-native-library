import { Box, Card, Text } from "@masumdev/rn-ui";
import { Palette } from "lucide-react-native";
import { Section, type RnUiSectionContext } from "../shared";

export function BoxSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { colors } = ctx;

  return (
    <Section title="Box">
      <Card outlined>
        <Box p="lg" gap="md">
          <Box row style={{ alignItems: "center", gap: 12 }}>
            <Box center bg="primarySoft" radius="lg" style={{ width: 44, height: 44 }}>
              <Palette color={colors.primary} size={22} />
            </Box>
            <Box flex={1}>
              <Text variant="subtitle">Box Layout Primitive</Text>
              <Text variant="bodySmall" color="textMuted">
                Box handles common spacing, flexbox alignment, background, and radius tokens.
              </Text>
            </Box>
          </Box>

          <Box row gap="sm">
            <Box flex={1} bg="backgroundMuted" radius="lg" p="md">
              <Text variant="label">Surface A</Text>
              <Text variant="caption" color="textMuted">
                bg="backgroundMuted"
              </Text>
            </Box>
            <Box flex={1} bg="primarySoft" radius="lg" p="md">
              <Text variant="label" color="primary">
                Surface B
              </Text>
              <Text variant="caption" color="textMuted">
                bg="primarySoft"
              </Text>
            </Box>
          </Box>
        </Box>
      </Card>
    </Section>
  );
}
