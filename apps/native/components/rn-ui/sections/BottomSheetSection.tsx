import { Box, Button, Card, Text } from "@masumdev/rn-ui";
import { ChevronRight } from "lucide-react-native";
import { Section, type RnUiSectionContext } from "../shared";

export function BottomSheetSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { icon, bottomSheetRef } = ctx;

  return (
    <Section title="Bottom Sheet">
      <Card>
        <Box gap="md">
          <Text color="textMuted">
            Gorhom bottom sheet wrapper that follows rn-ui theme tokens,
            dark/light mode, flat border styling, and themed backdrop.
          </Text>
          <Button
            leftIcon={icon(ChevronRight)}
            onPress={() => bottomSheetRef.current?.snapToIndex(0)}
          >
            Open Themed Bottom Sheet
          </Button>
        </Box>
      </Card>
    </Section>
  );
}
