"use strict";

import React from "react";
import { View } from "react-native";
import { useTheme } from "../theme/index.js";
import { Button } from "./Button.js";
import { Text } from "./Text.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Pagination({
  page,
  pageCount,
  onPageChange,
  previousLabel = "Prev",
  nextLabel = "Next",
  style,
  ...props
}) {
  const {
    spacing
  } = useTheme();
  const safePage = Math.min(pageCount, Math.max(1, page));
  return /*#__PURE__*/_jsxs(View, {
    style: [{
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm
    }, style],
    ...props,
    children: [/*#__PURE__*/_jsx(Button, {
      size: "sm",
      variant: "outline",
      tone: "secondary",
      disabled: safePage <= 1,
      onPress: () => onPageChange?.(safePage - 1),
      children: previousLabel
    }), /*#__PURE__*/_jsxs(Text, {
      variant: "labelSmall",
      color: "textMuted",
      style: {
        fontVariant: ["tabular-nums"]
      },
      children: [safePage, " / ", pageCount]
    }), /*#__PURE__*/_jsx(Button, {
      size: "sm",
      variant: "outline",
      tone: "secondary",
      disabled: safePage >= pageCount,
      onPress: () => onPageChange?.(safePage + 1),
      children: nextLabel
    })]
  });
}
//# sourceMappingURL=Pagination.js.map