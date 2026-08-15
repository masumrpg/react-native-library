"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Label = Label;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function Label({
  required = false,
  requiredIndicator,
  requiredIndicatorStyle,
  disabled = false,
  invalid = false,
  style,
  children,
  ...props
}) {
  const {
    colors,
    typography
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Text, {
    style: [typography.label, {
      color: disabled ? colors.disabledText : invalid ? colors.danger : colors.text
    }, style],
    ...props,
    children: [children, required ? requiredIndicator ?? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
      style: [{
        color: colors.danger
      }, requiredIndicatorStyle],
      children: " *"
    }) : null]
  });
}
//# sourceMappingURL=Label.js.map