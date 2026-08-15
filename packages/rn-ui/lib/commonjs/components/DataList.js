"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataList = DataList;
exports.DataListItem = DataListItem;
exports.DataListLabel = DataListLabel;
exports.DataListValue = DataListValue;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _Text = require("./Text");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function DataList({
  style,
  ...props
}) {
  const {
    spacing
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      width: "100%",
      gap: spacing.sm
    }, style],
    ...props
  });
}
function DataListItem({
  style,
  ...props
}) {
  const {
    colors,
    components,
    spacing
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: components.borderWidth.default,
      borderBottomColor: colors.borderMuted
    }, style],
    ...props
  });
}
function DataListLabel({
  children
}) {
  return typeof children === "string" ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
    variant: "bodySmall",
    color: "textMuted",
    children: children
  }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {
    children: children
  });
}
function DataListValue({
  children
}) {
  return typeof children === "string" ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
    variant: "label",
    color: "text",
    align: "right",
    children: children
  }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {
    children: children
  });
}
//# sourceMappingURL=DataList.js.map