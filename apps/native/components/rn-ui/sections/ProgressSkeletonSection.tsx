import { Box, Button, Card, Progress, Skeleton, Text } from "@masumdev/rn-ui";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function ProgressSkeletonSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { sliderValue } = ctx;
  const [animated, setAnimated] = React.useState(true);

  return (
    <Section title="Progress & Skeleton">
      <Card gap="md">
        <Text variant="title">Progress Bar</Text>
        <Progress value={sliderValue} />

        <Box row center justify="space-between" mt="sm">
          <Text variant="title">Skeleton Loaders & Shimmer</Text>
          <Button
            size="xs"
            variant="outline"
            onPress={() => setAnimated(!animated)}
          >
            {animated ? "Pause" : "Play"}
          </Button>
        </Box>

        {/* Profile Card Skeleton */}
        <Card variant="muted" gap="md">
          <Box row center gap="md">
            <Skeleton
              animated={animated}
              radius="full"
              style={{ width: 48, height: 48 }}
            />
            <Box flex={1} gap="xs">
              <Skeleton
                animated={animated}
                style={{ height: 16, width: "60%" }}
              />
              <Skeleton
                animated={animated}
                style={{ height: 12, width: "40%" }}
              />
            </Box>
          </Box>
          <Box gap="xs" mt="xs">
            <Skeleton
              animated={animated}
              style={{ height: 14, width: "100%" }}
            />
            <Skeleton
              animated={animated}
              style={{ height: 14, width: "85%" }}
            />
            <Skeleton
              animated={animated}
              style={{ height: 14, width: "50%" }}
            />
          </Box>
        </Card>

        {/* Shimmer Directions Sample */}
        <Box gap="sm" mt="xs">
          <Text variant="caption" color="textMuted">
            Diagonal (Default: Top-Left to Bottom-Right)
          </Text>
          <Skeleton
            animated={animated}
            direction="top-left-to-bottom-right"
            style={{ height: 28, width: "100%" }}
          />

          <Text variant="caption" color="textMuted">
            Horizontal (Left to Right)
          </Text>
          <Skeleton
            animated={animated}
            direction="left-to-right"
            style={{ height: 28, width: "100%" }}
          />

          <Text variant="caption" color="textMuted">
            Diagonal (Top-Right to Bottom-Left)
          </Text>
          <Skeleton
            animated={animated}
            direction="top-right-to-bottom-left"
            style={{ height: 28, width: "100%" }}
          />
        </Box>
      </Card>
    </Section>
  );
}
