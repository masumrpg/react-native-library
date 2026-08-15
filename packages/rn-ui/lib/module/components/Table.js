"use strict";

import React from "react";
import { ScrollView, View } from "react-native";
import { useTheme } from "../theme/index.js";
import { Text } from "./Text.js";
import { jsx as _jsx } from "react/jsx-runtime";
export function Table({
  horizontal = true,
  style,
  children,
  ...props
}) {
  const {
    colors,
    components,
    radii
  } = useTheme();
  const table = /*#__PURE__*/_jsx(View, {
    style: [{
      borderWidth: components.borderWidth.strong,
      borderColor: colors.border,
      borderRadius: radii.lg,
      overflow: "hidden"
    }, style],
    ...props,
    children: children
  });
  return horizontal ? /*#__PURE__*/_jsx(ScrollView, {
    horizontal: true,
    showsHorizontalScrollIndicator: false,
    children: table
  }) : table;
}
export function TableRow({
  style,
  ...props
}) {
  return /*#__PURE__*/_jsx(View, {
    style: [{
      flexDirection: "row"
    }, style],
    ...props
  });
}
export function TableHead({
  children,
  style,
  ...props
}) {
  const {
    colors,
    components,
    spacing
  } = useTheme();
  return /*#__PURE__*/_jsx(View, {
    style: [{
      minWidth: components.table.minColumnWidth,
      padding: spacing.md,
      borderBottomWidth: components.borderWidth.default,
      borderBottomColor: colors.borderMuted
    }, style],
    ...props,
    children: typeof children === "string" ? /*#__PURE__*/_jsx(Text, {
      variant: "labelSmall",
      children: children
    }) : children
  });
}
export function TableCell({
  children,
  style,
  ...props
}) {
  const {
    colors,
    components,
    spacing
  } = useTheme();
  return /*#__PURE__*/_jsx(View, {
    style: [{
      minWidth: components.table.minColumnWidth,
      padding: spacing.md,
      borderTopWidth: components.borderWidth.default,
      borderTopColor: colors.borderMuted
    }, style],
    ...props,
    children: typeof children === "string" ? /*#__PURE__*/_jsx(Text, {
      variant: "bodySmall",
      children: children
    }) : children
  });
}
//# sourceMappingURL=Table.js.map