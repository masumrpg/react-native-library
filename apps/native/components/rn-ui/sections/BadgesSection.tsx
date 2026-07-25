import { Badge, Box, Card } from "@masumdev/rn-ui";
import { Check } from "lucide-react-native";
import { Section, type RnUiSectionContext } from "../shared";

export function BadgesSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { styles, icon } = ctx;

  return (
    <Section title="Badges">
      <Card>
        <Box gap="sm">
          <Box row gap="sm" style={styles.wrap}>
            <Badge tone="primary" variant="solid">
              Primary
            </Badge>
            <Badge tone="secondary" variant="soft">
              Secondary
            </Badge>
            <Badge tone="accent" variant="outline">
              Accent
            </Badge>
          </Box>
          <Box row gap="sm" style={styles.wrap}>
            <Badge tone="success" icon={icon(Check)}>
              Success
            </Badge>
            <Badge tone="warning">Warning</Badge>
            <Badge tone="danger">Danger</Badge>
            <Badge tone="info">Info</Badge>
          </Box>
          <Box row gap="sm" style={styles.wrap}>
            <Badge size="sm">Small</Badge>
            <Badge size="md">Medium</Badge>
            <Badge size="lg">Large</Badge>
          </Box>
        </Box>
      </Card>
    </Section>
  );
}
