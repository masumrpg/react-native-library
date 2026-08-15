"use strict";

import React from "react";
import { ActivityIndicator, Pressable } from "react-native";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { useTheme } from "../theme/index.js";
import { withAlpha } from "../utils/index.js";
import { Text } from "./Text.js";
import { renderIcon } from "./types.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function getToneColors(tone, colors) {
  if (tone === "primary") return {
    base: colors.primary,
    soft: colors.primarySoft,
    on: colors.onPrimary
  };
  if (tone === "secondary") return {
    base: colors.secondary,
    soft: colors.secondarySoft,
    on: colors.onSecondary
  };
  if (tone === "accent") return {
    base: colors.accent,
    soft: colors.accentSoft,
    on: colors.onAccent
  };
  if (tone === "success") return {
    base: colors.success,
    soft: colors.successSoft,
    on: colors.onSuccess
  };
  if (tone === "warning") return {
    base: colors.warning,
    soft: colors.warningSoft,
    on: colors.onWarning
  };
  if (tone === "danger") return {
    base: colors.danger,
    soft: colors.dangerSoft,
    on: colors.onDanger
  };
  return {
    base: colors.info,
    soft: colors.infoSoft,
    on: colors.onInfo
  };
}
export function FloatingActionButton({
  icon,
  label,
  extended = Boolean(label),
  size = "md",
  tone = "primary",
  variant = "filled",
  placement = "bottom-end",
  offset,
  visible = true,
  animated = true,
  loading,
  disabled,
  fullWidth,
  style,
  textStyle,
  onPressIn,
  onPressOut,
  ...props
}) {
  const {
    colors,
    components,
    radii,
    spacing,
    typography
  } = useTheme();
  const [mounted, setMounted] = React.useState(visible);
  const visibility = useSharedValue(visible ? 1 : 0);
  const press = useSharedValue(1);
  const isDisabled = disabled || loading;
  const toneColors = getToneColors(tone, colors);
  const fabTokens = components.floatingActionButton;
  const dimension = fabTokens.size[size];
  const iconSize = fabTokens.iconSize[size];
  const resolvedOffset = offset ?? spacing.lg;
  React.useEffect(() => {
    if (visible) {
      setMounted(true);
    }
    if (!animated) {
      visibility.value = visible ? 1 : 0;
      if (!visible) {
        setMounted(false);
      }
      return;
    }
    visibility.value = withTiming(visible ? 1 : 0, {
      duration: 180
    }, finished => {
      if (finished && !visible) {
        runOnJS(setMounted)(false);
      }
    });
  }, [animated, visible, visibility]);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: visibility.value,
    transform: [{
      scale: press.value * (0.88 + visibility.value * 0.12)
    }, {
      translateY: 8 * (1 - visibility.value)
    }]
  }));
  if (!mounted) {
    return null;
  }
  const backgroundColor = isDisabled ? colors.disabled : variant === "filled" ? toneColors.base : variant === "soft" ? toneColors.soft : variant === "outline" ? colors.surface : colors.transparent;
  const foregroundColor = isDisabled ? colors.disabledText : variant === "filled" ? toneColors.on : toneColors.base;
  const borderColor = isDisabled ? colors.disabled : variant === "outline" ? withAlpha(toneColors.base, 0.42) : colors.transparent;
  const placementStyle = placement === "none" ? {} : {
    position: "absolute",
    bottom: placement.startsWith("bottom") ? resolvedOffset : undefined,
    top: placement.startsWith("top") ? resolvedOffset : undefined,
    right: placement.endsWith("end") ? resolvedOffset : undefined,
    left: placement.endsWith("start") ? resolvedOffset : undefined,
    zIndex: 100
  };
  return /*#__PURE__*/_jsx(Animated.View, {
    style: [placementStyle, animated ? animatedStyle : undefined],
    children: /*#__PURE__*/_jsxs(Pressable, {
      accessibilityRole: "button",
      disabled: isDisabled,
      onPressIn: event => {
        if (animated) {
          press.value = withSpring(0.94, {
            damping: 16,
            stiffness: 260
          });
        }
        onPressIn?.(event);
      },
      onPressOut: event => {
        if (animated) {
          press.value = withSpring(1, {
            damping: 16,
            stiffness: 260
          });
        }
        onPressOut?.(event);
      },
      style: ({
        pressed
      }) => [{
        minWidth: extended ? undefined : dimension,
        width: fullWidth ? "100%" : undefined,
        height: dimension,
        paddingHorizontal: extended ? fabTokens.paddingX[size] : 0,
        borderRadius: radii.full,
        borderWidth: variant === "outline" ? components.borderWidth.strong : 0,
        borderColor,
        backgroundColor,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.sm,
        opacity: !animated && pressed && !isDisabled ? 0.78 : 1
      }, style],
      ...props,
      children: [loading ? /*#__PURE__*/_jsx(ActivityIndicator, {
        size: "small",
        color: foregroundColor
      }) : renderIcon(icon, foregroundColor, iconSize), extended && label ? typeof label === "string" ? /*#__PURE__*/_jsx(Text, {
        style: [typography.label, {
          color: foregroundColor
        }, textStyle],
        children: label
      }) : label : null]
    })
  });
}
//# sourceMappingURL=FloatingActionButton.js.map