import React from "react";
import {
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "../theme";
import type { ComponentTone, ToneProps } from "./types";

export interface ProgressProps extends ViewProps, ToneProps<ComponentTone> {
  value?: number;
  max?: number;
  animated?: boolean;
  style?: StyleProp<ViewStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
}

export function Progress({
  value = 0,
  max = 100,
  tone = "primary",
  animated = true,
  style,
  indicatorStyle,
  ...props
}: ProgressProps) {
  const { colors, radii } = useTheme();
  const toneColor =
    tone === "success"
      ? colors.success
      : tone === "warning"
      ? colors.warning
      : tone === "danger"
      ? colors.danger
      : tone === "accent"
      ? colors.accent
      : colors.primary;
  const progress = Math.max(0, Math.min(1, max <= 0 ? 0 : value / max));
  const width = useSharedValue(progress);

  React.useEffect(() => {
    if (!animated) {
      width.value = progress;
      return;
    }
    width.value = withTiming(progress, { duration: 180 });
  }, [animated, progress, width]);

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max, now: value }}
      style={[
        {
          width: "100%",
          height: 10,
          borderRadius: radii.full,
          overflow: "hidden",
          backgroundColor: colors.backgroundSubtle,
        },
        style,
      ]}
      {...props}
    >
      <Animated.View
        style={[
          {
            height: "100%",
            borderRadius: radii.full,
            backgroundColor: toneColor,
          },
          indicatorAnimatedStyle,
          indicatorStyle,
        ]}
      />
    </View>
  );
}
