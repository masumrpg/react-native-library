import React from "react";
import {
  Pressable,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../theme";
import { withAlpha } from "../utils";
import { triggerHaptic } from "../utils/haptics";
import { Text } from "./Text";
import {
  renderIcon,
  type RenderIcon,
  type BaseGlassProps,
  type BaseHapticProps,
  type SizeProps,
  type VariantProps,
} from "./types";

export type StepperVariant = "input" | "soft" | "outline";
export type StepperSize = "sm" | "md" | "lg";

export interface StepperProps
  extends ViewProps,
    BaseGlassProps,
    BaseHapticProps,
    VariantProps<StepperVariant>,
    SizeProps<StepperSize> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onValueChange?: (value: number) => void;
  decrementIcon?: RenderIcon;
  incrementIcon?: RenderIcon;
  style?: StyleProp<ViewStyle>;
}

const stepperHeights: Record<StepperSize, number> = {
  sm: 36,
  md: 44,
  lg: 52,
};

function clampStepper(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function MinusIcon({ color, size }: { color: string; size: number }) {
  return (
    <View
      style={{
        width: size,
        height: 2,
        backgroundColor: color,
        borderRadius: 1,
      }}
    />
  );
}

function PlusIcon({ color, size }: { color: string; size: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          position: "absolute",
          width: size,
          height: 2,
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: 2,
          height: size,
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
    </View>
  );
}

export function Stepper({
  value,
  defaultValue = 0,
  min = 0,
  max = 999,
  step = 1,
  variant = "input",
  size = "md",
  disabled = false,
  glass = false,
  haptic = true,
  onValueChange,
  decrementIcon,
  incrementIcon,
  style,
  ...props
}: StepperProps) {
  const { colors, components, radii, spacing, isDark } = useTheme();
  const [internalValue, setInternalValue] = React.useState(defaultValue);

  const currentValue = clampStepper(value ?? internalValue, min, max);

  const setNextValue = (nextValue: number) => {
    if (disabled) return;
    const next = clampStepper(nextValue, min, max);
    if (haptic) triggerHaptic("selection");
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  const containerHeight = stepperHeights[size];
  const padding = 4;
  const buttonSize = containerHeight - padding * 2;
  const iconSize = size === "sm" ? 12 : size === "md" ? 14 : 16;

  const glassBg = isDark
    ? "rgba(15, 27, 45, 0.70)"
    : "rgba(255, 255, 255, 0.85)";

  const containerBg = disabled
    ? withAlpha(colors.input, 0.55)
    : glass
      ? glassBg
      : variant === "soft"
        ? withAlpha(colors.primary, 0.08)
        : colors.input;

  const borderColor = glass
    ? isDark
      ? "rgba(248, 250, 252, 0.20)"
      : "rgba(15, 23, 42, 0.14)"
    : colors.border;

  // Concentric inner radius (Outer 16px - 4px padding = 12px inner)
  const innerRadius = radii.md;

  const canDecrement = !disabled && currentValue > min;
  const canIncrement = !disabled && currentValue < max;

  return (
    <View
      accessibilityRole="adjustable"
      accessibilityValue={{ min, max, now: currentValue }}
      style={[
        {
          height: containerHeight,
          minHeight: containerHeight,
          flexDirection: "row",
          alignItems: "center",
          borderWidth: components.borderWidth.strong,
          borderColor,
          borderRadius: radii.lg,
          backgroundColor: containerBg,
          padding,
          opacity: disabled ? 0.56 : 1,
        },
        style,
      ]}
      {...props}
    >
      {/* Decrement Button (-) */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Decrement stepper"
        disabled={!canDecrement}
        onPress={() => setNextValue(currentValue - step)}
        style={({ pressed }) => [
          {
            width: buttonSize,
            height: buttonSize,
            borderRadius: innerRadius,
            backgroundColor: pressed && canDecrement
              ? colors.backgroundMuted
              : canDecrement
                ? withAlpha(colors.secondary, 0.12)
                : colors.transparent,
            alignItems: "center",
            justifyContent: "center",
            opacity: canDecrement ? (pressed ? 0.8 : 1) : 0.4,
          },
        ]}
      >
        {decrementIcon ? (
          renderIcon(decrementIcon, canDecrement ? colors.text : colors.disabledText, iconSize)
        ) : (
          <MinusIcon
            color={canDecrement ? colors.text : colors.disabledText}
            size={iconSize}
          />
        )}
      </Pressable>

      {/* Value Counter Text */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: spacing.xs,
        }}
      >
        <Text
          variant={size === "sm" ? "bodySmall" : "label"}
          weight="600"
          style={{ fontVariant: ["tabular-nums"] }}
        >
          {currentValue}
        </Text>
      </View>

      {/* Increment Button (+) */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Increment stepper"
        disabled={!canIncrement}
        onPress={() => setNextValue(currentValue + step)}
        style={({ pressed }) => [
          {
            width: buttonSize,
            height: buttonSize,
            borderRadius: innerRadius,
            backgroundColor: pressed && canIncrement
              ? colors.backgroundMuted
              : canIncrement
                ? withAlpha(colors.secondary, 0.12)
                : colors.transparent,
            alignItems: "center",
            justifyContent: "center",
            opacity: canIncrement ? (pressed ? 0.8 : 1) : 0.4,
          },
        ]}
      >
        {incrementIcon ? (
          renderIcon(incrementIcon, canIncrement ? colors.text : colors.disabledText, iconSize)
        ) : (
          <PlusIcon
            color={canIncrement ? colors.text : colors.disabledText}
            size={iconSize}
          />
        )}
      </Pressable>
    </View>
  );
}
