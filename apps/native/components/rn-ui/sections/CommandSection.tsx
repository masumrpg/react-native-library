import { Button, Command, Card, Box, Text, useToast, type CommandItem } from "@masumdev/rn-ui";
import {
  Search,
  Moon,
  QrCode,
  BookOpen,
  FileText,
  User,
  Settings,
  Sparkles,
} from "lucide-react-native";
import { Section, type RnUiSectionContext } from "../shared";

export function CommandSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { icon, commandVisible, setCommandVisible } = ctx;
  const { show } = useToast();

  const commandItems: CommandItem[] = [
    {
      value: "toggle_dark_mode",
      label: "Toggle Dark Mode",
      description: "Switch between dark & light themes",
      group: "Preferences",
      shortcut: "⌘D",
      icon: icon(Moon),
    },
    {
      value: "qr_generator",
      label: "Open QR Generator",
      description: "Generate custom styled QR codes",
      group: "Showcases",
      shortcut: "⌘Q",
      badge: "NEW",
      icon: icon(QrCode),
    },
    {
      value: "tajweed_renderer",
      label: "Open Tajweed Renderer",
      description: "Islamic Quranic text typography",
      group: "Showcases",
      shortcut: "⌘T",
      icon: icon(BookOpen),
    },
    {
      value: "component_rules",
      label: "View Component Rules",
      description: "Review UI kit design system guidelines",
      group: "Documentation",
      shortcut: "⌘R",
      icon: icon(FileText),
    },
    {
      value: "user_profile",
      label: "Edit User Profile",
      description: "Update personal account settings",
      group: "Account",
      shortcut: "⌘P",
      icon: icon(User),
    },
    {
      value: "system_settings",
      label: "App Settings",
      description: "Configure notifications and storage",
      group: "Account",
      shortcut: "⌘S",
      icon: icon(Settings),
    },
    {
      value: "ai_assistant",
      label: "Ask AI Assistant",
      description: "Get smart help and recommendations",
      group: "Actions",
      badge: "AI",
      icon: icon(Sparkles),
    },
  ];

  return (
    <Section title="Command Palette">
      <Card outlined>
        <Box gap="md">
          <Text color="textMuted">
            Bottom Sheet Command Search Palette with category grouping, icons, keyboard shortcuts, and instant result selection.
          </Text>

          <Button
            variant="filled"
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
            items={commandItems}
            onSelect={(_val: string, item: CommandItem) => {
              show({
                title: "Command Executed",
                description: `Selected: ${item.label}`,
                tone: "info",
              });
              setCommandVisible(false);
            }}
          />
        </Box>
      </Card>
    </Section>
  );
}
