import { Sheet, Button, Card, Box, Text } from "@masumdev/rn-ui";
import { SlidersHorizontal, Check } from "lucide-react-native";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function SheetSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { icon } = ctx;
  const [sheetVisible, setSheetVisible] = React.useState(false);
  const [glassSheetVisible, setGlassSheetVisible] = React.useState(false);

  return (
    <Section title="Sheet Modal">
      <Card outlined>
        <Box gap="md">
          <Text color="textMuted">
            Custom bottom sheet overlay modal with drag handle, animated slide-up entry, backdrop dismiss, glassmorphism, and haptics.
          </Text>

          <Box row gap="sm" style={{ flexWrap: "wrap" }}>
            <Button
              variant="filled"
              tone="primary"
              leftIcon={icon(SlidersHorizontal)}
              onPress={() => setSheetVisible(true)}
            >
              Open Bottom Sheet
            </Button>

            <Button
              variant="outline"
              tone="accent"
              onPress={() => setGlassSheetVisible(true)}
            >
              Open Glass Sheet
            </Button>
          </Box>

          {/* 1. Default Sheet Modal */}
          <Sheet
            visible={sheetVisible}
            onClose={() => setSheetVisible(false)}
            title="Filter Preferences"
            description="Customize your feed preferences and content discovery settings."
          >
            <Box gap="md">
              <Text variant="bodySmall" color="textMuted">
                Select your preferred view mode and content sorting order. Changes apply automatically to your current session.
              </Text>

              <Box row style={{ justifyContent: "flex-end", gap: 8 }}>
                <Button
                  variant="outline"
                  tone="secondary"
                  onPress={() => setSheetVisible(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="filled"
                  tone="primary"
                  leftIcon={icon(Check)}
                  onPress={() => setSheetVisible(false)}
                >
                  Apply Filters
                </Button>
              </Box>
            </Box>
          </Sheet>

          {/* 2. Glassmorphism Sheet Modal */}
          <Sheet
            glass
            visible={glassSheetVisible}
            onClose={() => setGlassSheetVisible(false)}
            title="Glassmorphism Sheet"
            description="Translucent backdrop blur styling with smooth spring motion."
          >
            <Box gap="md">
              <Text variant="bodySmall" color="textMuted">
                This bottom sheet uses glassmorphism tokens matching dark & light themes.
              </Text>
              <Button
                variant="filled"
                tone="accent"
                onPress={() => setGlassSheetVisible(false)}
              >
                Got It
              </Button>
            </Box>
          </Sheet>
        </Box>
      </Card>
    </Section>
  );
}
