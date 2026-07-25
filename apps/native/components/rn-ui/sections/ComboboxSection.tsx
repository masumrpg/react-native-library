import {
  Box,
  Card,
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  Text,
} from "@masumdev/rn-ui";
import { Section, type RnUiSectionContext } from "../shared";

export function ComboboxSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { framework, setFramework } = ctx;

  return (
    <Section title="Combobox">
      <Card outlined>
        <Box gap="lg">
          <Text color="textMuted">
            A fully floating autocomplete input selection dropdown. Tap the
            input to type and filter options, and tap an option to select it.
          </Text>

          <Combobox value={framework} onValueChange={setFramework}>
            <ComboboxInput placeholder="Select a framework..." />
            <ComboboxContent>
              <ComboboxList>
                <ComboboxItem value="next" label="Next.js" />
                <ComboboxItem value="svelte" label="SvelteKit" />
                <ComboboxItem value="nuxt" label="Nuxt.js" />
                <ComboboxItem value="remix" label="Remix" />
                <ComboboxItem value="astro" label="Astro" />
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Box>
      </Card>
    </Section>
  );
}
