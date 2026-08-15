"use strict";

import React from "react";
import { View } from "react-native";
import { useTheme } from "../theme/index.js";
import { jsx as _jsx } from "react/jsx-runtime";
export function Box({
  bg,
  borderColor,
  radius,
  p,
  px,
  py,
  m,
  mx,
  my,
  flex,
  row,
  center,
  gap,
  style,
  ...props
}) {
  const {
    colors,
    radii,
    spacing
  } = useTheme();
  const themedStyle = {
    backgroundColor: bg ? colors[bg] : undefined,
    borderColor: borderColor ? colors[borderColor] : undefined,
    borderRadius: radius ? radii[radius] : undefined,
    padding: p ? spacing[p] : undefined,
    paddingHorizontal: px ? spacing[px] : undefined,
    paddingVertical: py ? spacing[py] : undefined,
    margin: m ? spacing[m] : undefined,
    marginHorizontal: mx ? spacing[mx] : undefined,
    marginVertical: my ? spacing[my] : undefined,
    flex,
    flexDirection: row ? "row" : undefined,
    alignItems: center ? "center" : undefined,
    justifyContent: center ? "center" : undefined,
    gap: gap ? spacing[gap] : undefined
  };
  return /*#__PURE__*/_jsx(View, {
    style: [themedStyle, style],
    ...props
  });
}
//# sourceMappingURL=Box.js.map