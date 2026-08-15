"use strict";

import React from "react";
import { Pressable, View } from "react-native";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useTheme } from "../theme/index.js";
import { renderIcon } from "./types.js";
import { Text } from "./Text.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function getToneColors(tone, colors) {
  if (tone === "primary") return {
    base: colors.primary,
    soft: colors.primarySoft,
    on: colors.onPrimary
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
  if (tone === "info") return {
    base: colors.info,
    soft: colors.infoSoft,
    on: colors.onInfo
  };
  return {
    base: colors.secondary,
    soft: colors.secondarySoft,
    on: colors.onSecondary
  };
}
function renderTextContent(content, fallbackStyle) {
  if (typeof content === "string") {
    return /*#__PURE__*/_jsx(Text, {
      style: fallbackStyle,
      children: content
    });
  }
  return content;
}
export function Alert({
  title,
  children,
  tone = "info",
  variant = "soft",
  icon,
  action,
  dismissible = false,
  animated = true,
  animationDuration = 180,
  onClose,
  closeIcon,
  style,
  contentStyle,
  titleStyle,
  textStyle
}) {
  const {
    colors,
    components,
    radii,
    spacing
  } = useTheme();
  const [visible, setVisible] = React.useState(true);
  const progress = useSharedValue(1);
  const toneColors = getToneColors(tone, colors);
  const isSolid = variant === "solid";
  const backgroundColor = variant === "solid" ? toneColors.base : variant === "soft" ? toneColors.soft : colors.surface;
  const foregroundColor = isSolid ? toneColors.on : toneColors.base;
  const bodyColor = isSolid ? toneColors.on : colors.textMuted;
  const borderColor = variant === "outline" ? toneColors.base : toneColors.base;
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{
      scale: 0.98 + progress.value * 0.02
    }]
  }));
  const handleClose = () => {
    if (dismissible && animated) {
      progress.value = withTiming(0, {
        duration: animationDuration
      }, finished => {
        if (finished) {
          runOnJS(setVisible)(false);
        }
      });
    } else if (dismissible) {
      setVisible(false);
    }
    onClose?.();
  };
  const container = /*#__PURE__*/_jsxs(View, {
    accessibilityRole: "alert",
    style: [{
      backgroundColor,
      borderColor,
      borderWidth: components.borderWidth.strong,
      borderRadius: radii.xl,
      padding: spacing.lg,
      flexDirection: "row",
      gap: spacing.md
    }, style],
    children: [renderIcon(icon, foregroundColor, 20), /*#__PURE__*/_jsxs(View, {
      style: [{
        flex: 1,
        gap: spacing.xs
      }, contentStyle],
      children: [title ? renderTextContent(title, [{
        color: isSolid ? toneColors.on : colors.text
      }, titleStyle]) : null, children ? renderTextContent(children, [{
        color: bodyColor
      }, textStyle]) : null, action ? /*#__PURE__*/_jsxs(Pressable, {
        accessibilityRole: "button",
        onPress: action.onPress,
        style: ({
          pressed
        }) => ({
          alignSelf: "flex-start",
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.xs,
          marginTop: spacing.xs,
          opacity: pressed ? 0.72 : 1
        }),
        children: [renderIcon(action.icon, foregroundColor, 14), /*#__PURE__*/_jsx(Text, {
          variant: "labelSmall",
          style: {
            color: foregroundColor
          },
          children: action.label
        })]
      }) : null]
    }), dismissible || onClose ? /*#__PURE__*/_jsx(Pressable, {
      accessibilityRole: "button",
      accessibilityLabel: "Close alert",
      onPress: handleClose,
      style: ({
        pressed
      }) => ({
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        opacity: pressed ? 0.72 : 1
      }),
      children: closeIcon ? renderIcon(closeIcon, foregroundColor, 16) : /*#__PURE__*/_jsx(Text, {
        variant: "label",
        style: {
          color: foregroundColor
        },
        children: "x"
      })
    }) : null]
  });
  if (!visible) {
    return null;
  }
  if (animated) {
    return /*#__PURE__*/_jsx(Animated.View, {
      style: animatedStyle,
      children: container
    });
  }
  return container;
}
//# sourceMappingURL=Alert.js.map