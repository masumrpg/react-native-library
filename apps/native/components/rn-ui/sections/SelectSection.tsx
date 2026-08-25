import { Select, Card, Box, Text } from "@masumdev/rn-ui";
import { Check, ChevronsUpDown } from "lucide-react-native";
import { Section, type RnUiSectionContext } from "../shared";

export function SelectSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { icon, selectValue, setSelectValue } = ctx;

  const options = [
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
  ];

  return (
    <Section title="Select">
      <Card outlined>
        <Box gap="lg">
          <Text color="textMuted">
            Anchored floating dropdown selector with variants, sizes, glassmorphism, and haptics.
          </Text>

          {/* Outline Variant (Default) */}
          <Box gap="xs">
            <Text variant="labelSmall" color="textSubtle">
              Default Outline Dropdown
            </Text>
            <Select
              value={selectValue}
              onValueChange={setSelectValue}
              variant="outline"
              placeholder="Select framework"
              options={options}
              checkIcon={icon(Check)}
              chevronIcon={icon(ChevronsUpDown)}
            />
          </Box>

          {/* Soft & Glass Variants */}
          <Box gap="xs">
            <Text variant="labelSmall" color="textSubtle">
              Soft & Glassmorphism Variants
            </Text>
            <Box gap="sm">
              <Select
                value={selectValue}
                onValueChange={setSelectValue}
                variant="soft"
                placeholder="Soft variant"
                options={options}
                checkIcon={icon(Check)}
                chevronIcon={icon(ChevronsUpDown)}
              />
              <Select
                value={selectValue}
                onValueChange={setSelectValue}
                glass
                placeholder="Glassmorphism variant"
                options={options}
                checkIcon={icon(Check)}
                chevronIcon={icon(ChevronsUpDown)}
              />
            </Box>
          </Box>

          {/* Sizes */}
          <Box gap="xs">
            <Text variant="labelSmall" color="textSubtle">
              Select Sizes (sm, md, lg)
            </Text>
            <Box gap="sm">
              <Select
                size="sm"
                value={selectValue}
                onValueChange={setSelectValue}
                options={options}
                checkIcon={icon(Check)}
                chevronIcon={icon(ChevronsUpDown)}
              />
              <Select
                size="lg"
                value={selectValue}
                onValueChange={setSelectValue}
                options={options}
                checkIcon={icon(Check)}
                chevronIcon={icon(ChevronsUpDown)}
              />
            </Box>
          </Box>

          <Text variant="caption" color="textMuted">
            Selected Value: {selectValue}
          </Text>
        </Box>
      </Card>
    </Section>
  );
}
