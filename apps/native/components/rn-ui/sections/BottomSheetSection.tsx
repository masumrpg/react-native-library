import {
  BottomSheetModal,
  BottomSheetView,
  Button,
  Card,
  Box,
  Text,
  type BottomSheetModalMethods,
} from "@masumdev/rn-ui";
import { ChevronRight, Check } from "lucide-react-native";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function BottomSheetSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { icon } = ctx;
  const bottomSheetModalRef = React.useRef<BottomSheetModalMethods>(null);

  const handleOpenSheet = () => {
    bottomSheetModalRef.current?.present();
  };

  const handleCloseSheet = () => {
    bottomSheetModalRef.current?.dismiss();
  };

  return (
    <Section title="Bottom Sheet">
      <Card outlined>
        <Box gap="md">
          <Text color="textMuted">
            Gorhom bottom sheet modal portal that opens screen-wide over the app with theme tokens, flat border styling, and themed backdrop.
          </Text>

          <Button
            variant="filled"
            tone="primary"
            leftIcon={icon(ChevronRight)}
            onPress={handleOpenSheet}
          >
            Open Themed Bottom Sheet
          </Button>

          <BottomSheetModal ref={bottomSheetModalRef} snapPoints={["45%"]}>
            <BottomSheetView style={{ padding: 24, gap: 16 }}>
              <Text variant="h3" weight="700">
                Gorhom Bottom Sheet Modal
              </Text>
              <Text variant="bodySmall" color="textMuted">
                This bottom sheet modal is presented via @gorhom/bottom-sheet portal across the entire screen from the bottom of the device.
              </Text>

              <Box row style={{ justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                <Button variant="outline" tone="secondary" onPress={handleCloseSheet}>
                  Close
                </Button>
                <Button variant="filled" tone="primary" leftIcon={icon(Check)} onPress={handleCloseSheet}>
                  Done
                </Button>
              </Box>
            </BottomSheetView>
          </BottomSheetModal>
        </Box>
      </Card>
    </Section>
  );
}
