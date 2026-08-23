import { Button, Command, Card, Box, Text, type CommandItem } from "@masumdev/rn-ui";
import { Search } from "lucide-react-native";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function CommandSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { icon, commandVisible, setCommandVisible } = ctx;

  return (
    <Section title="Command Palette">
      <Card outlined>
        <Box gap="md">
          <Text color="textMuted">
            Quick command search modal with keyboard navigation support.
          </Text>
          <Button
            variant="outline"
            tone="primary"
            leftIcon={icon(Search)}
            onPress={() => setCommandVisible(true)}
          >
            Open Command Palette
          </Button>

          <Command
            visible={commandVisible}
            onClose={() => setCommandVisible(false)}
            placeholder="Type a command or search..."
            items={[
              { value: "1", label: "Toggle Dark Mode", description: "Preferences" },
              { value: "2", label: "Open QR Generator", description: "Showcases" },
              { value: "3", label: "Open Tajweed Renderer", description: "Showcases" },
              { value: "4", label: "View Component Rules", description: "Documentation" },
            ]}
            onSelect={(_val: string, _item: CommandItem) => {
              setCommandVisible(false);
            }}
          />
        </Box>
      </Card>
    </Section>
  );
}
