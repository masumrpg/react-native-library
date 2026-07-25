import { Box, Button, Card, FloatingActionButton, Text } from "@masumdev/rn-ui";
import { Edit3, Plus, Trash } from "lucide-react-native";
import * as React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function FloatingActionButtonSection({
  ctx,
}: {
  ctx: RnUiSectionContext;
}) {
  const { icon } = ctx;
  const [visible, setVisible] = React.useState(true);
  const [extended, setExtended] = React.useState(true);

  return (
    <Section title="Floating Action Button">
      <Card>
        <Box gap="md">
          <Text color="textMuted">
            Reanimated FAB for Expo React Native by Ma'sum in 2026.
          </Text>

          <Box row gap="sm">
            <Button
              size="sm"
              variant={visible ? "filled" : "outline"}
              onPress={() => setVisible((value) => !value)}
            >
              Toggle
            </Button>
            <Button
              size="sm"
              variant={extended ? "filled" : "outline"}
              tone="secondary"
              onPress={() => setExtended((value) => !value)}
            >
              Extended
            </Button>
          </Box>

          <Box row gap="md" center style={{ minHeight: 76 }}>
            <FloatingActionButton
              placement="none"
              visible={visible}
              icon={icon(Plus)}
              label="Create"
              extended={extended}
            />
            <FloatingActionButton
              placement="none"
              visible={visible}
              icon={icon(Edit3)}
              tone="accent"
              variant="soft"
            />
            <FloatingActionButton
              placement="none"
              visible={visible}
              icon={icon(Trash)}
              tone="danger"
              variant="outline"
            />
          </Box>
        </Box>
      </Card>
    </Section>
  );
}
