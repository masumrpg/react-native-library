import { Box, Button, Card, Text } from "@masumdev/rn-ui";
import { Sparkles, Heart } from "lucide-react-native";
import { Section, type RnUiSectionContext } from "../shared";

export function ButtonsSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { styles, icon } = ctx;

  return (
    <Section title="Buttons">
      <Card outlined>
        <Box gap="lg">
          <Text color="textMuted">
            Interactive buttons with variants, semantic tones, haptic feedback, and glassmorphism styling.
          </Text>

          {/* Variants */}
          <Box gap="xs">
            <Text variant="labelSmall" color="textSubtle">
              Variants
            </Text>
            <Box row style={styles.wrap} gap="sm">
              <Button variant="filled">Filled</Button>
              <Button variant="soft">Soft</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button glass leftIcon={icon(Sparkles)}>
                Glassmorphism
              </Button>
            </Box>
          </Box>

          {/* Tones */}
          <Box gap="xs">
            <Text variant="labelSmall" color="textSubtle">
              Semantic Tones
            </Text>
            <Box row style={styles.wrap} gap="sm">
              <Button tone="primary" leftIcon={icon(Heart)}>
                Primary
              </Button>
              <Button tone="secondary">Secondary</Button>
              <Button tone="accent">Accent</Button>
              <Button tone="success">Success</Button>
              <Button tone="warning">Warning</Button>
              <Button tone="danger">Danger</Button>
            </Box>
          </Box>
        </Box>
      </Card>
    </Section>
  );
}
