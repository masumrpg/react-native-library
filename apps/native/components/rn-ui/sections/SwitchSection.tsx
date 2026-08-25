import { Switch, Card, Box, Text, Badge } from "@masumdev/rn-ui";
import { Check } from "lucide-react-native";
import { useState } from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function SwitchSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { switchValue, setSwitchValue } = ctx;
  const [ovalValue, setOvalValue] = useState(true);
  const [airplaneMode, setAirplaneMode] = useState(false);

  return (
    <Section title="Switch">
      <Card outlined>
        <Box gap="lg">
          {/* iOS 26 Oval Variant Showcase */}
          <Box row style={{ alignItems: "center", justifyContent: "space-between" }}>
            <Box flex={1}>
              <Box row center gap="xs">
                <Text variant="label">iOS 26 Oval Switch</Text>
                <Badge tone="accent">variant="oval"</Badge>
              </Box>
              <Text variant="bodySmall" color="textMuted">
                Elongated fluid oval proportions with interactive stretch physics.
              </Text>
            </Box>
            <Switch
              variant="oval"
              value={ovalValue}
              onValueChange={setOvalValue}
              tone="primary"
            />
          </Box>

          {/* Round vs Oval Size Comparison */}
          <Box row style={{ alignItems: "center", justifyContent: "space-between" }}>
            <Box flex={1}>
              <Text variant="label">Round (Standard) vs Oval</Text>
              <Text variant="bodySmall" color="textMuted">
                Side-by-side shape comparison.
              </Text>
            </Box>
            <Box row gap="md" center>
              <Switch
                variant="round"
                value={switchValue}
                onValueChange={setSwitchValue}
              />
              <Switch
                variant="oval"
                value={switchValue}
                onValueChange={setSwitchValue}
                tone="accent"
              />
            </Box>
          </Box>

          {/* Custom Active Thumb Icon */}
          <Box row style={{ alignItems: "center", justifyContent: "space-between" }}>
            <Box flex={1}>
              <Text variant="label">Oval with Active Icon</Text>
              <Text variant="bodySmall" color="textMuted">
                Large oval switch with dynamic thumb icon.
              </Text>
            </Box>
            <Switch
              variant="oval"
              size="lg"
              tone="success"
              value={airplaneMode}
              onValueChange={setAirplaneMode}
              activeThumbContent={({ color, size }) => (
                <Check color={color} size={size} />
              )}
            />
          </Box>

          {/* Sizes in Oval */}
          <Box row style={{ alignItems: "center", justifyContent: "space-between" }}>
            <Box flex={1}>
              <Text variant="label">Oval Sizes (SM / MD / LG)</Text>
              <Text variant="bodySmall" color="textMuted">
                Consistent fluid proportions across all sizes.
              </Text>
            </Box>
            <Box row gap="xs" center>
              <Switch variant="oval" size="sm" value={true} />
              <Switch variant="oval" size="md" value={true} />
              <Switch variant="oval" size="lg" value={true} />
            </Box>
          </Box>

          {/* Disabled States */}
          <Box row style={{ alignItems: "center", justifyContent: "space-between" }}>
            <Box flex={1}>
              <Text variant="label">Disabled Off & On</Text>
              <Text variant="bodySmall" color="textMuted">
                Disabled oval switches with dim track.
              </Text>
            </Box>
            <Box row gap="sm">
              <Switch variant="oval" value={false} disabled />
              <Switch variant="oval" value={true} disabled />
            </Box>
          </Box>
        </Box>
      </Card>
    </Section>
  );
}
