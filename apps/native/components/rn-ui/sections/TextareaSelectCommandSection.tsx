import { Box, Button, Card, Select, Textarea } from "@masumdev/rn-ui";
import { Check, ChevronsUpDown } from "lucide-react-native";
import { Section, type RnUiSectionContext } from "../shared";

export function TextareaSelectCommandSection({
  ctx,
}: {
  ctx: RnUiSectionContext;
}) {
  const { icon, selectValue, setSelectValue, setCommandVisible } = ctx;

  return (
    <Section title="Textarea, Select, Command">
      <Card>
        <Box gap="md">
          <Textarea placeholder="Write Expo React Native notes by Ma'sum..." />
          <Select
            value={selectValue}
            onValueChange={setSelectValue}
            title="Choose framework"
            placeholder="Select framework"
            options={[
              {
                value: "expo",
                label: "Expo React Native",
                description: "Recommended sample for 2026.",
              },
              {
                value: "rn",
                label: "React Native",
                description: "Core mobile runtime.",
              },
              {
                value: "masum",
                label: "by Ma'sum",
                description: "Theme-ready UI library.",
              },
            ]}
            checkIcon={icon(Check)}
            chevronIcon={icon(ChevronsUpDown)}
          />
          <Button
            variant="outline"
            tone="secondary"
            onPress={() => setCommandVisible(true)}
          >
            Open Command
          </Button>
        </Box>
      </Card>
    </Section>
  );
}
