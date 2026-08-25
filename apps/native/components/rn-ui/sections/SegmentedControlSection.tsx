import {
  Badge,
  Box,
  Card,
  SegmentedControl,
  Text,
} from "@masumdev/rn-ui";
import { Grid, List, Calendar, Moon, Sun, Monitor } from "lucide-react-native";
import { useState } from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function SegmentedControlSection(_props?: { ctx?: RnUiSectionContext }) {
  const [viewMode, setViewMode] = useState("Grid");
  const [themeMode, setThemeMode] = useState("System");
  const [filterIdx, setFilterIdx] = useState(0);

  return (
    <Section title="SegmentedControl">
      <Box gap="lg">
        {/* 1. Basic 3-item Segmented Control */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                Cupertino Tab Switcher
              </Text>
              <Badge tone="primary">Spring Animation</Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Smooth sliding pill with spring physics and haptic feedback.
            </Text>

            <SegmentedControl
              values={["Overview", "Analytics", "Reports"]}
              selectedIndex={filterIdx}
              onChange={(idx) => setFilterIdx(idx)}
            />
          </Box>
        </Card>

        {/* 2. Icons and Badges */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                With Icons & Badge Counts
              </Text>
              <Badge tone="accent">Rich Options</Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Each segment can have custom icons, labels, and notification badges.
            </Text>

            <SegmentedControl
              values={[
                {
                  label: "Grid",
                  value: "Grid",
                  icon: ({ color, size }) => <Grid color={color} size={size} />,
                },
                {
                  label: "List",
                  value: "List",
                  icon: ({ color, size }) => <List color={color} size={size} />,
                  badge: 12,
                },
                {
                  label: "Calendar",
                  value: "Calendar",
                  icon: ({ color, size }) => <Calendar color={color} size={size} />,
                  badge: "New",
                },
              ]}
              selectedIndex={viewMode === "Grid" ? 0 : viewMode === "List" ? 1 : 2}
              onChange={(_idx, val) => setViewMode(val)}
              tone="primary"
            />
          </Box>
        </Card>

        {/* 3. Sizes & Tones */}
        <Card outlined>
          <Box gap="md">
            <Text weight="700" color="text">
              Sizes (SM / MD / LG)
            </Text>

            {/* Small */}
            <Box gap="xs">
              <Text variant="caption" color="textMuted">Small Size (32px)</Text>
              <SegmentedControl
                size="sm"
                values={["Daily", "Weekly", "Monthly", "Yearly"]}
              />
            </Box>

            {/* Large with Tone */}
            <Box gap="xs">
              <Text variant="caption" color="textMuted">Large Size (44px) - Success Tone</Text>
              <SegmentedControl
                size="lg"
                tone="success"
                values={[
                  {
                    label: "Light",
                    value: "Light",
                    icon: ({ color, size }) => <Sun color={color} size={size} />,
                  },
                  {
                    label: "Dark",
                    value: "Dark",
                    icon: ({ color, size }) => <Moon color={color} size={size} />,
                  },
                  {
                    label: "System",
                    value: "System",
                    icon: ({ color, size }) => <Monitor color={color} size={size} />,
                  },
                ]}
                selectedIndex={themeMode === "Light" ? 0 : themeMode === "Dark" ? 1 : 2}
                onChange={(_idx, val) => setThemeMode(val)}
              />
            </Box>
          </Box>
        </Card>
      </Box>
    </Section>
  );
}
