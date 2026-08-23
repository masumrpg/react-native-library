import { Select, Card, Box, Text } from "@masumdev/rn-ui";
import { Check, ChevronsUpDown } from "lucide-react-native";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function SelectSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { icon, selectValue, setSelectValue } = ctx;

  return (
    <Section title="Select">
      <Card outlined>
        <Box gap="md">
          <Text variant="label">Framework Selector</Text>
          <Select
            value={selectValue}
            onValueChange={setSelectValue}
            title="Choose Framework"
            placeholder="Select framework"
            options={[
              {
                value: "react-native",
                label: "React Native CLI",
                description: "Bare React Native runtime.",
              },
              {
                value: "expo",
                label: "Expo SDK 57",
                description: "Recommended mobile framework.",
              },
              {
                value: "masum",
                label: "@masumdev/rn-ui",
                description: "Theme-ready UI component kit.",
              },
            ]}
            checkIcon={icon(Check)}
            chevronIcon={icon(ChevronsUpDown)}
          />
          <Text variant="caption" color="textMuted">
            Selected Value: {selectValue}
          </Text>
        </Box>
      </Card>
    </Section>
  );
}
