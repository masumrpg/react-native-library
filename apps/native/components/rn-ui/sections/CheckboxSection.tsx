import { Box, Card, Checkbox, Text } from "@masumdev/rn-ui";
import { Section, type RnUiSectionContext } from "../shared";

export function CheckboxSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { colors, checkOne, setCheckOne, checkTwo, setCheckTwo } = ctx;

  return (
    <Section title="Checkbox">
      <Card outlined>
        <Box gap="lg">
          <Text color="textMuted">
            Accessible checkbox inputs with active focus colors, disabled
            states, and invalid/destructive outlines.
          </Text>

          <Box gap="md">
            <Box row center gap="sm">
              <Checkbox checked={checkOne} onCheckedChange={setCheckOne} />
              <Text style={{ fontSize: 14 }}>
                Default Unchecked ({checkOne ? "checked" : "unchecked"})
              </Text>
            </Box>

            <Box row center gap="sm">
              <Checkbox checked={checkTwo} onCheckedChange={setCheckTwo} />
              <Text style={{ fontSize: 14 }}>
                Default Checked ({checkTwo ? "checked" : "unchecked"})
              </Text>
            </Box>

            <Box row center gap="sm">
              <Checkbox checked={true} disabled />
              <Text style={{ fontSize: 14, color: colors.textMuted }}>
                Disabled & Checked
              </Text>
            </Box>

            <Box row center gap="sm">
              <Checkbox checked={false} invalid />
              <Text style={{ fontSize: 14, color: colors.danger }}>
                Invalid / Destructive Outline
              </Text>
            </Box>
          </Box>
        </Box>
      </Card>
    </Section>
  );
}
