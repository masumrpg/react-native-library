import {
  Box,
  Card,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  Input,
  Label,
} from "@masumdev/rn-ui";
import { Section, type RnUiSectionContext } from "../shared";

export function FormSection({ ctx: _ctx }: { ctx: RnUiSectionContext }) {
  return (
    <Section title="Form">
      <Card>
        <Box gap="md">
          <FormField required>
            <FormLabel>Expo React Native</FormLabel>
            <FormControl>
              <Input placeholder="Expo React Native by Ma'sum" />
            </FormControl>
            <FormDescription>
              Label, helper, and control share one field context.
            </FormDescription>
          </FormField>

          <FormField invalid>
            <FormLabel>Highlight 2026</FormLabel>
            <FormControl>
              <Input invalid value="Ma'sum UI" onChangeText={() => undefined} />
            </FormControl>
            <FormMessage>Use Expo React Native by Ma'sum.</FormMessage>
          </FormField>

          <Label>Standalone Label</Label>
        </Box>
      </Card>
    </Section>
  );
}
