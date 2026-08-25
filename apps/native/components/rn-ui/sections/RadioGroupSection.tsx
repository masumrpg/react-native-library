import { RadioGroup, RadioGroupItem, Card, Box, Text, Divider } from "@masumdev/rn-ui";
import { useState } from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function RadioGroupSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { radioValue, setRadioValue } = ctx;
  const [plainValue, setPlainValue] = useState("standard");
  const [genderValue, setGenderValue] = useState("male");

  return (
    <Section title="RadioGroup">
      <Card outlined>
        <Box gap="lg">
          {/* 1. Card Variant (Default) */}
          <Box gap="sm">
            <Text variant="label">Card Variant (Vertical with Description)</Text>
            <Text variant="caption" color="textMuted">
              Interactive card containers with active borders and backgrounds.
            </Text>
            <RadioGroup variant="card" value={radioValue} onValueChange={setRadioValue}>
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

          <Divider />

          {/* 2. Plain Variant (Horizontal) */}
          <Box gap="sm">
            <Text variant="label">Plain Variant (Horizontal - No Container Box)</Text>
            <Text variant="caption" color="textMuted">
              Minimalist inline radio buttons without background or outer border.
            </Text>
            <RadioGroup
              variant="plain"
              orientation="horizontal"
              value={genderValue}
              onValueChange={setGenderValue}
              style={{ gap: 24 }}
            >
              <RadioGroupItem value="male" label="Male" />
              <RadioGroupItem value="female" label="Female" />
            </RadioGroup>
          </Box>

          <Divider />

          {/* 3. Plain Variant (Vertical) */}
          <Box gap="sm">
            <Text variant="label">Plain Variant (Vertical List)</Text>
            <RadioGroup
              variant="plain"
              value={plainValue}
              onValueChange={setPlainValue}
              style={{ gap: 8 }}
            >
              <RadioGroupItem
                value="standard"
                label="Standard Delivery"
                description="3-5 business days"
              />
              <RadioGroupItem
                value="express"
                label="Express Priority"
                description="Next day delivery by 12:00 PM"
              />
              <RadioGroupItem
                value="same-day"
                label="Same Day Courier"
                description="Delivered within 4 hours"
              />
            </RadioGroup>
          </Box>
        </Box>
      </Card>
    </Section>
  );
}
