import { BottomSheet, Button, Card, Box, Text } from "@masumdev/rn-ui";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function SheetSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { openSheet, sheetRef } = ctx;

  return (
    <Section title="Sheet Modal">
      <Card outlined>
        <Box gap="md">
          <Text color="textMuted">
            Custom bottom sheet overlay modal with drag-to-close gestures.
          </Text>
          <Button variant="outline" tone="primary" onPress={openSheet}>
            Open Bottom Sheet
          </Button>

          <BottomSheet ref={sheetRef} snapPoints={["40%"]}>
            <Box p="md" gap="sm">
              <Text variant="title">Bottom Sheet Overlay</Text>
              <Text variant="bodySmall" color="textMuted">
                Drag down to dismiss or use interactive sheet controls.
              </Text>
            </Box>
          </BottomSheet>
        </Box>
      </Card>
    </Section>
  );
}
