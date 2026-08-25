import React, { useEffect } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "../theme";
import { withAlpha } from "../utils/color";
import { triggerHaptic } from "../utils/haptics";
import { renderIcon, type ComponentSize, type ComponentTone, type RenderIcon } from "./types";
import { Text } from "./Text";

export type ChipVariant = "filled" | "outline" | "soft";

export interface ChipProps {
  label: string;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  onPress?: () => void;
  onClose?: () => void;
  icon?: RenderIcon;
  rightIcon?: RenderIcon;
  variant?: ChipVariant;
  size?: ComponentSize;
  tone?: ComponentTone;
  disabled?: boolean;
  hapticFeedback?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Filter, input, action, and suggestion Chip / Tag component with Reanimated spring physics
 */
export function Chip({
  label,
  selected = false,
  onSelect,
  onPress,
  onClose,
  icon,
  rightIcon,
  variant = "soft",
  size = "md",
  tone = "primary",
  disabled = false,
  hapticFeedback = true,
  style,
  textStyle,
}: ChipProps) {
  const { colors, radii } = useTheme();

  const isInteractive = Boolean(onPress || onSelect || onClose);
  const isSelectable = onSelect !== undefined;

  const pressed = useSharedValue(0);
  const selectProgress = useSharedValue(selected ? 1 : 0);
  const isDismissing = useSharedValue(1);

  useEffect(() => {
    selectProgress.value = withSpring(selected ? 1 : 0, {
      damping: 18,
      stiffness: 240,
    });
  }, [selectProgress, selected]);

  const handlePress = () => {
    if (disabled) return;
    if (hapticFeedback) {
      triggerHaptic("selection");
    }
    if (isSelectable) {
      onSelect?.(!selected);
    }
    onPress?.();
  };

  const handleClose = () => {
    if (disabled) return;
    if (hapticFeedback) {
      triggerHaptic("selection");
    }
    isDismissing.value = withTiming(0, { duration: 160 });
    setTimeout(() => {
      onClose?.();
    }, 160);
  };

  const toneColor = tone && tone !== "default" ? colors[tone] : colors.primary;

  const height = size === "sm" ? 28 : size === "lg" ? 40 : 34;
  const paddingHorizontal = size === "sm" ? 10 : size === "lg" ? 16 : 12;
  const fontSize = size === "sm" ? 12 : size === "lg" ? 14 : 13;
  const iconSize = size === "sm" ? 13 : size === "lg" ? 17 : 15;

  let backgroundColor = colors.surface;
  let textColor = colors.text;
  let borderColor = "transparent";
  let borderWidth = 0;

  if (variant === "filled") {
    if (selected) {
      backgroundColor = toneColor;
      textColor = "#FFFFFF";
    } else {
      backgroundColor = colors.backgroundMuted;
      textColor = colors.text;
    }
  } else if (variant === "outline") {
    borderWidth = 1;
    if (selected) {
      borderColor = toneColor;
      backgroundColor = withAlpha(toneColor, 0.12);
      textColor = toneColor;
    } else {
      borderColor = colors.border;
      backgroundColor = colors.transparent;
      textColor = colors.text;
    }
  } else {
    // Soft / Tonal variant
    if (selected) {
      backgroundColor = withAlpha(toneColor, 0.22);
      textColor = toneColor;
      borderWidth = StyleSheet.hairlineWidth;
      borderColor = withAlpha(toneColor, 0.4);
    } else {
      backgroundColor = colors.backgroundMuted;
      textColor = colors.text;
      borderWidth = StyleSheet.hairlineWidth;
      borderColor = colors.border;
    }
  }

  const animatedChipStyle = useAnimatedStyle(() => ({
    transform: [{ scale: (1 - pressed.value * 0.05) * isDismissing.value }],
    opacity: isDismissing.value,
  }));

  const checkmarkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: selectProgress.value }],
    opacity: selectProgress.value,
  }));

  return (
    <Animated.View style={[animatedChipStyle, { alignSelf: "flex-start" }]}>
      <Pressable
        disabled={disabled || !isInteractive}
        onPress={handlePress}
        onPressIn={() => {
          pressed.value = withTiming(1, { duration: 80 });
        }}
        onPressOut={() => {
          pressed.value = withTiming(0, { duration: 120 });
        }}
        style={[
          {
            height,
            paddingHorizontal,
            borderRadius: radii.full,
            backgroundColor,
            borderWidth,
            borderColor,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            opacity: disabled ? 0.45 : 1,
          },
          style,
        ]}
      >
        {/* Optional Left Icon */}
        {icon && renderIcon(icon, textColor, iconSize)}

        {/* Selected Checkmark with spring scale */}
        {selected && !icon && (
          <Animated.View style={checkmarkAnimatedStyle}>
            <Svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke={textColor}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Path d="M20 6L9 17l-5-5" />
            </Svg>
          </Animated.View>
        )}

        {/* Chip Label */}
        <Text
          style={[
            {
              fontSize,
              fontWeight: selected ? "600" : "500",
              color: textColor,
            },
            textStyle,
          ]}
        >
          {label}
        </Text>

        {/* Optional Right Icon */}
        {rightIcon && renderIcon(rightIcon, textColor, iconSize)}

        {/* Dismiss / Remove Icon */}
        {onClose && (
          <Pressable
            hitSlop={8}
            disabled={disabled}
            onPress={handleClose}
            style={{
              marginLeft: 2,
              padding: 2,
              borderRadius: radii.full,
            }}
          >
            <Svg
              width={iconSize - 1}
              height={iconSize - 1}
              viewBox="0 0 24 24"
              fill="none"
              stroke={textColor}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Path d="M18 6L6 18M6 6l12 12" />
            </Svg>
          </Pressable>
        )}
      </Pressable>
    </Animated.View>
  );
}

export const Tag = Chip;
export type TagProps = ChipProps;
