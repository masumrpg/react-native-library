import { Skeleton, Button, Card, Box, Text } from "@masumdev/rn-ui";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function SkeletonSection({ ctx: _ctx }: { ctx: RnUiSectionContext }) {
  const [animated, setAnimated] = React.useState(true);

  return (
    <Section title="Skeleton Loaders">
      <Card outlined>
        <Box gap="md">
          <Box row style={{ justifyContent: "space-between", alignItems: "center" }}>
            <Text variant="title">Skeleton Shimmer</Text>
            <Button
              size="xs"
              variant="outline"
              onPress={() => setAnimated(!animated)}
            >
              {animated ? "Pause" : "Play"}
            </Button>
          </Box>

          <Card outlined>
            <Box gap="md">
              <Box row style={{ alignItems: "center", gap: 12 }}>
                <Skeleton animated={animated} radius="full" style={{ width: 48, height: 48 }} />
                <Box flex={1} gap="xs">
                  <Skeleton animated={animated} style={{ height: 16, width: "60%" }} />
                  <Skeleton animated={animated} style={{ height: 12, width: "40%" }} />
                </Box>
              </Box>
              <Box gap="xs" style={{ marginTop: 4 }}>
                <Skeleton animated={animated} style={{ height: 14, width: "100%" }} />
                <Skeleton animated={animated} style={{ height: 14, width: "85%" }} />
                <Skeleton animated={animated} style={{ height: 14, width: "50%" }} />
              </Box>
            </Box>
          </Card>

          <Box gap="sm" style={{ marginTop: 4 }}>
            <Text variant="caption" color="textMuted">Diagonal Shimmer Direction</Text>
            <Skeleton animated={animated} direction="top-left-to-bottom-right" style={{ height: 28, width: "100%" }} />

            <Text variant="caption" color="textMuted">Horizontal Shimmer Direction</Text>
            <Skeleton animated={animated} direction="left-to-right" style={{ height: 28, width: "100%" }} />
          </Box>
        </Box>
      </Card>
    </Section>
  );
}
