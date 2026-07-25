import { Box, Card, Input, Text } from "@masumdev/rn-ui";
import { Section, type RnUiSectionContext } from "../shared";

export function InputSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { sampleInput, setSampleInput } = ctx;

  return (
    <Section title="Input">
      <Card>
        <Box gap="md">
          <Box gap="xs">
            <Text variant="label">Expo React Native</Text>
            <Input
              value={sampleInput}
              onChangeText={setSampleInput}
              placeholder="Expo React Native by Ma'sum"
            />
          </Box>

          <Box gap="xs">
            <Text variant="label">Highlight 2026</Text>
            <Input type="email" placeholder="expo-react-native@masum.dev" />
          </Box>

          <Box gap="xs">
            <Text variant="label" color="danger">
              Invalid state
            </Text>
            <Input
              invalid
              value="Expo React Native by Ma'sum, 2026"
              onChangeText={() => undefined}
            />
          </Box>
        </Box>
      </Card>
    </Section>
  );
}
