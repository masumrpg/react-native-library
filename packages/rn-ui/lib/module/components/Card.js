"use strict";

import React from "react";
import { View } from "react-native";
import { useTheme } from "../theme/index.js";
import { jsx as _jsx } from "react/jsx-runtime";
export function Card({
  padded = true,
  elevated = false,
  outlined = true,
  style,
  ...props
}) {
  const {
    colors,
    components,
    radii,
    spacing,
    shadows
  } = useTheme();
  const cardStyle = {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: padded ? spacing.lg : undefined,
    borderWidth: outlined ? components.borderWidth.strong : 0,
    borderColor: colors.border,
    ...(elevated ? shadows.md : shadows.none)
  };
  return /*#__PURE__*/_jsx(View, {
    style: [cardStyle, style],
    ...props
  });
}
//# sourceMappingURL=Card.js.map