import { Slider, Card, Box, Text } from "@masumdev/rn-ui";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function SliderSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { sliderValue, setSliderValue } = ctx;

  return (
    <Section title="Slider">
      <Card outlined>
        <Box gap="md">
          <Box row style={{ justifyContent: "space-between", alignItems: "center" }}>
            <Text variant="label">Volume Level</Text>
            <Text variant="labelSmall" color="primary" style={{ fontWeight: "700" }}>
              {sliderValue}%
            </Text>
          </Box>
          <Slider
            value={sliderValue}
            tone="accent"
            onValueChange={setSliderValue}
            onSlidingComplete={setSliderValue}
          />
        </Box>
      </Card>
    </Section>
  );
}
