"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Breadcrumb = Breadcrumb;
exports.BreadcrumbItem = BreadcrumbItem;
exports.BreadcrumbLink = BreadcrumbLink;
exports.BreadcrumbPage = BreadcrumbPage;
exports.BreadcrumbSeparator = BreadcrumbSeparator;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _Text = require("./Text");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function Breadcrumb({
  style,
  ...props
}) {
  const {
    spacing
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    accessibilityRole: "text",
    style: [{
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: spacing.xs
    }, style],
    ...props
  });
}
function BreadcrumbItem({
  style,
  ...props
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      flexDirection: "row",
      alignItems: "center"
    }, style],
    ...props
  });
}
function BreadcrumbLink({
  children,
  disabled,
  ...props
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
    disabled: disabled,
    ...props,
    children: typeof children === "string" ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
      variant: "bodySmall",
      color: disabled ? "text" : "primary",
      children: children
    }) : children
  });
}
function BreadcrumbPage({
  children
}) {
  return typeof children === "string" ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
    variant: "bodySmall",
    color: "text",
    children: children
  }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {
    children: children
  });
}
function BreadcrumbSeparator({
  children = "/"
}) {
  return typeof children === "string" ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
    variant: "bodySmall",
    color: "textSubtle",
    children: children
  }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {
    children: children
  });
}
//# sourceMappingURL=Breadcrumb.js.map