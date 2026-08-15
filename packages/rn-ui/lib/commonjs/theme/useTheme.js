"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useTheme = useTheme;
var _react = require("react");
var _ThemeProvider = require("./ThemeProvider");
function useTheme() {
  const value = (0, _react.useContext)(_ThemeProvider.ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used inside <ThemeProvider>.");
  }
  return value;
}
//# sourceMappingURL=useTheme.js.map