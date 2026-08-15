"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Box = Box;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function Box({
  bg,
  borderColor,
  radius,
  p,
  px,
  py,
  m,
  mx,
  my,
  flex,
  row,
  center,
  gap,
  style,
  ...props
}) {
  const {
    colors,
    radii,
    spacing
  } = (0, _theme.useTheme)();
  const themedStyle = {
    backgroundColor: bg ? colors[bg] : undefined,
    borderColor: borderColor ? colors[borderColor] : undefined,
    borderRadius: radius ? radii[radius] : undefined,
    padding: p ? spacing[p] : undefined,
    paddingHorizontal: px ? spacing[px] : undefined,
    paddingVertical: py ? spacing[py] : undefined,
    margin: m ? spacing[m] : undefined,
    marginHorizontal: mx ? spacing[mx] : undefined,
    marginVertical: my ? spacing[my] : undefined,
    flex,
    flexDirection: row ? "row" : undefined,
    alignItems: center ? "center" : undefined,
    justifyContent: center ? "center" : undefined,
    gap: gap ? spacing[gap] : undefined
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [themedStyle, style],
    ...props
  });
}
//# sourceMappingURL=Box.js.map