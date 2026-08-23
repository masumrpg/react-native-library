import { Stepper, Card, Box, Text } from "@masumdev/rn-ui";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function StepperSection({ ctx: _ctx }: { ctx: RnUiSectionContext }) {
  const [val, setVal] = React.useState(2);

  return (
    <Section title="Stepper">
      <Card outlined>
        <Box gap="md">
          <Text variant="label">Numeric Stepper</Text>
          <Stepper
            value={val}
            min={1}
            max={10}
            onValueChange={setVal}
          />
          <Text variant="bodySmall" color="textMuted">
            Current Count: {val}
          </Text>
        </Box>
      </Card>
    </Section>
  );
}
