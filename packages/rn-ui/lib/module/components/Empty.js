"use strict";

import React from "react";
import { View } from "react-native";
import { useTheme } from "../theme/index.js";
import { Text } from "./Text.js";
import { jsx as _jsx } from "react/jsx-runtime";
export function Empty({
  bordered = false,
  style,
  ...props
}) {
  const {
    colors,
    components,
    radii,
    spacing
  } = useTheme();
  return /*#__PURE__*/_jsx(View, {
    style: [{
      width: "100%",
      minWidth: 0,
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.lg,
      borderRadius: radii.xl,
      borderWidth: bordered ? components.borderWidth.strong : 0,
      borderStyle: bordered ? "dashed" : "solid",
      borderColor: bordered ? colors.border : colors.transparent,
      padding: spacing.xxl
    }, style],
    ...props
  });
}
export function EmptyHeader({
  style,
  ...props
}) {
  const {
    spacing
  } = useTheme();
  return /*#__PURE__*/_jsx(View, {
    style: [{
      width: "100%",
      maxWidth: 320,
      alignItems: "center",
      gap: spacing.sm
    }, style],
    ...props
  });
}
export function EmptyMedia({
  variant = "default",
  style,
  ...props
}) {
  const {
    colors,
    radii,
    spacing
  } = useTheme();
  const isIcon = variant === "icon";
  return /*#__PURE__*/_jsx(View, {
    style: [{
      marginBottom: spacing.xs,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      width: isIcon ? 32 : undefined,
      height: isIcon ? 32 : undefined,
      borderRadius: isIcon ? radii.lg : undefined,
      backgroundColor: isIcon ? colors.backgroundMuted : colors.transparent
    }, style],
    ...props
  });
}
export function EmptyTitle({
  children,
  style
}) {
  return /*#__PURE__*/_jsx(Text, {
    variant: "label",
    align: "center",
    style: style,
    children: children
  });
}
export function EmptyDescription({
  children,
  style
}) {
  return /*#__PURE__*/_jsx(Text, {
    variant: "bodySmall",
    color: "textMuted",
    align: "center",
    style: style,
    children: children
  });
}
export function EmptyContent({
  style,
  ...props
}) {
  const {
    spacing
  } = useTheme();
  return /*#__PURE__*/_jsx(View, {
    style: [{
      width: "100%",
      maxWidth: 320,
      minWidth: 0,
      alignItems: "center",
      gap: spacing.sm
    }, style],
    ...props
  });
}
//# sourceMappingURL=Empty.js.map