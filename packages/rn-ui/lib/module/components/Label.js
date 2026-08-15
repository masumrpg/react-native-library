"use strict";

import React from "react";
import { Text } from "react-native";
import { useTheme } from "../theme/index.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Label({
  required = false,
  requiredIndicator,
  requiredIndicatorStyle,
  disabled = false,
  invalid = false,
  style,
  children,
  ...props
}) {
  const {
    colors,
    typography
  } = useTheme();
  return /*#__PURE__*/_jsxs(Text, {
    style: [typography.label, {
      color: disabled ? colors.disabledText : invalid ? colors.danger : colors.text
    }, style],
    ...props,
    children: [children, required ? requiredIndicator ?? /*#__PURE__*/_jsx(Text, {
      style: [{
        color: colors.danger
      }, requiredIndicatorStyle],
      children: " *"
    }) : null]
  });
}
//# sourceMappingURL=Label.js.map