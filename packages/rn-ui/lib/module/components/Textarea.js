"use strict";

import React from "react";
import { Input } from "./Input.js";
import { jsx as _jsx } from "react/jsx-runtime";
export const Textarea = /*#__PURE__*/React.forwardRef(function Textarea({
  minRows = 4,
  size = "md",
  style,
  ...props
}, ref) {
  const minHeight = size === "lg" ? 132 : size === "sm" ? 84 : 108;
  return /*#__PURE__*/_jsx(Input, {
    ref: ref,
    multiline: true,
    size: size,
    textAlignVertical: "top",
    style: [{
      minHeight: Math.max(minRows * 24, minHeight),
      paddingVertical: 10
    }, style],
    ...props
  });
});
//# sourceMappingURL=Textarea.js.map