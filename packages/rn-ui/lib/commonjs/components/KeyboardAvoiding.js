"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KeyboardAvoiding = KeyboardAvoiding;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function KeyboardAvoiding({
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
  } = (0, _theme.useTheme)();
  const resolvedBehavior = behavior ?? (_reactNative.Platform.OS === "ios" ? "padding" : "height");
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
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.KeyboardAvoidingView, {
    behavior: resolvedBehavior,
    keyboardVerticalOffset: keyboardVerticalOffset,
    enabled: enabled,
    style: [{
      flex: fullHeight ? 1 : undefined,
      backgroundColor: colors[bg]
    }, style],
    ...props,
    children: scroll ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.ScrollView, {
      keyboardShouldPersistTaps: keyboardShouldPersistTaps,
      contentInsetAdjustmentBehavior: contentInsetAdjustmentBehavior,
      contentContainerStyle: [contentStyle, fullHeight && {
        flexGrow: 1
      }, contentContainerStyle, scrollContentContainerStyle],
      ...restScrollViewProps,
      children: children
    }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: [contentStyle, contentContainerStyle],
      children: children
    })
  });
}
//# sourceMappingURL=KeyboardAvoiding.js.map