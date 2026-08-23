import {
  Box,
  Card,
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  Text,
} from "@masumdev/rn-ui";
import { Check, ChevronsUpDown, Search } from "lucide-react-native";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function ComboboxSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { icon, framework, setFramework } = ctx;

  const frameworks = [
    { value: "react-native", label: "React Native CLI" },
    { value: "expo", label: "Expo SDK 57" },
    { value: "masum", label: "@masumdev/rn-ui" },
    { value: "next", label: "Next.js" },
    { value: "svelte", label: "SvelteKit" },
    { value: "nuxt", label: "Nuxt.js" },
    { value: "astro", label: "Astro" },
  ];

  return (
    <Section title="Combobox">
      <Card outlined>
        <Box gap="lg">
          <Text color="textMuted">
            A fully floating autocomplete input selection dropdown. Tap the
            input to type and filter options live, or select from the dropdown.
          </Text>

          {/* Autocomplete Combobox Input */}
          <Box gap="xs">
            <Text variant="labelSmall" color="textSubtle">
              Typeable Autocomplete Combobox (Anchored Below Input)
            </Text>
            <Combobox value={framework} onValueChange={setFramework}>
              <ComboboxInput
                placeholder="Type to filter frameworks..."
                searchIcon={icon(Search)}
                chevronIcon={icon(ChevronsUpDown)}
              />
              <ComboboxContent>
                <ComboboxList>
                  {frameworks.map((item) => (
                    <ComboboxItem
                      key={item.value}
                      value={item.value}
                      label={item.label}
                      checkIcon={icon(Check)}
                    />
                  ))}
                  <ComboboxEmpty>No matching framework found.</ComboboxEmpty>
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Box>

          <Text variant="caption" color="textMuted">
            Selected Value: {framework}
          </Text>
        </Box>
      </Card>
    </Section>
  );
}
