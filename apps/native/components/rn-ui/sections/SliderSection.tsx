import { Slider, RangeSlider, Card, Box, Text, Badge } from "@masumdev/rn-ui";
import { useState } from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function SliderSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { sliderValue, setSliderValue } = ctx;
  const [priceRange, setPriceRange] = useState<[number, number]>([150, 850]);
  const [ageRange, setAgeRange] = useState<[number, number]>([21, 45]);

  return (
    <Section title="Slider & RangeSlider">
      <Box gap="lg">
        {/* 1. Single Slider */}
        <Card outlined>
          <Box gap="md">
            <Box row style={{ justifyContent: "space-between", alignItems: "center" }}>
              <Text variant="label">Single Value Slider</Text>
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

        {/* 2. Dual Thumb Range Slider */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                Dual-Thumb Price Filter
              </Text>
              <Badge tone="primary">
                {`$${priceRange[0]} - $${priceRange[1]}`}
              </Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Dual-thumb RangeSlider with direct gesture tracking and collision prevention.
            </Text>

            <RangeSlider
              min={0}
              max={1000}
              step={10}
              value={priceRange}
              onValueChange={setPriceRange}
              tone="primary"
            />
          </Box>
        </Card>

        {/* 3. Age Range Filter */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                Age Range Selector
              </Text>
              <Badge tone="accent">
                {`${ageRange[0]} - ${ageRange[1]} Yrs`}
              </Badge>
            </Box>

            <RangeSlider
              min={18}
              max={70}
              step={1}
              value={ageRange}
              onValueChange={setAgeRange}
              tone="accent"
            />
          </Box>
        </Card>
      </Box>
    </Section>
  );
}
