"use strict";

import React from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { useTheme } from "../theme/index.js";
import { withAlpha } from "../utils/index.js";
import { Text } from "./Text.js";
import { renderIcon } from "./types.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function getToneColor(tone, colors) {
  if (tone === "primary") return colors.primary;
  if (tone === "secondary") return colors.secondary;
  if (tone === "accent") return colors.accent;
  if (tone === "success") return colors.success;
  if (tone === "warning") return colors.warning;
  if (tone === "danger") return colors.danger;
  return colors.info;
}
function resolveColor(color, colors) {
  if (!color) return undefined;
  return color in colors ? colors[color] : color;
}
export function IconButton({
  icon,
  variant = "ghost",
  size = "md",
  tone = "primary",
  color,
  loading,
  disabled,
  badge,
  style,
  ...props
}) {
  const {
    colors,
    components
  } = useTheme();
  const base = resolveColor(color, colors) ?? getToneColor(tone, colors);
  const isDisabled = disabled || loading;
  const containerSize = components.iconButton.size[size];
  const iconSize = components.iconButton.iconSize[size];
  const badgeTokens = components.iconButton.badge;
  const backgroundColor = isDisabled ? colors.disabled : variant === "filled" ? base : variant === "soft" ? withAlpha(base, 0.12) : variant === "outline" ? colors.surface : colors.transparent;
  const iconColor = isDisabled ? colors.disabledText : variant === "filled" ? colors.onPrimary : variant === "ghost" ? colors.text : base;
  return /*#__PURE__*/_jsxs(Pressable, {
    accessibilityRole: "button",
    disabled: isDisabled,
    style: ({
      pressed
    }) => [{
      width: containerSize,
      height: containerSize,
      borderRadius: containerSize / 2,
      backgroundColor,
      borderColor: variant === "outline" ? colors.border : colors.transparent,
      borderWidth: variant === "outline" ? components.borderWidth.strong : 0,
      alignItems: "center",
      justifyContent: "center",
      opacity: pressed && !isDisabled ? 0.72 : 1
    }, style],
    ...props,
    children: [loading ? /*#__PURE__*/_jsx(ActivityIndicator, {
      color: iconColor
    }) : renderIcon(icon, iconColor, iconSize), !!badge && badge > 0 && /*#__PURE__*/_jsx(View, {
      style: {
        position: "absolute",
        top: badgeTokens.offset,
        right: badgeTokens.offset,
        minWidth: badgeTokens.minWidth,
        height: badgeTokens.size,
        paddingHorizontal: badgeTokens.paddingX,
        borderRadius: badgeTokens.size / 2,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.danger,
        borderWidth: badgeTokens.borderWidth,
        borderColor: colors.surface
      },
      children: /*#__PURE__*/_jsx(Text, {
        variant: "caption",
        color: "onDanger",
        weight: "700",
        style: {
          fontSize: badgeTokens.fontSize,
          lineHeight: badgeTokens.lineHeight
        },
        children: badge > 99 ? "99+" : String(badge)
      })
    })]
  });
}
//# sourceMappingURL=IconButton.js.map