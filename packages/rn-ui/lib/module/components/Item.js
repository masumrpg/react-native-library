"use strict";

import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../theme/index.js";
import { jsx as _jsx } from "react/jsx-runtime";
export function ItemGroup({
  size = "default",
  style,
  ...props
}) {
  const {
    spacing
  } = useTheme();
  const gap = size === "xs" ? spacing.sm : size === "sm" ? spacing.md : spacing.lg;
  return /*#__PURE__*/_jsx(View, {
    accessibilityRole: "list",
    style: [{
      width: "100%",
      gap
    }, style],
    ...props
  });
}
export function ItemSeparator({
  style,
  ...props
}) {
  const {
    colors,
    spacing
  } = useTheme();
  return /*#__PURE__*/_jsx(View, {
    style: [{
      height: 1,
      width: "100%",
      marginVertical: spacing.sm,
      backgroundColor: colors.divider
    }, style],
    ...props
  });
}
export function Item({
  variant = "default",
  size = "default",
  disabled,
  style,
  ...props
}) {
  const {
    colors,
    radii,
    spacing
  } = useTheme();
  const paddingX = size === "xs" ? spacing.md : spacing.lg;
  const paddingY = size === "xs" ? spacing.sm : spacing.md;
  const gap = size === "xs" ? spacing.sm : spacing.md;
  const isDisabled = Boolean(disabled);
  return /*#__PURE__*/_jsx(Pressable, {
    accessibilityRole: props.onPress ? "button" : undefined,
    accessibilityState: {
      disabled: isDisabled
    },
    disabled: isDisabled,
    style: ({
      pressed
    }) => [{
      width: "100%",
      minHeight: size === "xs" ? 40 : 48,
      paddingHorizontal: paddingX,
      paddingVertical: paddingY,
      borderRadius: radii.lg,
      borderWidth: variant === "outline" ? 1.25 : 1.25,
      borderColor: variant === "outline" ? colors.border : colors.transparent,
      backgroundColor: variant === "muted" ? colors.surfaceMuted : colors.transparent,
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap,
      opacity: isDisabled ? 0.5 : pressed ? 0.78 : 1
    }, typeof style === "function" ? style({
      pressed
    }) : style],
    ...props
  });
}
export function ItemMedia({
  variant = "default",
  size = "default",
  style,
  ...props
}) {
  const {
    colors,
    radii
  } = useTheme();
  const imageSize = size === "xs" ? 24 : size === "sm" ? 32 : 40;
  return /*#__PURE__*/_jsx(View, {
    style: [{
      width: variant === "image" ? imageSize : undefined,
      height: variant === "image" ? imageSize : undefined,
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",
      overflow: variant === "image" ? "hidden" : undefined,
      borderRadius: variant === "image" ? radii.sm : undefined,
      backgroundColor: variant === "image" ? colors.backgroundMuted : colors.transparent
    }, style],
    ...props
  });
}
export function ItemContent({
  style,
  ...props
}) {
  const {
    spacing
  } = useTheme();
  return /*#__PURE__*/_jsx(View, {
    style: [{
      flex: 1,
      minWidth: 0,
      gap: spacing.xs
    }, style],
    ...props
  });
}
export function ItemTitle({
  style,
  ...props
}) {
  const {
    colors,
    typography
  } = useTheme();
  return /*#__PURE__*/_jsx(Text, {
    numberOfLines: 1,
    style: [typography.label, {
      color: colors.text
    }, style],
    ...props
  });
}
export function ItemDescription({
  style,
  ...props
}) {
  const {
    colors,
    typography
  } = useTheme();
  return /*#__PURE__*/_jsx(Text, {
    numberOfLines: 2,
    style: [typography.bodySmall, {
      color: colors.textMuted
    }, style],
    ...props
  });
}
export function ItemActions({
  style,
  ...props
}) {
  const {
    spacing
  } = useTheme();
  return /*#__PURE__*/_jsx(View, {
    style: [{
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm
    }, style],
    ...props
  });
}
export function ItemHeader({
  style,
  ...props
}) {
  const {
    spacing
  } = useTheme();
  return /*#__PURE__*/_jsx(View, {
    style: [{
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm
    }, style],
    ...props
  });
}
export function ItemFooter({
  style,
  ...props
}) {
  const {
    spacing
  } = useTheme();
  return /*#__PURE__*/_jsx(View, {
    style: [{
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm
    }, style],
    ...props
  });
}
//# sourceMappingURL=Item.js.map