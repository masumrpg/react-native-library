"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Input = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _utils = require("../utils");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const inputHeights = {
  sm: 36,
  md: 44,
  lg: 52
};
const inputPaddingX = {
  sm: 10,
  md: 12,
  lg: 14
};
function getKeyboardType(type) {
  if (type === "email") return "email-address";
  if (type === "number") return "numeric";
  if (type === "tel") return "phone-pad";
  if (type === "url") return "url";
  return "default";
}
const Input = exports.Input = /*#__PURE__*/_react.default.forwardRef(function Input({
  type = "text",
  size = "md",
  invalid = false,
  disabled = false,
  fullWidth = true,
  editable,
  multiline,
  onFocus,
  onBlur,
  keyboardType,
  secureTextEntry,
  placeholderTextColor,
  style,
  ...props
}, ref) {
  const {
    colors,
    components,
    typography,
    radii
  } = (0, _theme.useTheme)();
  const [focused, setFocused] = _react.default.useState(false);
  const isEditable = editable ?? !disabled;
  const borderColor = invalid ? colors.danger : focused ? colors.primary : colors.border;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.TextInput, {
    ref: ref,
    editable: isEditable,
    keyboardType: keyboardType ?? getKeyboardType(type),
    secureTextEntry: secureTextEntry ?? type === "password",
    placeholderTextColor: placeholderTextColor ?? colors.placeholder,
    onFocus: event => {
      setFocused(true);
      onFocus?.(event);
    },
    onBlur: event => {
      setFocused(false);
      onBlur?.(event);
    },
    style: [typography.body, {
      width: fullWidth ? "100%" : undefined,
      minHeight: multiline ? inputHeights[size] * 2 : inputHeights[size],
      paddingHorizontal: inputPaddingX[size],
      paddingVertical: multiline ? 10 : 0,
      borderRadius: radii.lg,
      borderWidth: focused || invalid ? components.borderWidth.focus : components.borderWidth.strong,
      borderColor,
      backgroundColor: isEditable ? colors.input : (0, _utils.withAlpha)(colors.input, 0.55),
      color: isEditable ? colors.text : colors.disabledText,
      opacity: isEditable ? 1 : 0.72,
      textAlignVertical: multiline ? "top" : "center"
    }, focused && {
      shadowColor: invalid ? colors.danger : colors.primary,
      shadowOffset: {
        width: 0,
        height: 0
      },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0
    }, style],
    ...props
  });
});
//# sourceMappingURL=Input.js.map