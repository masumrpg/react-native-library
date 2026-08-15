"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Text = Text;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function Text({
  variant = "body",
  color = "text",
  align,
  weight,
  style,
  ...props
}) {
  const {
    colors,
    typography
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
    style: [typography[variant], {
      color: colors[color],
      textAlign: align,
      fontWeight: weight
    }, style],
    ...props
  });
}
//# sourceMappingURL=Text.js.map