import { RadioGroup, RadioGroupItem, Card, Box, Text } from "@masumdev/rn-ui";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function RadioGroupSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { radioValue, setRadioValue } = ctx;

  return (
    <Section title="RadioGroup">
      <Card outlined>
        <Box gap="md">
          <Text variant="label">Select Framework Preference</Text>
          <RadioGroup value={radioValue} onValueChange={setRadioValue}>
            <RadioGroupItem
              value="option1"
              label="Expo React Native SDK 57"
              description="Recommended default for mobile applications."
            />
            <RadioGroupItem
              value="option2"
              label="Bare React Native CLI"
              description="Custom native modules build pipeline."
            />
            <RadioGroupItem
              value="option3"
              label="Web Platform (Astro / Next)"
              description="Web documentation and SSR."
            />
          </RadioGroup>
        </Box>
      </Card>
    </Section>
  );
}
