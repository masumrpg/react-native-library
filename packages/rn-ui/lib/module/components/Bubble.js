"use strict";

import React, { createContext, useContext } from "react";
import { Pressable, View } from "react-native";
import { useTheme } from "../theme/index.js";
import { Text } from "./Text.js";
import { jsx as _jsx } from "react/jsx-runtime";
const BubbleContext = /*#__PURE__*/createContext(null);
function useBubbleContext() {
  const context = useContext(BubbleContext);
  if (!context) {
    throw new Error("Bubble components must be rendered within a Bubble provider");
  }
  return context;
}
export function BubbleGroup({
  style,
  children,
  ...props
}) {
  const {
    spacing
  } = useTheme();
  const groupStyle = {
    flexDirection: "column",
    gap: spacing.sm,
    // 8px (gap-2)
    width: "100%"
  };
  return /*#__PURE__*/_jsx(View, {
    style: [groupStyle, style],
    ...props,
    children: children
  });
}
export function Bubble({
  variant = "default",
  align = "start",
  style,
  children,
  ...props
}) {
  const bubbleStyle = {
    alignSelf: align === "end" ? "flex-end" : "flex-start",
    maxWidth: variant === "ghost" ? "100%" : "80%",
    position: "relative",
    flexDirection: "column",
    gap: 4 // gap-1
  };
  return /*#__PURE__*/_jsx(BubbleContext.Provider, {
    value: {
      variant,
      align
    },
    children: /*#__PURE__*/_jsx(View, {
      style: [bubbleStyle, style],
      ...props,
      children: children
    })
  });
}
export function BubbleContent({
  style,
  textStyle,
  onPress,
  children,
  ...props
}) {
  const {
    variant,
    align
  } = useBubbleContext();
  const {
    colors,
    components,
    radii,
    spacing
  } = useTheme();

  // Get themed color mapping for variant
  const colorsMap = getVariantColors(variant, colors);
  const containerStyle = {
    paddingHorizontal: spacing.md,
    // px-3 (12px)
    paddingVertical: spacing.sm + 2,
    // py-2.5 (10px)
    borderRadius: radii.xl + 4,
    // rounded-3xl (~20-24px)
    borderWidth: variant === "outline" ? components.borderWidth.default : 0,
    borderColor: colorsMap.border,
    backgroundColor: colorsMap.bg,
    alignSelf: align === "end" ? "flex-end" : "flex-start"
  };
  const isGhost = variant === "ghost";
  const finalContainerStyle = isGhost ? {
    borderWidth: 0,
    backgroundColor: "transparent",
    borderRadius: 0,
    paddingHorizontal: 0,
    paddingVertical: 0
  } : containerStyle;
  if (onPress) {
    return /*#__PURE__*/_jsx(Pressable, {
      onPress: onPress,
      style: ({
        pressed
      }) => [finalContainerStyle, {
        opacity: pressed ? 0.8 : 1
      }, style],
      ...props,
      children: typeof children === "string" ? /*#__PURE__*/_jsx(Text, {
        style: [{
          color: colorsMap.text,
          fontSize: 14,
          lineHeight: 20
        }, textStyle],
        children: children
      }) : children
    });
  }
  return /*#__PURE__*/_jsx(View, {
    style: [finalContainerStyle, style],
    ...props,
    children: typeof children === "string" ? /*#__PURE__*/_jsx(Text, {
      style: [{
        color: colorsMap.text,
        fontSize: 14,
        lineHeight: 20
      }, textStyle],
      children: children
    }) : children
  });
}
export function BubbleReactions({
  side = "bottom",
  align = "end",
  style,
  children,
  ...props
}) {
  const {
    colors,
    components,
    radii,
    spacing
  } = useTheme();
  const reactionStyle = {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
    backgroundColor: colors.backgroundMuted,
    borderRadius: radii.full,
    borderWidth: components.borderWidth.focus,
    borderColor: colors.surface,
    // ring-card
    paddingHorizontal: spacing.xs + 2,
    // px-1.5
    paddingVertical: spacing.xxs + 1,
    // py-0.5
    zIndex: 10,
    ...(side === "top" ? {
      top: -12
    } : {
      bottom: -12
    }),
    ...(align === "start" ? {
      left: 12
    } : {
      right: 12
    })
  };
  return /*#__PURE__*/_jsx(View, {
    style: [reactionStyle, style],
    ...props,
    children: children
  });
}

// Helper to resolve themed background, text, and border colors based on Bubble variant
function getVariantColors(variant, colors) {
  switch (variant) {
    case "secondary":
      return {
        bg: colors.secondarySoft,
        text: colors.text,
        border: "transparent"
      };
    case "muted":
      return {
        bg: colors.backgroundMuted,
        text: colors.textMuted,
        border: "transparent"
      };
    case "tinted":
      return {
        bg: colors.primarySoft,
        text: colors.primary,
        border: "transparent"
      };
    case "outline":
      return {
        bg: colors.background,
        text: colors.text,
        border: colors.border
      };
    case "ghost":
      return {
        bg: "transparent",
        text: colors.text,
        border: "transparent"
      };
    case "destructive":
      return {
        bg: colors.dangerSoft,
        text: colors.danger,
        border: "transparent"
      };
    case "default":
    default:
      return {
        bg: colors.primary,
        text: colors.onPrimary,
        border: "transparent"
      };
  }
}
//# sourceMappingURL=Bubble.js.map