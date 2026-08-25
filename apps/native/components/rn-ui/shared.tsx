import { Box, Text } from "@masumdev/rn-ui";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import type { useSectionContext } from "./useSectionContext";

export type RnUiSectionContext = ReturnType<typeof useSectionContext>;

export const SAMPLE_ASSETS = {
  avatarUrl: "https://github.com/masumrpg.png",
  avatarName: "Ma'sum",
  avatarInitials: "MS",
  bannerImageUrl:
    "https://blog.bankmega.com/wp-content/uploads/2025/07/Taman-Langit-Pangalengan-menawarkan-pemandangan-alam-menakjubkan-1170x784.jpg",
};

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ComponentProps<typeof Box>["children"];
}) {
  return (
    <Box gap="sm">
      <Text
        variant="label"
        weight="600"
        color="textMuted"
        style={{ textTransform: "uppercase", letterSpacing: 0.5 }}
      >
        {title}
      </Text>
      {children}
    </Box>
  );
}

export function AnimatedDetail({
  visible,
  children,
}: {
  visible: boolean;
  children: React.ComponentProps<typeof Box>["children"];
}) {
  const progress = useSharedValue(visible ? 1 : 0);
  const [contentHeight, setContentHeight] = React.useState(0);

  React.useEffect(() => {
    progress.value = withTiming(visible ? 1 : 0, { duration: 180 });
  }, [progress, visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: progress.value * contentHeight,
    opacity: progress.value,
  }));

  return (
    <Animated.View style={[{ overflow: "hidden" }, animatedStyle]}>
      <View
        style={{ position: "absolute", left: 0, right: 0 }}
        onLayout={(event) => setContentHeight(event.nativeEvent.layout.height)}
      >
        {children}
      </View>
    </Animated.View>
  );
}

export function ColorBox({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 8,
        backgroundColor: "rgba(150, 150, 150, 0.06)",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            backgroundColor: color,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: "rgba(0,0,0,0.1)",
          }}
        />
        <Text variant="bodySmall" weight="500">
          {label}
        </Text>
      </View>
      <Text variant="caption" color="textMuted">
        {value}
      </Text>
    </View>
  );
}

export function RotatingChevron({
  expanded,
  color,
  size,
  direction = "down",
}: {
  expanded: boolean;
  color: string;
  size: number;
  direction?: "down" | "up" | "left";
}) {
  const progress = useSharedValue(expanded ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(expanded ? 1 : 0, { duration: 180 });
  }, [expanded, progress]);

  const targetDeg = direction === "up" ? -90 : direction === "left" ? 180 : 90;

  const animatedStyle = useAnimatedStyle(() => {
    const deg = interpolate(progress.value, [0, 1], [0, targetDeg]);
    return {
      transform: [{ rotate: `${deg}deg` }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <ChevronRight color={color} size={size} />
    </Animated.View>
  );
}

export const AnimatedToggleIcon = RotatingChevron;
