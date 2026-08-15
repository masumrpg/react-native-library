"use strict";

import React from "react";
import { View } from "react-native";
import { useTheme } from "../theme/index.js";
import { Text } from "./Text.js";
import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
export function DataList({
  style,
  ...props
}) {
  const {
    spacing
  } = useTheme();
  return /*#__PURE__*/_jsx(View, {
    style: [{
      width: "100%",
      gap: spacing.sm
    }, style],
    ...props
  });
}
export function DataListItem({
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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: components.borderWidth.default,
      borderBottomColor: colors.borderMuted
    }, style],
    ...props
  });
}
export function DataListLabel({
  children
}) {
  return typeof children === "string" ? /*#__PURE__*/_jsx(Text, {
    variant: "bodySmall",
    color: "textMuted",
    children: children
  }) : /*#__PURE__*/_jsx(_Fragment, {
    children: children
  });
}
export function DataListValue({
  children
}) {
  return typeof children === "string" ? /*#__PURE__*/_jsx(Text, {
    variant: "label",
    color: "text",
    align: "right",
    children: children
  }) : /*#__PURE__*/_jsx(_Fragment, {
    children: children
  });
}
//# sourceMappingURL=DataList.js.map