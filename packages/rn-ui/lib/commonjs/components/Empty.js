"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Empty = Empty;
exports.EmptyContent = EmptyContent;
exports.EmptyDescription = EmptyDescription;
exports.EmptyHeader = EmptyHeader;
exports.EmptyMedia = EmptyMedia;
exports.EmptyTitle = EmptyTitle;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _Text = require("./Text");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function Empty({
  bordered = false,
  style,
  ...props
}) {
  const {
    colors,
    components,
    radii,
    spacing
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      width: "100%",
      minWidth: 0,
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.lg,
      borderRadius: radii.xl,
      borderWidth: bordered ? components.borderWidth.strong : 0,
      borderStyle: bordered ? "dashed" : "solid",
      borderColor: bordered ? colors.border : colors.transparent,
      padding: spacing.xxl
    }, style],
    ...props
  });
}
function EmptyHeader({
  style,
  ...props
}) {
  const {
    spacing
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      width: "100%",
      maxWidth: 320,
      alignItems: "center",
      gap: spacing.sm
    }, style],
    ...props
  });
}
function EmptyMedia({
  variant = "default",
  style,
  ...props
}) {
  const {
    colors,
    radii,
    spacing
  } = (0, _theme.useTheme)();
  const isIcon = variant === "icon";
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      marginBottom: spacing.xs,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      width: isIcon ? 32 : undefined,
      height: isIcon ? 32 : undefined,
      borderRadius: isIcon ? radii.lg : undefined,
      backgroundColor: isIcon ? colors.backgroundMuted : colors.transparent
    }, style],
    ...props
  });
}
function EmptyTitle({
  children,
  style
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
    variant: "label",
    align: "center",
    style: style,
    children: children
  });
}
function EmptyDescription({
  children,
  style
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
    variant: "bodySmall",
    color: "textMuted",
    align: "center",
    style: style,
    children: children
  });
}
function EmptyContent({
  style,
  ...props
}) {
  const {
    spacing
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      width: "100%",
      maxWidth: 320,
      minWidth: 0,
      alignItems: "center",
      gap: spacing.sm
    }, style],
    ...props
  });
}
//# sourceMappingURL=Empty.js.map