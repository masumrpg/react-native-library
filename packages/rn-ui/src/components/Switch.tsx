import React from "react";
import {
  Pressable,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
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
import {
  renderIcon,
  type RenderIcon,
  type BaseGlassProps,
  type BaseHapticProps,
} from "./types";

export type SwitchSize = "sm" | "md" | "lg";
export type SwitchTone =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info";

export interface SwitchRenderThumbParams {
  checked: boolean;
  disabled: boolean;
  invalid: boolean;
  color: string;
  size: number;
}

export type SwitchThumbContent =
  | React.ReactNode
  | ((params: SwitchRenderThumbParams) => React.ReactNode);

export interface SwitchProps
  extends Omit<PressableProps, "onPress" | "style" | "children">,
    BaseGlassProps,
    BaseHapticProps {
  value?: boolean;
  defaultValue?: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  invalid?: boolean;
  size?: SwitchSize;
  tone?: SwitchTone;
  style?: StyleProp<ViewStyle>;
  trackStyle?: StyleProp<ViewStyle>;
  thumbStyle?: StyleProp<ViewStyle>;
  activeIcon?: RenderIcon;
  inactiveIcon?: RenderIcon;
  thumbContent?: SwitchThumbContent;
  activeThumbContent?: SwitchThumbContent;
  inactiveThumbContent?: SwitchThumbContent;
  renderThumb?: (params: SwitchRenderThumbParams) => React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
}

export function Switch({
  value,
  defaultValue = false,
  onValueChange,
  disabled = false,
  invalid = false,
  size = "md",
  tone = "primary",
  glass = false,
  haptic = true,
  style,
  trackStyle,
  thumbStyle,
  activeIcon,
  inactiveIcon,
  thumbContent,
  activeThumbContent,
  inactiveThumbContent,
  renderThumb,
  onPress,
  onPressIn,
  onPressOut,
  accessibilityLabel,
  ...props
}: SwitchProps) {
  const { colors, components, radii, isDark } = useTheme();
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState(defaultValue);
  const checked = isControlled ? value : uncontrolledValue;
  const progress = useSharedValue(checked ? 1 : 0);
  const pressed = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withSpring(checked ? 1 : 0, {
      damping: 16,
      stiffness: 240,
      mass: 0.8,
    });
  }, [checked, progress]);

  const activeColor = invalid ? colors.danger : colors[tone];
  const thumbIcon = checked ? activeIcon : inactiveIcon;
  const selectedThumbContent =
    (checked ? activeThumbContent : inactiveThumbContent) ?? thumbContent;
  const width = components.switch.width[size];
  const height = components.switch.height[size];
  const thumbSize = components.switch.thumbSize[size];
  const iconSize = components.switch.iconSize[size];
  const borderWidth = components.borderWidth.focus;
  const inset = (height - thumbSize) / 2;
  const travel = width - thumbSize - (inset + borderWidth) * 2;

  const glassBg = isDark
    ? "rgba(15, 27, 45, 0.60)"
    : "rgba(255, 255, 255, 0.70)";

  const inactiveTrackColor = disabled
    ? colors.disabled
    : glass
      ? glassBg
      : isDark
        ? "rgba(30, 41, 59, 0.90)"
        : colors.backgroundMuted;

  const activeTrackColor = disabled ? colors.disabled : activeColor;

  const inactiveBorderColor = invalid
    ? colors.danger
    : glass
      ? isDark
        ? "rgba(248, 250, 252, 0.20)"
        : "rgba(15, 23, 42, 0.14)"
      : isDark
        ? "rgba(148, 163, 184, 0.30)"
        : colors.border;

  const activeBorderColor = invalid ? colors.danger : activeColor;

  // Crisp white/light-slate knob for OFF state in both dark & light mode
  const inactiveThumbColor = disabled
    ? colors.disabledText
    : isDark
      ? "#e2e8f0"
      : "#ffffff";

  const activeThumbColor = disabled ? colors.disabledText : "#ffffff";

  const handlePress = (event: GestureResponderEvent) => {
    onPress?.(event);
    if (disabled) return;

    if (haptic) triggerHaptic("selection");
    const nextValue = !checked;
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }
    onValueChange?.(nextValue);
  };

  const handlePressIn = (event: GestureResponderEvent) => {
    onPressIn?.(event);
    pressed.value = withTiming(1, { duration: 120 });
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    onPressOut?.(event);
    pressed.value = withTiming(0, { duration: 140 });
  };

  const trackAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [inactiveTrackColor, activeTrackColor],
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [inactiveBorderColor, activeBorderColor],
    ),
  }));

  const thumbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: progress.value * travel },
      { scale: 1 + pressed.value * 0.06 },
    ],
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [inactiveThumbColor, activeThumbColor],
    ),
  }));

  const iconColor = checked
    ? invalid
      ? colors.danger
      : activeColor
    : colors.textSubtle;

  const thumbContentParams: SwitchRenderThumbParams = {
    checked,
    disabled,
    invalid,
    color: iconColor,
    size: iconSize,
  };
  const renderedThumbContent =
    typeof selectedThumbContent === "function"
      ? selectedThumbContent(thumbContentParams)
      : selectedThumbContent;

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={({ pressed: isPressed }) => [
        {
          opacity: disabled ? 0.45 : isPressed ? 0.9 : 1,
          alignSelf: "flex-start",
        },
        style,
      ]}
      {...props}
    >
      <Animated.View
        style={[
          {
            width,
            height,
            borderRadius: radii.full,
            borderWidth,
            padding: inset,
            justifyContent: "center",
          },
          trackAnimatedStyle,
          trackStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: radii.full,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: components.borderWidth.default,
              borderColor: checked ? activeColor : "transparent",
            },
            thumbAnimatedStyle,
            thumbStyle,
          ]}
        >
          {renderThumb
            ? renderThumb(thumbContentParams)
            : renderedThumbContent
              ? renderedThumbContent
              : thumbIcon
                ? renderIcon(thumbIcon, iconColor, iconSize)
                : null}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}
