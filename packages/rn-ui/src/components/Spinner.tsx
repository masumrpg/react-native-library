import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  type StyleProp,
  type TextStyle,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

import { useTheme } from "../theme";
import { Text } from "./Text";
import type { ComponentTone, ToneProps } from "./types";

export type SpinnerVariant = "circular" | "dots" | "bars" | "ring";
export type SpinnerSize = "xs" | "sm" | "default" | "lg" | "xl" | number;
export type SpinnerSpeed = "slow" | "normal" | "fast" | number;
export type SpinnerLabelPlacement = "bottom" | "right" | "top" | "left";

export interface SpinnerProps extends ViewProps, ToneProps<ComponentTone> {
  /** Visual spinner animation structure. Defaults to "circular" */
  variant?: SpinnerVariant;
  /** Size scale or custom numeric pixel dimension. Defaults to "default" (32px) */
  size?: SpinnerSize;
  /** Custom stroke width for circular/ring variants. Calculated automatically if omitted. */
  strokeWidth?: number;
  /** Rotation/pulse animation speed. Defaults to "normal" */
  speed?: SpinnerSpeed;
  /** Optional descriptive loading text */
  label?: string;
  /** Position of the label relative to the spinner. Defaults to "bottom" */
  labelPlacement?: SpinnerLabelPlacement;
  /** Custom style for the label text */
  labelStyle?: StyleProp<TextStyle>;
  /** Custom background track circle color */
  trackColor?: string;
  /** Direct color override, superseding tone */
  color?: string;
  /** Whether the loading animation is actively running. Defaults to true */
  animated?: boolean;
}

const SIZE_MAP: Record<Exclude<SpinnerSize, number>, number> = {
  xs: 16,
  sm: 22,
  default: 32,
  lg: 44,
  xl: 58,
};

function resolveDuration(speed: SpinnerSpeed): number {
  if (typeof speed === "number" && Number.isFinite(speed) && speed > 0) return speed;
  switch (speed) {
    case "fast":
      return 550;
    case "slow":
      return 1400;
    case "normal":
    default:
      return 850;
  }
}

function resolveDimension(size: SpinnerSize): number {
  if (typeof size === "number") {
    return Number.isFinite(size) && size > 0 ? size : 32;
  }
  return SIZE_MAP[size] ?? 32;
}

function resolveStrokeWidth(dimension: number, customWidth?: number): number {
  if (typeof customWidth === "number" && Number.isFinite(customWidth) && customWidth > 0) {
    return Math.min(customWidth, dimension / 2.5);
  }
  if (dimension <= 18) return 2;
  if (dimension <= 26) return 2.5;
  if (dimension <= 36) return 3.2;
  if (dimension <= 48) return 4;
  return 5;
}

/**
 * Worklet helper to calculate safe, positive rotation degrees strictly in the range [0, 360).
 * Prevents invalid double negatives (e.g. "--10deg") or "NaNdeg" that cause fatal native crashes.
 */
function toSafeDeg(val: number, multiplier = 1): string {
  "worklet";
  if (!Number.isFinite(val)) return "0deg";
  const raw = (val * multiplier) % 360;
  const normalized = (raw + 360) % 360;
  return `${normalized.toFixed(1)}deg`;
}

// ---------------------------------------------------------------------------
// Standalone Memoized Items for Dots & Bars (Resolves Hook Rule Violation)
// ---------------------------------------------------------------------------

interface DotItemProps {
  pulse: SharedValue<number>;
  offset: number;
  size: number;
  color: string;
}

const DotItem = React.memo(function DotItem({
  pulse,
  offset,
  size,
  color,
}: DotItemProps) {
  const dotStyle = useAnimatedStyle(() => {
    const p = Number.isFinite(pulse.value) ? pulse.value : 0;
    const phase = (p + offset) % 1;
    const scale = interpolate(phase, [0, 0.5, 1], [0.4, 1.15, 0.4]);
    const opacity = interpolate(phase, [0, 0.5, 1], [0.35, 1, 0.35]);
    return {
      transform: [{ scale: Number.isFinite(scale) ? scale : 1 }],
      opacity: Number.isFinite(opacity) ? opacity : 1,
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        dotStyle,
      ]}
    />
  );
});

interface BarItemProps {
  pulse: SharedValue<number>;
  offset: number;
  width: number;
  height: number;
  color: string;
}

const BarItem = React.memo(function BarItem({
  pulse,
  offset,
  width,
  height,
  color,
}: BarItemProps) {
  const barStyle = useAnimatedStyle(() => {
    const p = Number.isFinite(pulse.value) ? pulse.value : 0;
    const phase = (p + offset) % 1;
    const scaleY = interpolate(phase, [0, 0.5, 1], [0.28, 1, 0.28]);
    const opacity = interpolate(phase, [0, 0.5, 1], [0.4, 1, 0.4]);
    return {
      transform: [{ scaleY: Number.isFinite(scaleY) ? scaleY : 1 }],
      opacity: Number.isFinite(opacity) ? opacity : 1,
    };
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: width / 2,
          backgroundColor: color,
        },
        barStyle,
      ]}
    />
  );
});

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

function SpinnerComponent({
  variant = "circular",
  tone = "primary",
  size = "default",
  strokeWidth: customStrokeWidth,
  speed = "normal",
  label,
  labelPlacement = "bottom",
  labelStyle,
  trackColor,
  color: customColor,
  animated = true,
  style,
  ...props
}: SpinnerProps) {
  const { colors, spacing } = useTheme();

  // Resolve active theme color
  const toneColor =
    customColor ||
    (tone === "success"
      ? colors.success
      : tone === "warning"
      ? colors.warning
      : tone === "danger"
      ? colors.danger
      : tone === "accent"
      ? colors.accent
      : tone === "secondary"
      ? colors.secondary
      : tone === "info"
      ? colors.info
      : colors.primary);

  const dimension = Math.max(8, resolveDimension(size));
  const strokeWidth = Math.max(1, resolveStrokeWidth(dimension, customStrokeWidth));
  const duration = resolveDuration(speed);

  // Selective animation requirement flags
  const needsRotation = variant === "circular" || variant === "ring";
  const needsPulse = variant === "dots" || variant === "bars";

  // Animation drivers
  const rotation = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (!animated) {
      cancelAnimation(rotation);
      cancelAnimation(pulse);
      rotation.value = 0;
      pulse.value = 0;
      return;
    }

    if (needsRotation) {
      rotation.value = 0;
      rotation.value = withRepeat(
        withTiming(360, {
          duration,
          easing: Easing.linear,
        }),
        -1,
        false,
      );
    } else {
      cancelAnimation(rotation);
      rotation.value = 0;
    }

    if (needsPulse) {
      pulse.value = 0;
      pulse.value = withRepeat(
        withTiming(1, {
          duration: Math.round(duration * 1.2),
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true,
      );
    } else {
      cancelAnimation(pulse);
      pulse.value = 0;
    }

    return () => {
      cancelAnimation(rotation);
      cancelAnimation(pulse);
    };
  }, [animated, duration, needsPulse, needsRotation, pulse, rotation]);

  // Animated styles with crash-proof safe degrees
  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: toSafeDeg(rotation.value, 1) }],
  }));

  const counterSpinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: toSafeDeg(rotation.value, -1.3) }],
  }));

  // Calculations for circular arc with defensive bounds
  const radius = Math.max(1, (dimension - strokeWidth) / 2);
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.72;
  const strokeDashoffset = Math.max(0, circumference - arcLength);
  const backgroundTrackColor = trackColor || colors.backgroundSubtle;

  // Render core loader based on variant
  const renderLoader = () => {
    switch (variant) {
      case "ring": {
        const innerDimension = Math.max(6, dimension * 0.65);
        const innerStroke = Math.max(1, strokeWidth * 0.75);
        const innerRadius = Math.max(1, (innerDimension - innerStroke) / 2);
        const innerCircumference = 2 * Math.PI * innerRadius;

        return (
          <View
            style={{
              width: dimension,
              height: dimension,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Outer Ring */}
            <Animated.View style={[StyleSheet.absoluteFill, spinStyle]}>
              <Svg width={dimension} height={dimension}>
                <Circle
                  cx={dimension / 2}
                  cy={dimension / 2}
                  r={radius}
                  stroke={backgroundTrackColor}
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                <Circle
                  cx={dimension / 2}
                  cy={dimension / 2}
                  r={radius}
                  stroke={toneColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${circumference * 0.5} ${circumference * 0.5}`}
                  strokeLinecap="round"
                  fill="none"
                />
              </Svg>
            </Animated.View>

            {/* Inner Ring (Reverse Direction) */}
            <Animated.View style={counterSpinStyle}>
              <Svg width={innerDimension} height={innerDimension}>
                <Circle
                  cx={innerDimension / 2}
                  cy={innerDimension / 2}
                  r={innerRadius}
                  stroke={toneColor}
                  strokeWidth={innerStroke}
                  strokeDasharray={`${innerCircumference * 0.45} ${innerCircumference * 0.55}`}
                  strokeLinecap="round"
                  fill="none"
                  opacity={0.8}
                />
              </Svg>
            </Animated.View>
          </View>
        );
      }

      case "dots": {
        const dotSize = Math.max(4, Math.round(dimension * 0.24));
        const gap = Math.max(3, Math.round(dotSize * 0.6));

        return (
          <View style={{ flexDirection: "row", alignItems: "center", gap }}>
            {[0, 0.33, 0.66].map((offset, idx) => (
              <DotItem
                key={idx}
                pulse={pulse}
                offset={offset}
                size={dotSize}
                color={toneColor}
              />
            ))}
          </View>
        );
      }

      case "bars": {
        const barWidth = Math.max(2.5, Math.round(dimension * 0.16));
        const barMaxHeight = dimension;
        const gap = Math.max(2.5, Math.round(barWidth * 0.8));

        return (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              height: barMaxHeight,
              gap,
            }}
          >
            {[0, 0.25, 0.5, 0.75].map((offset, idx) => (
              <BarItem
                key={idx}
                pulse={pulse}
                offset={offset}
                width={barWidth}
                height={barMaxHeight}
                color={toneColor}
              />
            ))}
          </View>
        );
      }

      case "circular":
      default:
        return (
          <Animated.View
            style={[
              {
                width: dimension,
                height: dimension,
              },
              spinStyle,
            ]}
          >
            <Svg width={dimension} height={dimension}>
              {/* Background Track */}
              <Circle
                cx={dimension / 2}
                cy={dimension / 2}
                r={radius}
                stroke={backgroundTrackColor}
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Animated Progress Arc */}
              <Circle
                cx={dimension / 2}
                cy={dimension / 2}
                r={radius}
                stroke={toneColor}
                strokeWidth={strokeWidth}
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </Svg>
          </Animated.View>
        );
    }
  };

  // Layout orientation with optional label
  const isRowLayout = labelPlacement === "left" || labelPlacement === "right";
  const isReverse = labelPlacement === "top" || labelPlacement === "left";

  const containerStyle: ViewStyle = {
    flexDirection: isRowLayout ? (isReverse ? "row-reverse" : "row") : (isReverse ? "column-reverse" : "column"),
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  };

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label || "Loading"}
      style={[containerStyle, style]}
      {...props}
    >
      {renderLoader()}
      {typeof label === "string" && label.length > 0 && (
        <Text
          variant="labelSmall"
          color="textMuted"
          style={labelStyle}
        >
          {label}
        </Text>
      )}
    </View>
  );
}

export const Spinner = React.memo(SpinnerComponent);
export const Loader = Spinner;
