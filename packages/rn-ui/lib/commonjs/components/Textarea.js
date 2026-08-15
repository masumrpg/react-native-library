"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Textarea = void 0;
var _react = _interopRequireDefault(require("react"));
var _Input = require("./Input");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const Textarea = exports.Textarea = /*#__PURE__*/_react.default.forwardRef(function Textarea({
  minRows = 4,
  size = "md",
  style,
  ...props
}, ref) {
  const minHeight = size === "lg" ? 132 : size === "sm" ? 84 : 108;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Input.Input, {
    ref: ref,
    multiline: true,
    size: size,
    textAlignVertical: "top",
    style: [{
      minHeight: Math.max(minRows * 24, minHeight),
      paddingVertical: 10
    }, style],
    ...props
  });
});
//# sourceMappingURL=Textarea.js.map