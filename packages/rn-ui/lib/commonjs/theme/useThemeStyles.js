"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useThemeStyles = useThemeStyles;
var _react = require("react");
var _reactNative = require("react-native");
var _useTheme = require("./useTheme");
function useThemeStyles(factory) {
  const {
    theme
  } = (0, _useTheme.useTheme)();
  return (0, _react.useMemo)(() => _reactNative.StyleSheet.create(factory(theme)), [factory, theme]);
}
//# sourceMappingURL=useThemeStyles.js.map