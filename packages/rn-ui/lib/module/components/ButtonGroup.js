"use strict";

import React from "react";
import { View } from "react-native";
import { useTheme } from "../theme/index.js";
import { Text } from "./Text.js";
import { jsx as _jsx } from "react/jsx-runtime";
const isAbsolute = style => {
  if (!style) return false;
  if (Array.isArray(style)) {
    return style.some(s => s && s.position === "absolute");
  }
  return style.position === "absolute";
};
export function ButtonGroup({
  orientation = "horizontal",
  style,
  children,
  ...props
}) {
  const isHorizontal = orientation === "horizontal";
  const groupStyle = {
    flexDirection: isHorizontal ? "row" : "column",
    alignItems: "stretch",
    width: "100%"
  };
  const validChildren = React.Children.toArray(children).filter(Boolean);
  const layoutChildren = validChildren.filter(child => {
    if (! /*#__PURE__*/React.isValidElement(child)) return false;
    return !isAbsolute(child.props.style);
  });
  const count = layoutChildren.length;
  let layoutIndex = 0;
  return /*#__PURE__*/_jsx(View, {
    style: [groupStyle, style],
    ...props,
    children: validChildren.map(child => {
      if (! /*#__PURE__*/React.isValidElement(child)) return child;
      if (isAbsolute(child.props.style)) {
        // If the child is absolute (like the sliding indicator), we do not modify its style
        return child;
      }
      const index = layoutIndex;
      layoutIndex++;

      // Visual border & radius overrides based on position in group
      const childStyle = {};
      if (isHorizontal) {
        if (index > 0) {
          childStyle.borderTopLeftRadius = 0;
          childStyle.borderBottomLeftRadius = 0;
          childStyle.borderLeftWidth = 0;
        }
        if (index < count - 1) {
          childStyle.borderTopRightRadius = 0;
          childStyle.borderBottomRightRadius = 0;
        }
      } else {
        if (index > 0) {
          childStyle.borderTopLeftRadius = 0;
          childStyle.borderTopRightRadius = 0;
          childStyle.borderTopWidth = 0;
        }
        if (index < count - 1) {
          childStyle.borderBottomLeftRadius = 0;
          childStyle.borderBottomRightRadius = 0;
        }
      }

      // Clone child and inject styles.
      // We append childStyle AFTER child's own style to ensure adjacent flat corners & border removals override defaults.
      return /*#__PURE__*/React.cloneElement(child, {
        style: [child.props.style, childStyle]
      });
    })
  });
}
export function ButtonGroupText({
  style,
  textStyle,
  children,
  ...props
}) {
  const {
    colors,
    components,
    radii,
    spacing
  } = useTheme();
  const textContainerStyle = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundMuted,
    borderColor: colors.border,
    borderWidth: components.borderWidth.strong,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md
  };
  return /*#__PURE__*/_jsx(View, {
    style: [textContainerStyle, style],
    ...props,
    children: typeof children === "string" ? /*#__PURE__*/_jsx(Text, {
      style: [{
        color: colors.text,
        fontSize: 14,
        fontWeight: "500"
      }, textStyle],
      children: children
    }) : children
  });
}
export function ButtonGroupSeparator({
  orientation = "vertical",
  style,
  ...props
}) {
  const {
    colors
  } = useTheme();
  const isVertical = orientation === "vertical";
  const separatorStyle = isVertical ? {
    width: 1.25,
    backgroundColor: colors.border,
    alignSelf: "stretch"
  } : {
    height: 1.25,
    backgroundColor: colors.border,
    alignSelf: "stretch"
  };
  return /*#__PURE__*/_jsx(View, {
    style: [separatorStyle, style],
    ...props
  });
}
//# sourceMappingURL=ButtonGroup.js.map