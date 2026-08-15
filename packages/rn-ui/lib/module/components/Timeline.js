"use strict";

import React from "react";
import { View } from "react-native";
import { useTheme } from "../theme/index.js";
import { Text } from "./Text.js";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export function Timeline({
  style,
  ...props
}) {
  const {
    spacing
  } = useTheme();
  return /*#__PURE__*/_jsx(View, {
    style: [{
      gap: spacing.md
    }, style],
    ...props
  });
}
export function TimelineItem({
  active = false,
  style,
  children,
  ...props
}) {
  const {
    colors,
    components,
    spacing
  } = useTheme();
  const indicatorSize = components.timeline.indicatorSize;
  return /*#__PURE__*/_jsxs(View, {
    style: [{
      flexDirection: "row",
      gap: spacing.md
    }, style],
    ...props,
    children: [/*#__PURE__*/_jsxs(View, {
      style: {
        alignItems: "center"
      },
      children: [/*#__PURE__*/_jsx(View, {
        style: {
          width: indicatorSize,
          height: indicatorSize,
          borderRadius: indicatorSize / 2,
          backgroundColor: active ? colors.primary : colors.border
        }
      }), /*#__PURE__*/_jsx(View, {
        style: {
          width: components.timeline.connectorWidth,
          flex: 1,
          minHeight: components.timeline.connectorMinHeight,
          backgroundColor: colors.borderMuted
        }
      })]
    }), /*#__PURE__*/_jsx(View, {
      style: {
        flex: 1,
        gap: spacing.xs
      },
      children: children
    })]
  });
}
export function TimelineTitle({
  children
}) {
  return typeof children === "string" ? /*#__PURE__*/_jsx(Text, {
    variant: "label",
    children: children
  }) : /*#__PURE__*/_jsx(_Fragment, {
    children: children
  });
}
export function TimelineDescription({
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
//# sourceMappingURL=Timeline.js.map