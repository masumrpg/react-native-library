import { Accordion, Text } from "@masumdev/rn-ui";
import { HelpCircle, Palette, Settings } from "lucide-react-native";
import { Section, type RnUiSectionContext } from "../shared";

export function AccordionSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { icon } = ctx;

  return (
    <Section title="Accordion">
      <Accordion
        defaultOpenIds={["theme"]}
        items={[
          {
            id: "theme",
            title: "Theme tokens",
            subtitle: "Colors, fonts, spacing, radius, and component sizes",
            icon: icon(Palette),
            content:
              "Accordion follows the same flat bordered style and automatically adapts to light or dark mode.",
          },
          {
            id: "icons",
            title: "Generic icons",
            subtitle: "No dependency on a specific icon package",
            icon: icon(HelpCircle),
            content: (
              <Text color="textMuted">
                Pass any React node or render function for item icons and the
                expand indicator.
              </Text>
            ),
          },
          {
            id: "controlled",
            title: "Controlled or uncontrolled",
            subtitle: "Use openIds for full state control",
            icon: icon(Settings),
            content:
              "Use defaultOpenIds for quick setup, or openIds plus onOpenChange when state should live in the app.",
          },
        ]}
      />
    </Section>
  );
}
