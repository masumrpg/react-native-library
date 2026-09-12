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
  if (typeof speed === "number") return speed;
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
  if (typeof size === "number") return size;
  return SIZE_MAP[size] ?? 32;
}

function resolveStrokeWidth(dimension: number, customWidth?: number): number {
  if (typeof customWidth === "number") return customWidth;
  if (dimension <= 18) return 2;
  if (dimension <= 26) return 2.5;
  if (dimension <= 36) return 3.2;
  if (dimension <= 48) return 4;
  return 5;
}

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

  const dimension = resolveDimension(size);
  const strokeWidth = resolveStrokeWidth(dimension, customStrokeWidth);
  const duration = resolveDuration(speed);

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

    rotation.value = 0;
    rotation.value = withRepeat(
      withTiming(360, {
        duration,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    pulse.value = 0;
    pulse.value = withRepeat(
      withTiming(1, {
        duration: Math.round(duration * 1.2),
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );

    return () => {
      cancelAnimation(rotation);
      cancelAnimation(pulse);
    };
  }, [animated, duration, pulse, rotation]);

  // Animated styles
  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const counterSpinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `-${rotation.value * 1.3}deg` }],
  }));

  // Calculations for circular arc
  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.72;
  const strokeDashoffset = circumference - arcLength;
  const backgroundTrackColor = trackColor || colors.backgroundSubtle;

  // Render core loader based on variant
  const renderLoader = () => {
    switch (variant) {
      case "ring": {
        const innerDimension = Math.max(8, dimension * 0.65);
        const innerStroke = Math.max(1.5, strokeWidth * 0.75);
        const innerRadius = (innerDimension - innerStroke) / 2;
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
            {[0, 0.33, 0.66].map((offset, idx) => {
              const DotAnimatedView = () => {
                const dotStyle = useAnimatedStyle(() => {
                  const phase = (pulse.value + offset) % 1;
                  const scale = interpolate(phase, [0, 0.5, 1], [0.4, 1.15, 0.4]);
                  const opacity = interpolate(phase, [0, 0.5, 1], [0.35, 1, 0.35]);
                  return {
                    transform: [{ scale }],
                    opacity,
                  };
                });

                return (
                  <Animated.View
                    key={idx}
                    style={[
                      {
                        width: dotSize,
                        height: dotSize,
                        borderRadius: dotSize / 2,
                        backgroundColor: toneColor,
                      },
                      dotStyle,
                    ]}
                  />
                );
              };

              return <DotAnimatedView key={idx} />;
            })}
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
            {[0, 0.25, 0.5, 0.75].map((offset, idx) => {
              const BarAnimatedView = () => {
                const barStyle = useAnimatedStyle(() => {
                  const phase = (pulse.value + offset) % 1;
                  const scaleY = interpolate(phase, [0, 0.5, 1], [0.28, 1, 0.28]);
                  const opacity = interpolate(phase, [0, 0.5, 1], [0.4, 1, 0.4]);
                  return {
                    transform: [{ scaleY }],
                    opacity,
                  };
                });

                return (
                  <Animated.View
                    key={idx}
                    style={[
                      {
                        width: barWidth,
                        height: barMaxHeight,
                        borderRadius: barWidth / 2,
                        backgroundColor: toneColor,
                      },
                      barStyle,
                    ]}
                  />
                );
              };

              return <BarAnimatedView key={idx} />;
            })}
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
