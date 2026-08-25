import { Badge, Box, Card, Text } from "@masumdev/rn-ui";
import { Check, Sparkles, ShieldCheck, AlertTriangle, Bell, Flame, Zap } from "lucide-react-native";
import { Section, type RnUiSectionContext } from "../shared";

export function BadgesSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { styles } = ctx;

  return (
    <Section title="Badges">
      <Box gap="xl">
        {/* All Badge Variants */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                Badge Variants
              </Text>
              <Badge tone="primary" variant="solid">
                solid, soft, outline, subtle, ghost, glass
              </Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Supports 6 styling variants for different visual hierarchy needs.
            </Text>

            <Box gap="sm">
              <Box row gap="sm" center style={styles.wrap}>
                <Badge tone="primary" variant="solid">
                  Solid
                </Badge>
                <Badge tone="primary" variant="soft">
                  Soft
                </Badge>
                <Badge tone="primary" variant="outline">
                  Outline
                </Badge>
                <Badge tone="primary" variant="subtle">
                  Subtle
                </Badge>
                <Badge tone="primary" variant="ghost">
                  Ghost
                </Badge>
                <Badge tone="primary" glass>
                  Glass
                </Badge>
              </Box>
            </Box>
          </Box>
        </Card>

        {/* All Component Tones */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                Component Tones with Icons
              </Text>
              <Badge tone="success" variant="outline">
                Icons & Tones
              </Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Harmonious color palette with optional Lucide icon prefixes.
            </Text>

            <Box gap="sm">
              <Box row gap="sm" center style={styles.wrap}>
                <Badge
                  tone="primary"
                  variant="solid"
                  icon={({ color, size }) => <Sparkles color={color} size={size} />}
                >
                  Featured
                </Badge>
                <Badge
                  tone="success"
                  variant="soft"
                  icon={({ color, size }) => <ShieldCheck color={color} size={size} />}
                >
                  Verified
                </Badge>
                <Badge
                  tone="warning"
                  variant="subtle"
                  icon={({ color, size }) => <AlertTriangle color={color} size={size} />}
                >
                  Warning
                </Badge>
                <Badge
                  tone="danger"
                  variant="solid"
                  icon={({ color, size }) => <Flame color={color} size={size} />}
                >
                  Hot Deal
                </Badge>
                <Badge
                  tone="accent"
                  variant="soft"
                  icon={({ color, size }) => <Zap color={color} size={size} />}
                >
                  Instant
                </Badge>
                <Badge
                  tone="info"
                  variant="outline"
                  icon={({ color, size }) => <Bell color={color} size={size} />}
                >
                  Update
                </Badge>
              </Box>
            </Box>
          </Box>
        </Card>

        {/* Sizes Scale */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                Badge Sizes Scale
              </Text>
              <Badge tone="warning" size="sm">
                sm, md, lg
              </Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Small, medium, and large size options with proportional icon & font scaling.
            </Text>

            <Box row gap="md" center style={styles.wrap}>
              <Box center gap="xs">
                <Badge
                  size="sm"
                  tone="primary"
                  icon={({ color, size }) => <Check color={color} size={size} />}
                >
                  Small (sm)
                </Badge>
                <Text variant="caption" color="textMuted">
                  Compact
                </Text>
              </Box>

              <Box center gap="xs">
                <Badge
                  size="md"
                  tone="primary"
                  icon={({ color, size }) => <Check color={color} size={size} />}
                >
                  Medium (md)
                </Badge>
                <Text variant="caption" color="textMuted">
                  Standard
                </Text>
              </Box>

              <Box center gap="xs">
                <Badge
                  size="lg"
                  tone="primary"
                  icon={({ color, size }) => <Check color={color} size={size} />}
                >
                  Large (lg)
                </Badge>
                <Text variant="caption" color="textMuted">
                  Prominent
                </Text>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </Section>
  );
}
