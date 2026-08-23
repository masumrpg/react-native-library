import { Popover, PopoverTrigger, PopoverContent, Button, Card, Box, Text } from "@masumdev/rn-ui";
import { Check } from "lucide-react-native";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function PopoverSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { icon } = ctx;
  const [open, setOpen] = React.useState(false);

  return (
    <Section title="Popover">
      <Card outlined>
        <Box gap="md">
          <Text color="textMuted">
            Anchored popover menu card attached to trigger position.
          </Text>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
              <Button variant="filled" tone="primary">
                Toggle Popover
              </Button>
            </PopoverTrigger>

            <PopoverContent width={320}>
              <Box gap="sm">
                <Box row style={{ justifyContent: "space-between", alignItems: "center" }}>
                  <Text variant="h3" weight="700">Quick Actions</Text>
                  <Button
                    variant="ghost"
                    tone="secondary"
                    size="xs"
                    onPress={() => setOpen(false)}
                  >
                    ✕
                  </Button>
                </Box>

                <Text variant="bodySmall" color="textMuted">
                  This popover card provides quick contextual actions and informative overlays with animated entry.
                </Text>

                <Box row style={{ justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                  <Button
                    variant="outline"
                    tone="secondary"
                    size="sm"
                    onPress={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="filled"
                    tone="primary"
                    size="sm"
                    leftIcon={icon(Check)}
                    onPress={() => setOpen(false)}
                  >
                    Confirm
                  </Button>
                </Box>
              </Box>
            </PopoverContent>
          </Popover>
        </Box>
      </Card>
    </Section>
  );
}
