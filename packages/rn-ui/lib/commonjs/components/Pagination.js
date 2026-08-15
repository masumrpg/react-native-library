"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pagination = Pagination;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _Button = require("./Button");
var _Text = require("./Text");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function Pagination({
  page,
  pageCount,
  onPageChange,
  previousLabel = "Prev",
  nextLabel = "Next",
  style,
  ...props
}) {
  const {
    spacing
  } = (0, _theme.useTheme)();
  const safePage = Math.min(pageCount, Math.max(1, page));
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
    style: [{
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm
    }, style],
    ...props,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.Button, {
      size: "sm",
      variant: "outline",
      tone: "secondary",
      disabled: safePage <= 1,
      onPress: () => onPageChange?.(safePage - 1),
      children: previousLabel
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Text.Text, {
      variant: "labelSmall",
      color: "textMuted",
      style: {
        fontVariant: ["tabular-nums"]
      },
      children: [safePage, " / ", pageCount]
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.Button, {
      size: "sm",
      variant: "outline",
      tone: "secondary",
      disabled: safePage >= pageCount,
      onPress: () => onPageChange?.(safePage + 1),
      children: nextLabel
    })]
  });
}
//# sourceMappingURL=Pagination.js.map