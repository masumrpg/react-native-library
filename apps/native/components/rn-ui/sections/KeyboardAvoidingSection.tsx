import { Box, Card, Input, KeyboardAvoiding, Text } from "@masumdev/rn-ui";
import { Smartphone } from "lucide-react-native";
import { Section, type RnUiSectionContext } from "../shared";

export function KeyboardAvoidingSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { colors, styles } = ctx;

  return (
    <Section title="Keyboard Avoiding">
      <Card>
        <KeyboardAvoiding
          fullHeight={false}
          scroll
          bg="surface"
          gap="md"
          scrollViewProps={{ scrollEnabled: false }}
        >
          <Box row center gap="md">
            <Box center bg="primarySoft" radius="lg" style={styles.sampleTile}>
              <Smartphone color={colors.primary} size={22} />
            </Box>
            <Box flex={1}>
              <Text variant="title">Expo React Native</Text>
              <Text variant="bodySmall" color="textMuted">
                Keyboard avoiding by Ma'sum for 2026 form screens.
              </Text>
            </Box>
          </Box>

          <Input
            placeholder="Expo React Native by Ma'sum"
            returnKeyType="done"
          />
        </KeyboardAvoiding>
      </Card>
    </Section>
  );
}
