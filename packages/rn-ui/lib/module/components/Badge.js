"use strict";

import React from "react";
import { View } from "react-native";
import { useTheme } from "../theme/index.js";
import { renderIcon } from "./types.js";
import { Text } from "./Text.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function getBadgeColors(tone, colors) {
  const map = {
    primary: {
      solid: colors.primary,
      soft: colors.primarySoft,
      on: colors.onPrimary
    },
    secondary: {
      solid: colors.secondary,
      soft: colors.secondarySoft,
      on: colors.onSecondary
    },
    accent: {
      solid: colors.accent,
      soft: colors.accentSoft,
      on: colors.onAccent
    },
    success: {
      solid: colors.success,
      soft: colors.successSoft,
      on: colors.onSuccess
    },
    warning: {
      solid: colors.warning,
      soft: colors.warningSoft,
      on: colors.onWarning
    },
    danger: {
      solid: colors.danger,
      soft: colors.dangerSoft,
      on: colors.onDanger
    },
    info: {
      solid: colors.info,
      soft: colors.infoSoft,
      on: colors.onInfo
    }
  };
  return map[tone];
}
export function Badge({
  children,
  tone = "primary",
  variant = "soft",
  size = "md",
  icon,
  style
}) {
  const {
    colors,
    components,
    radii,
    spacing
  } = useTheme();
  const toneColors = getBadgeColors(tone, colors);
  const isSolid = variant === "solid";
  const iconSize = size === "lg" ? 14 : size === "sm" ? 10 : 12;
  return /*#__PURE__*/_jsxs(View, {
    style: [{
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      paddingHorizontal: size === "lg" ? spacing.md : spacing.sm,
      paddingVertical: size === "lg" ? spacing.xs : spacing.xxs,
      borderRadius: radii.full,
      backgroundColor: isSolid ? toneColors.solid : variant === "soft" ? toneColors.soft : colors.transparent,
      borderWidth: variant === "outline" ? components.borderWidth.default : 0,
      borderColor: variant === "outline" ? colors.border : colors.transparent
    }, style],
    children: [renderIcon(icon, isSolid ? toneColors.on : toneColors.solid, iconSize), /*#__PURE__*/_jsx(Text, {
      variant: "labelSmall",
      color: isSolid ? "textInverse" : "text",
      style: {
        color: isSolid ? toneColors.on : toneColors.solid
      },
      children: children
    })]
  });
}
//# sourceMappingURL=Badge.js.map