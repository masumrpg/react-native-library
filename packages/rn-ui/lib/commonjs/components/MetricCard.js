"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MetricCard = MetricCard;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _Text = require("./Text");
var _types = require("./types");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function MetricCard({
  label,
  value,
  delta,
  icon,
  style,
  ...props
}) {
  const {
    colors,
    components,
    radii,
    spacing
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
    style: [{
      borderWidth: components.borderWidth.strong,
      borderColor: colors.border,
      borderRadius: radii.xl,
      backgroundColor: colors.surface,
      padding: spacing.lg,
      gap: spacing.md
    }, style],
    ...props,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
      style: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: spacing.md
      },
      children: [typeof label === "string" ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
        variant: "bodySmall",
        color: "textMuted",
        children: label
      }) : label, (0, _types.renderIcon)(icon, colors.primary, components.metricCard.iconSize)]
    }), typeof value === "string" || typeof value === "number" ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
      variant: "h3",
      children: value
    }) : value, delta ? typeof delta === "string" ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
      variant: "caption",
      color: "success",
      children: delta
    }) : delta : null]
  });
}
//# sourceMappingURL=MetricCard.js.map