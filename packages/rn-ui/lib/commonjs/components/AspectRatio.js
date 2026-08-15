"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AspectRatio = AspectRatio;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function AspectRatio({
  ratio = 1,
  radius,
  children,
  style,
  ...props
}) {
  const {
    radii
  } = (0, _theme.useTheme)();
  const containerStyle = {
    width: "100%",
    aspectRatio: ratio,
    overflow: "hidden",
    borderRadius: radius ? radii[radius] : undefined
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [containerStyle, style],
    ...props,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: _reactNative.StyleSheet.absoluteFill,
      children: _react.default.Children.map(children, child => {
        if (/*#__PURE__*/_react.default.isValidElement(child)) {
          return /*#__PURE__*/_react.default.cloneElement(child, {
            style: [_reactNative.StyleSheet.absoluteFill, child.props.style]
          });
        }
        return child;
      })
    })
  });
}
//# sourceMappingURL=AspectRatio.js.map