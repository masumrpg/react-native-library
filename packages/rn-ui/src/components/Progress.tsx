import React from "react";
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

import { useTheme } from "../theme";
import { Text } from "./Text";
import type { ComponentTone, ToneProps } from "./types";

export type ProgressSize = "xs" | "sm" | "default" | "lg" | "xl";

export interface ProgressProps extends ViewProps, ToneProps<ComponentTone> {
  value?: number;
  max?: number;
  size?: ProgressSize;
  animated?: boolean;
  indeterminate?: boolean;
  style?: StyleProp<ViewStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
}

export function Progress({
  value = 0,
  max = 100,
  tone = "primary",
  size = "default",
  animated = true,
  indeterminate = false,
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

  const height =
    size === "xs"
      ? 4
      : size === "sm"
      ? 6
      : size === "lg"
      ? 14
      : size === "xl"
      ? 18
      : 10;

  const progress = Math.max(0, Math.min(1, max <= 0 ? 0 : value / max));
  const width = useSharedValue(progress);
  const indeterminateOffset = useSharedValue(-0.4);

  React.useEffect(() => {
    if (indeterminate) {
      indeterminateOffset.value = -0.4;
      indeterminateOffset.value = withRepeat(
        withTiming(1, { duration: 1200, easing: Easing.bezier(0.4, 0, 0.6, 1) }),
        -1,
        false,
      );
      return;
    }

    if (!animated) {
      width.value = progress;
      return;
    }
    width.value = withTiming(progress, { duration: 220, easing: Easing.out(Easing.quad) });
  }, [animated, indeterminate, progress, width, indeterminateOffset]);

  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    if (indeterminate) {
      return {
        width: "40%",
        transform: [
          {
            translateX: indeterminateOffset.value * 280,
          },
        ],
      };
    }
    return {
      width: `${width.value * 100}%`,
    };
  });

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max, now: value }}
      style={[
        {
          width: "100%",
          height,
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

export interface CircularProgressProps extends ToneProps<ComponentTone> {
  value?: number; // 0 to 100
  size?: number; // Outer diameter (default 64)
  strokeWidth?: number; // Ring thickness (default 6)
  showValue?: boolean;
  strokeLinecap?: "round" | "square" | "butt";
  style?: StyleProp<ViewStyle>;
}

export function CircularProgress({
  value = 0,
  size = 64,
  strokeWidth = 6,
  tone = "primary",
  showValue = true,
  strokeLinecap = "round",
  style,
}: CircularProgressProps) {
  const { colors } = useTheme();

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

  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * clamped) / 100;

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        },
        style,
      ]}
    >
      <Svg
        width={size}
        height={size}
        style={{ transform: [{ rotate: "-90deg" }] }}
      >
        {/* Background track circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.backgroundSubtle}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Foreground progress arc with ROUNDED LINE CAPS */}
        {clamped > 0 && (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={toneColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap={strokeLinecap}
            fill="none"
          />
        )}
      </Svg>

      {showValue && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text weight="700" color="text" style={{ fontSize: size * 0.22 }}>
            {Math.round(clamped)}%
          </Text>
        </View>
      )}
    </View>
  );
}
