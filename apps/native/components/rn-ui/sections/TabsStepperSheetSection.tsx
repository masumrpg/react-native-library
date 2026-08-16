import {
  Box,
  Button,
  Card,
  Stepper,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from "@masumdev/rn-ui";
import { Minus, Plus } from "lucide-react-native";
import { Section, type RnUiSectionContext } from "../shared";

export function TabsStepperSheetSection({ ctx }: { ctx: RnUiSectionContext }) {
  const {
    icon,
    stepperValue,
    setStepperValue,
    tabValue,
    setTabValue,
    openSheet,
  } = ctx;

  return (
    <Section title="Tabs, Stepper, Sheet">
      <Card>
        <Box gap="md">
          <Tabs value={tabValue} onValueChange={setTabValue}>
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="tokens">Tokens</TabsTrigger>
            </TabsList>
            <TabsContent value="preview">
              <Text color="textMuted">
                Expo React Native by Ma'sum preview content.
              </Text>
            </TabsContent>
            <TabsContent value="tokens">
              <Text color="textMuted">
                Flat theme tokens for consistent 2026 UI.
              </Text>
            </TabsContent>
          </Tabs>

          <Box row center style={{ justifyContent: "space-between" }}>
            <Box>
              <Text variant="label">Stepper</Text>
              <Text variant="bodySmall" color="textMuted">
                Quantity control
              </Text>
            </Box>
            <Stepper
              value={stepperValue}
              onValueChange={setStepperValue}
              min={0}
              max={9}
              decrementIcon={icon(Minus)}
              incrementIcon={icon(Plus)}
            />
          </Box>

          <Button
            variant="outline"
            tone="secondary"
            onPress={openSheet}
          >
            Open Sheet
          </Button>
        </Box>
      </Card>
    </Section>
  );
}
