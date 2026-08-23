import { Stepper, Card, Box, Text } from "@masumdev/rn-ui";
import { Minus, Plus } from "lucide-react-native";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function StepperSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { icon } = ctx;
  const [val, setVal] = React.useState(3);

  return (
    <Section title="Stepper">
      <Card outlined>
        <Box gap="lg">
          <Text color="textMuted">
            Numeric stepper control with 4px internal padding, concentric inner radii, glassmorphism, haptics, and custom icons.
          </Text>

          {/* 1. Left Label + Right Stepper Row (E-Commerce Cart Style) */}
          <Box gap="xs">
            <Text variant="labelSmall" color="textSubtle">
              Left Label + Right Stepper Row
            </Text>
            <Box
              row
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                padding: 12,
                borderRadius: 12,
              }}
            >
              <Box gap="xxs">
                <Text variant="label">Item Quantity</Text>
                <Text variant="bodySmall" color="textMuted">
                  Select quantity to order
                </Text>
              </Box>

              <Stepper
                value={val}
                min={1}
                max={10}
                onValueChange={setVal}
                decrementIcon={icon(Minus)}
                incrementIcon={icon(Plus)}
              />
            </Box>
          </Box>

          {/* 2. Standalone Default Input Stepper */}
          <Box gap="xs">
            <Text variant="labelSmall" color="textSubtle">
              Standalone Input Stepper (No Overlap)
            </Text>
            <Stepper
              value={val}
              min={1}
              max={10}
              onValueChange={setVal}
              decrementIcon={icon(Minus)}
              incrementIcon={icon(Plus)}
            />
          </Box>

          {/* 3. Soft & Glass Variants */}
          <Box gap="xs">
            <Text variant="labelSmall" color="textSubtle">
              Soft & Glassmorphism Variants
            </Text>
            <Box gap="sm">
              <Stepper
                variant="soft"
                value={val}
                min={1}
                max={10}
                onValueChange={setVal}
              />
              <Stepper
                glass
                value={val}
                min={1}
                max={10}
                onValueChange={setVal}
              />
            </Box>
          </Box>

          {/* 4. Sizes */}
          <Box gap="xs">
            <Text variant="labelSmall" color="textSubtle">
              Stepper Sizes (sm, md, lg)
            </Text>
            <Box gap="sm">
              <Stepper
                size="sm"
                value={val}
                min={1}
                max={10}
                onValueChange={setVal}
              />
              <Stepper
                size="lg"
                value={val}
                min={1}
                max={10}
                onValueChange={setVal}
              />
            </Box>
          </Box>

          <Text variant="caption" color="textMuted">
            Current Quantity: {val}
          </Text>
        </Box>
      </Card>
    </Section>
  );
}
