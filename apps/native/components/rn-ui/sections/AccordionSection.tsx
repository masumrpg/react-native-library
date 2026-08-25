import { Accordion, Box, Text } from "@masumdev/rn-ui";
import { HelpCircle, Palette, Settings, Sparkles, Layers, ShieldCheck } from "lucide-react-native";
import { Section, type RnUiSectionContext } from "../shared";

export function AccordionSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { icon } = ctx;

  const sampleItems = [
    {
      id: "theme",
      title: "Theme Tokens System",
      subtitle: "Colors, fonts, spacing, radius, and dark mode tokens",
      icon: icon(Palette),
      content:
        "Accordion follows the same flat bordered design system and automatically adapts to light or dark mode themes.",
    },
    {
      id: "icons",
      title: "Flexible Icon Support",
      subtitle: "No dependency on a specific icon package",
      icon: icon(HelpCircle),
      content: (
        <Text color="textMuted">
          Pass any React node or render function for item icons and expand indicators seamlessly.
        </Text>
      ),
    },
    {
      id: "controlled",
      title: "State Management",
      subtitle: "Controlled or uncontrolled state modes",
      icon: icon(Settings),
      content:
        "Use defaultOpenIds for quick setup, or openIds plus onOpenChange when state should live in external application state.",
    },
  ];

  const glassItems = [
    {
      id: "glass_1",
      title: "Glassmorphism Accordion",
      subtitle: "Translucent backdrop with frosted blur effect",
      icon: icon(Sparkles),
      content: "Uses translucent glass surface and frosted border tokens for modern overlay designs.",
    },
    {
      id: "glass_2",
      title: "Security & Encryption",
      subtitle: "End-to-end data encryption enabled",
      icon: icon(ShieldCheck),
      content: "All user data is encrypted in transit and at rest using AES-256 standards.",
    },
  ];

  const flatItems = [
    {
      id: "flat_1",
      title: "Flat Borderless Style",
      subtitle: "Subtle background fill with zero borders",
      icon: icon(Layers),
      content: "Clean borderless card layout ideal for nested interface hierarchies.",
    },
  ];

  return (
    <Section title="Accordion">
      <Box gap="lg">
        {/* Outlined Variant */}
        <Box gap="xs">
          <Text variant="labelSmall" color="textMuted">
            Outlined Variant (Default)
          </Text>
          <Accordion
            variant="outlined"
            defaultOpenIds={["theme"]}
            items={sampleItems}
          />
        </Box>

        {/* Glassmorphism Variant */}
        <Box gap="xs">
          <Text variant="labelSmall" color="textMuted">
            Glassmorphism Variant
          </Text>
          <Accordion
            variant="glass"
            defaultOpenIds={["glass_1"]}
            items={glassItems}
          />
        </Box>

        {/* Flat Variant */}
        <Box gap="xs">
          <Text variant="labelSmall" color="textMuted">
            Flat Borderless Variant
          </Text>
          <Accordion
            variant="flat"
            defaultOpenIds={["flat_1"]}
            items={flatItems}
          />
        </Box>
      </Box>
    </Section>
  );
}
