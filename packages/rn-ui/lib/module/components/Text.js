"use strict";

import React from "react";
import { Text as RNText } from "react-native";
import { useTheme } from "../theme/index.js";
import { jsx as _jsx } from "react/jsx-runtime";
export function Text({
  variant = "body",
  color = "text",
  align,
  weight,
  style,
  ...props
}) {
  const {
    colors,
    typography
  } = useTheme();
  return /*#__PURE__*/_jsx(RNText, {
    style: [typography[variant], {
      color: colors[color],
      textAlign: align,
      fontWeight: weight
    }, style],
    ...props
  });
}
//# sourceMappingURL=Text.js.map