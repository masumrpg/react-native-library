"use strict";

import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useTheme } from "../theme/index.js";
import { jsx as _jsx } from "react/jsx-runtime";
export function KeyboardAvoiding({
  bg = "background",
  p,
  px,
  py,
  gap,
  scroll = false,
  fullHeight = true,
  behavior,
  keyboardVerticalOffset = 0,
  enabled = true,
  contentContainerStyle,
  scrollViewProps,
  style,
  children,
  ...props
}) {
  const {
    colors,
    spacing
  } = useTheme();
  const resolvedBehavior = behavior ?? (Platform.OS === "ios" ? "padding" : "height");
  const {
    contentContainerStyle: scrollContentContainerStyle,
    keyboardShouldPersistTaps = "handled",
    contentInsetAdjustmentBehavior = "automatic",
    ...restScrollViewProps
  } = scrollViewProps ?? {};
  const contentStyle = {
    padding: p ? spacing[p] : undefined,
    paddingHorizontal: px ? spacing[px] : undefined,
    paddingVertical: py ? spacing[py] : undefined,
    gap: gap ? spacing[gap] : undefined
  };
  return /*#__PURE__*/_jsx(KeyboardAvoidingView, {
    behavior: resolvedBehavior,
    keyboardVerticalOffset: keyboardVerticalOffset,
    enabled: enabled,
    style: [{
      flex: fullHeight ? 1 : undefined,
      backgroundColor: colors[bg]
    }, style],
    ...props,
    children: scroll ? /*#__PURE__*/_jsx(ScrollView, {
      keyboardShouldPersistTaps: keyboardShouldPersistTaps,
      contentInsetAdjustmentBehavior: contentInsetAdjustmentBehavior,
      contentContainerStyle: [contentStyle, fullHeight && {
        flexGrow: 1
      }, contentContainerStyle, scrollContentContainerStyle],
      ...restScrollViewProps,
      children: children
    }) : /*#__PURE__*/_jsx(View, {
      style: [contentStyle, contentContainerStyle],
      children: children
    })
  });
}
//# sourceMappingURL=KeyboardAvoiding.js.map