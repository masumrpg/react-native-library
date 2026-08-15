"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Card = Card;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function Card({
  padded = true,
  elevated = false,
  outlined = true,
  style,
  ...props
}) {
  const {
    colors,
    components,
    radii,
    spacing,
    shadows
  } = (0, _theme.useTheme)();
  const cardStyle = {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: padded ? spacing.lg : undefined,
    borderWidth: outlined ? components.borderWidth.strong : 0,
    borderColor: colors.border,
    ...(elevated ? shadows.md : shadows.none)
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [cardStyle, style],
    ...props
  });
}
//# sourceMappingURL=Card.js.map