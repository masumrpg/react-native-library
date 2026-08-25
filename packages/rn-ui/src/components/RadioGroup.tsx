import React from "react";
import {
  Pressable,
  View,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "../theme";
import { triggerHaptic } from "../utils/haptics";
import { Text } from "./Text";
import type { BaseGlassProps, BaseHapticProps, BaseAnimatedProps } from "./types";

export type RadioGroupVariant = "card" | "plain";

export interface RadioGroupContextValue {
  value?: string;
  disabled: boolean;
  orientation: "horizontal" | "vertical";
  variant: RadioGroupVariant;
  onValueChange?: (value: string) => void;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
  null,
);

export interface RadioGroupProps extends ViewProps {
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
  variant?: RadioGroupVariant;
  onValueChange?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

export function RadioGroup({
  value,
  defaultValue,
  disabled = false,
  orientation = "vertical",
  variant = "card",
  onValueChange,
  style,
  ...props
}: RadioGroupProps) {
  const { spacing } = useTheme();
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const currentValue = value ?? internalValue;
  const handleValueChange = React.useCallback(
    (next: string) => {
      if (value === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [onValueChange, value],
  );
  const context = React.useMemo(
    () => ({
      value: currentValue,
      disabled,
      orientation,
      variant,
      onValueChange: handleValueChange,
    }),
    [currentValue, disabled, orientation, variant, handleValueChange],
  );

  return (
    <RadioGroupContext.Provider value={context}>
      <View
        accessibilityRole="radiogroup"
        style={[
          {
            flexDirection: orientation === "horizontal" ? "row" : "column",
            gap: orientation === "horizontal" ? spacing.md : spacing.sm,
            width: "100%",
          },
          style,
        ]}
        {...props}
      />
    </RadioGroupContext.Provider>
  );
}

export interface RadioGroupItemProps
  extends Omit<PressableProps, "style">,
    BaseGlassProps,
    BaseHapticProps,
    BaseAnimatedProps {
  value: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  variant?: RadioGroupVariant;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export function RadioGroupItem({
  value,
  label,
  description,
  disabled = false,
  glass = false,
  haptic = true,
  animated = true,
  variant,
  style,
  containerStyle,
  onPress,
  ...props
}: RadioGroupItemProps) {
  const context = React.useContext(RadioGroupContext);
  const { colors, components, radii, spacing, isDark } = useTheme();
  const checked = context?.value === value;
  const isDisabled = disabled || Boolean(context?.disabled);
  const isHorizontal = context?.orientation === "horizontal";
  const itemVariant = variant ?? context?.variant ?? "card";
  const isPlain = itemVariant === "plain";

  const checkedProgress = useSharedValue(checked ? 1 : 0);
  const pressedProgress = useSharedValue(0);

  React.useEffect(() => {
    checkedProgress.value = animated
      ? withTiming(checked ? 1 : 0, { duration: 140 })
      : checked
        ? 1
        : 0;
  }, [animated, checked, checkedProgress]);

  const inactiveBg = glass
    ? isDark
      ? "rgba(15, 23, 42, 0.4)"
      : "rgba(255, 255, 255, 0.4)"
    : colors.surface;
  const activeBg = isDark
    ? "rgba(99, 102, 241, 0.18)"
    : "rgba(99, 102, 241, 0.08)";
  const inactiveBorder = glass
    ? isDark
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(15, 23, 42, 0.14)"
    : colors.border;
  const activeBorder = colors.primary;

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      checkedProgress.value,
      [0, 1],
      [inactiveBg, activeBg],
    ),
    borderColor: interpolateColor(
      checkedProgress.value,
      [0, 1],
      [inactiveBorder, activeBorder],
    ),
    transform: [
      { scale: animated ? 1 - pressedProgress.value * 0.015 : 1 },
    ],
  }));

  const dotAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkedProgress.value }],
    opacity: checkedProgress.value,
  }));

  const radioCircleAnimatedStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      checkedProgress.value,
      [0, 1],
      [colors.border, colors.primary],
    ),
  }));

  const handlePress = (e: GestureResponderEvent) => {
    if (isDisabled) return;
    if (haptic) triggerHaptic("selection");
    context?.onValueChange?.(value);
    onPress?.(e);
  };

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={handlePress}
      onPressIn={() => {
        if (!isDisabled && animated) {
          pressedProgress.value = withTiming(1, { duration: 80 });
        }
      }}
      onPressOut={() => {
        if (!isDisabled && animated) {
          pressedProgress.value = withTiming(0, { duration: 100 });
        }
      }}
      style={[
        isHorizontal ? { flex: 1 } : { width: "100%" },
        isPlain && isHorizontal ? { flex: 1 } : null,
        style,
      ]}
      {...props}
    >
      <Animated.View
        style={[
          isPlain
            ? {
                flexDirection: "row",
                alignItems: description ? "flex-start" : "center",
                gap: spacing.sm,
                paddingVertical: spacing.xs,
                paddingHorizontal: spacing.xs,
                opacity: isDisabled ? 0.5 : 1,
              }
            : {
                width: "100%",
                flexDirection: "row",
                alignItems: description ? "flex-start" : "center",
                gap: spacing.md,
                padding: spacing.md,
                borderWidth: components.borderWidth.strong,
                borderRadius: radii.xl,
                opacity: isDisabled ? 0.5 : 1,
              },
          !isPlain ? containerAnimatedStyle : null,
          containerStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              width: 20,
              height: 20,
              borderRadius: 10,
              borderWidth: components.borderWidth.focus,
              alignItems: "center",
              justifyContent: "center",
              marginTop: description ? 2 : 0,
            },
            radioCircleAnimatedStyle,
          ]}
        >
          <Animated.View
            style={[
              {
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: colors.primary,
              },
              dotAnimatedStyle,
            ]}
          />
        </Animated.View>

        <View style={{ flex: 1, gap: spacing.xs }}>
          {typeof label === "string" ? (
            <Text variant="label" color="text">
              {label}
            </Text>
          ) : (
            label
          )}

          {typeof description === "string" ? (
            <Text variant="bodySmall" color="textMuted">
              {description}
            </Text>
          ) : (
            description
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}
