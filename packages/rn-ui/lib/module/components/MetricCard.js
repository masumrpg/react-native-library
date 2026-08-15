"use strict";

import React from "react";
import { View } from "react-native";
import { useTheme } from "../theme/index.js";
import { Text } from "./Text.js";
import { renderIcon } from "./types.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function MetricCard({
  label,
  value,
  delta,
  icon,
  style,
  ...props
}) {
  const {
    colors,
    components,
    radii,
    spacing
  } = useTheme();
  return /*#__PURE__*/_jsxs(View, {
    style: [{
      borderWidth: components.borderWidth.strong,
      borderColor: colors.border,
      borderRadius: radii.xl,
      backgroundColor: colors.surface,
      padding: spacing.lg,
      gap: spacing.md
    }, style],
    ...props,
    children: [/*#__PURE__*/_jsxs(View, {
      style: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: spacing.md
      },
      children: [typeof label === "string" ? /*#__PURE__*/_jsx(Text, {
        variant: "bodySmall",
        color: "textMuted",
        children: label
      }) : label, renderIcon(icon, colors.primary, components.metricCard.iconSize)]
    }), typeof value === "string" || typeof value === "number" ? /*#__PURE__*/_jsx(Text, {
      variant: "h3",
      children: value
    }) : value, delta ? typeof delta === "string" ? /*#__PURE__*/_jsx(Text, {
      variant: "caption",
      color: "success",
      children: delta
    }) : delta : null]
  });
}
//# sourceMappingURL=MetricCard.js.map