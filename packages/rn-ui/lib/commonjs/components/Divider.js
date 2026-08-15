"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Divider = Divider;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function Divider({
  inset = 0,
  vertical = false,
  style
}) {
  const {
    colors
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      backgroundColor: colors.divider,
      marginHorizontal: vertical ? 0 : inset,
      marginVertical: vertical ? inset : 0,
      width: vertical ? 1 : undefined,
      height: vertical ? undefined : 1,
      alignSelf: vertical ? "stretch" : undefined
    }, style]
  });
}
//# sourceMappingURL=Divider.js.map