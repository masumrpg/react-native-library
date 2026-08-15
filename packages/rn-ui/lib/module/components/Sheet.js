"use strict";

import React from "react";
import { View } from "react-native";
import { BottomSheet, BottomSheetView } from "./BottomSheet.js";
import { Text } from "./Text.js";
import { useTheme } from "../theme/index.js";
import { jsx as _jsx } from "react/jsx-runtime";
export const Sheet = /*#__PURE__*/React.forwardRef(function Sheet({
  index = -1,
  animateOnMount = false,
  ...props
}, ref) {
  return /*#__PURE__*/_jsx(BottomSheet, {
    ref: ref,
    index: index,
    animateOnMount: animateOnMount,
    enablePanDownToClose: true,
    ...props
  });
});
export { BottomSheetView as SheetContent };
export function SheetHeader({
  style,
  ...props
}) {
  const {
    spacing
  } = useTheme();
  return /*#__PURE__*/_jsx(View, {
    style: [{
      gap: spacing.xs
    }, style],
    ...props
  });
}
export function SheetTitle({
  children,
  style
}) {
  return /*#__PURE__*/_jsx(Text, {
    variant: "title",
    color: "text",
    style: style,
    children: children
  });
}
export function SheetDescription({
  children,
  style
}) {
  return /*#__PURE__*/_jsx(Text, {
    variant: "bodySmall",
    color: "textMuted",
    style: style,
    children: children
  });
}
export function SheetFooter({
  style,
  ...props
}) {
  const {
    spacing
  } = useTheme();
  return /*#__PURE__*/_jsx(View, {
    style: [{
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: spacing.sm
    }, style],
    ...props
  });
}
//# sourceMappingURL=Sheet.js.map