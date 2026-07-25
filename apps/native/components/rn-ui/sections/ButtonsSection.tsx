import { Box, Button, Card } from "@masumdev/rn-ui";
import { Heart, Plus } from "lucide-react-native";
import { Section, type RnUiSectionContext } from "../shared";

export function ButtonsSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { styles, icon } = ctx;

  return (
    <Section title="Buttons">
      <Card>
        <Box gap="md">
          <Button leftIcon={icon(Plus)} fullWidth>
            Filled Primary
          </Button>
          <Button variant="outline" tone="secondary" fullWidth>
            Outline Secondary
          </Button>
          <Button variant="soft" tone="accent" leftIcon={icon(Heart)} fullWidth>
            Soft Accent
          </Button>
          <Button variant="ghost" tone="info" fullWidth>
            Ghost Info
          </Button>
          <Button variant="danger" fullWidth>
            Danger Action
          </Button>
          <Box row gap="sm" style={styles.wrap}>
            <Button size="xs">XS</Button>
            <Button size="sm">SM</Button>
            <Button size="md">MD</Button>
            <Button size="lg">LG</Button>
            <Button size="xl">XL</Button>
          </Box>
        </Box>
      </Card>
    </Section>
  );
}
