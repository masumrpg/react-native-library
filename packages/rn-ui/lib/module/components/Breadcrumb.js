"use strict";

import React from "react";
import { Pressable, View } from "react-native";
import { useTheme } from "../theme/index.js";
import { Text } from "./Text.js";
import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
export function Breadcrumb({
  style,
  ...props
}) {
  const {
    spacing
  } = useTheme();
  return /*#__PURE__*/_jsx(View, {
    accessibilityRole: "text",
    style: [{
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: spacing.xs
    }, style],
    ...props
  });
}
export function BreadcrumbItem({
  style,
  ...props
}) {
  return /*#__PURE__*/_jsx(View, {
    style: [{
      flexDirection: "row",
      alignItems: "center"
    }, style],
    ...props
  });
}
export function BreadcrumbLink({
  children,
  disabled,
  ...props
}) {
  return /*#__PURE__*/_jsx(Pressable, {
    disabled: disabled,
    ...props,
    children: typeof children === "string" ? /*#__PURE__*/_jsx(Text, {
      variant: "bodySmall",
      color: disabled ? "text" : "primary",
      children: children
    }) : children
  });
}
export function BreadcrumbPage({
  children
}) {
  return typeof children === "string" ? /*#__PURE__*/_jsx(Text, {
    variant: "bodySmall",
    color: "text",
    children: children
  }) : /*#__PURE__*/_jsx(_Fragment, {
    children: children
  });
}
export function BreadcrumbSeparator({
  children = "/"
}) {
  return typeof children === "string" ? /*#__PURE__*/_jsx(Text, {
    variant: "bodySmall",
    color: "textSubtle",
    children: children
  }) : /*#__PURE__*/_jsx(_Fragment, {
    children: children
  });
}
//# sourceMappingURL=Breadcrumb.js.map