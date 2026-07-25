import {
  Box,
  Card,
  RadioGroup,
  RadioGroupItem,
  Slider,
  Switch,
  Text,
} from "@masumdev/rn-ui";
import { Section, type RnUiSectionContext } from "../shared";

export function SwitchRadioSliderSection({ ctx }: { ctx: RnUiSectionContext }) {
  const {
    switchEnabled,
    setSwitchEnabled,
    radioValue,
    setRadioValue,
    sliderValue,
    setSliderValue,
  } = ctx;

  return (
    <Section title="Switch, Radio, Slider">
      <Card>
        <Box gap="md">
          <Box row center gap="md">
            <Box flex={1}>
              <Text variant="label">Expo React Native</Text>
              <Text variant="bodySmall" color="textMuted">
                Toggle preference by Ma'sum.
              </Text>
            </Box>
            <Switch value={switchEnabled} onValueChange={setSwitchEnabled} />
          </Box>

          <RadioGroup value={radioValue} onValueChange={setRadioValue}>
            <RadioGroupItem
              value="expo"
              label="Expo React Native"
              description="Default option for 2026 UI samples."
            />
            <RadioGroupItem
              value="masum"
              label="by Ma'sum"
              description="Composable and theme-ready."
            />
          </RadioGroup>

          <Box gap="xs">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text variant="label">Progress config</Text>
              <Text variant="labelSmall" color="textMuted">
                {sliderValue}%
              </Text>
            </Box>
            <Slider value={sliderValue} onValueChange={setSliderValue} />
          </Box>
        </Box>
      </Card>
    </Section>
  );
}
