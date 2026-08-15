"use strict";

import React from "react";
import { View } from "react-native";
import { useTheme } from "../theme/index.js";
import { jsx as _jsx } from "react/jsx-runtime";
export function Divider({
  inset = 0,
  vertical = false,
  style
}) {
  const {
    colors
  } = useTheme();
  return /*#__PURE__*/_jsx(View, {
    style: [{
      backgroundColor: colors.divider,
      marginHorizontal: vertical ? 0 : inset,
      marginVertical: vertical ? inset : 0,
      width: vertical ? 1 : undefined,
      height: vertical ? undefined : 1,
      alignSelf: vertical ? "stretch" : undefined
    }, style]
  });
}
//# sourceMappingURL=Divider.js.map