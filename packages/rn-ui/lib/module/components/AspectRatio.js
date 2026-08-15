"use strict";

import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../theme/index.js";
import { jsx as _jsx } from "react/jsx-runtime";
export function AspectRatio({
  ratio = 1,
  radius,
  children,
  style,
  ...props
}) {
  const {
    radii
  } = useTheme();
  const containerStyle = {
    width: "100%",
    aspectRatio: ratio,
    overflow: "hidden",
    borderRadius: radius ? radii[radius] : undefined
  };
  return /*#__PURE__*/_jsx(View, {
    style: [containerStyle, style],
    ...props,
    children: /*#__PURE__*/_jsx(View, {
      style: StyleSheet.absoluteFill,
      children: React.Children.map(children, child => {
        if (/*#__PURE__*/React.isValidElement(child)) {
          return /*#__PURE__*/React.cloneElement(child, {
            style: [StyleSheet.absoluteFill, child.props.style]
          });
        }
        return child;
      })
    })
  });
}
//# sourceMappingURL=AspectRatio.js.map