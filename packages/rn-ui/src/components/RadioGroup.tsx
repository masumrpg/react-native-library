import React from "react";
import {
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "../theme";
import { triggerHaptic } from "../utils/haptics";
import { Text } from "./Text";
import type { BaseGlassProps, BaseHapticProps, BaseAnimatedProps } from "./types";

export interface RadioGroupContextValue {
  value?: string;
  disabled: boolean;
  onValueChange?: (value: string) => void;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
  null,
);

export interface RadioGroupProps extends ViewProps {
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

export function RadioGroup({
  value,
  defaultValue,
  disabled = false,
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
    () => ({ value: currentValue, disabled, onValueChange: handleValueChange }),
    [currentValue, disabled, handleValueChange],
  );

  return (
    <RadioGroupContext.Provider value={context}>
      <View
        accessibilityRole="radiogroup"
        style={[{ gap: spacing.sm, width: "100%" }, style]}
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
  style?: StyleProp<ViewStyle>;
}

export function RadioGroupItem({
  value,
  label,
  description,
  disabled = false,
  glass = false,
  haptic = true,
  animated = true,
  style,
  onPress,
  ...props
}: RadioGroupItemProps) {
  const context = React.useContext(RadioGroupContext);
  const { colors, components, radii, spacing, typography, isDark } = useTheme();
  const checked = context?.value === value;
  const isDisabled = disabled || Boolean(context?.disabled);

  const checkedProgress = useSharedValue(checked ? 1 : 0);
  const pressedProgress = useSharedValue(0);

  React.useEffect(() => {
    checkedProgress.value = withSpring(checked ? 1 : 0, {
      damping: 15,
      stiffness: 220,
      mass: 0.7,
    });
  }, [checked, checkedProgress]);

  const glassBg = isDark
    ? "rgba(15, 27, 45, 0.60)"
    : "rgba(255, 255, 255, 0.75)";

  const inactiveBg = glass ? glassBg : colors.surface;
  const activeBg = colors.primarySoft;

  const inactiveBorder = glass
    ? isDark
      ? "rgba(248, 250, 252, 0.20)"
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
      { scale: animated ? 1 - pressedProgress.value * 0.02 : 1 },
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

  const handlePress = (e: any) => {
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
          pressedProgress.value = withTiming(1, { duration: 100 });
        }
      }}
      onPressOut={() => {
        if (!isDisabled && animated) {
          pressedProgress.value = withTiming(0, { duration: 120 });
        }
      }}
      style={{ width: "100%" }}
      {...props}
    >
      <Animated.View
        style={[
          {
            width: "100%",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: spacing.md,
            padding: spacing.md,
            borderWidth: components.borderWidth.strong,
            borderRadius: radii.xl,
            opacity: isDisabled ? 0.5 : 1,
          },
          containerAnimatedStyle,
          style,
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
              marginTop: 2,
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
            <Text style={[typography.bodySmall, { color: colors.textMuted }]}>
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
