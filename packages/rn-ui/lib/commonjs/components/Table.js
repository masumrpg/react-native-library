"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Table = Table;
exports.TableCell = TableCell;
exports.TableHead = TableHead;
exports.TableRow = TableRow;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _Text = require("./Text");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function Table({
  horizontal = true,
  style,
  children,
  ...props
}) {
  const {
    colors,
    components,
    radii
  } = (0, _theme.useTheme)();
  const table = /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      borderWidth: components.borderWidth.strong,
      borderColor: colors.border,
      borderRadius: radii.lg,
      overflow: "hidden"
    }, style],
    ...props,
    children: children
  });
  return horizontal ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.ScrollView, {
    horizontal: true,
    showsHorizontalScrollIndicator: false,
    children: table
  }) : table;
}
function TableRow({
  style,
  ...props
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      flexDirection: "row"
    }, style],
    ...props
  });
}
function TableHead({
  children,
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
      minWidth: components.table.minColumnWidth,
      padding: spacing.md,
      borderBottomWidth: components.borderWidth.default,
      borderBottomColor: colors.borderMuted
    }, style],
    ...props,
    children: typeof children === "string" ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
      variant: "labelSmall",
      children: children
    }) : children
  });
}
function TableCell({
  children,
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
      minWidth: components.table.minColumnWidth,
      padding: spacing.md,
      borderTopWidth: components.borderWidth.default,
      borderTopColor: colors.borderMuted
    }, style],
    ...props,
    children: typeof children === "string" ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
      variant: "bodySmall",
      children: children
    }) : children
  });
}
//# sourceMappingURL=Table.js.map