import { Switch, Card, Box, Text } from "@masumdev/rn-ui";
import { Check } from "lucide-react-native";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function SwitchSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { switchValue, setSwitchValue } = ctx;

  return (
    <Section title="Switch">
      <Card outlined>
        <Box gap="md">
          <Box row style={{ alignItems: "center", justifyContent: "space-between" }}>
            <Box flex={1}>
              <Text variant="label">Enable Notifications</Text>
              <Text variant="bodySmall" color="textMuted">
                Default primary toggle switch.
              </Text>
            </Box>
            <Switch value={switchValue} onValueChange={setSwitchValue} />
          </Box>

          <Box row style={{ alignItems: "center", justifyContent: "space-between" }}>
            <Box flex={1}>
              <Text variant="label">Success Custom Icon</Text>
              <Text variant="bodySmall" color="textMuted">
                Large switch with active thumb icon.
              </Text>
            </Box>
            <Switch
              value={switchValue}
              onValueChange={setSwitchValue}
              size="lg"
              tone="success"
              activeThumbContent={({ color, size }) => (
                <Check color={color} size={size} />
              )}
            />
          </Box>

          <Box row style={{ alignItems: "center", justifyContent: "space-between" }}>
            <Box flex={1}>
              <Text variant="label">Invalid Validation State</Text>
              <Text variant="bodySmall" color="textMuted">
                Danger tone with invalid border highlight.
              </Text>
            </Box>
            <Switch value={false} invalid tone="danger" />
          </Box>
        </Box>
      </Card>
    </Section>
  );
}
