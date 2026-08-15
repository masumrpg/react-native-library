"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormControl = FormControl;
exports.FormDescription = FormDescription;
exports.FormField = FormField;
exports.FormLabel = FormLabel;
exports.FormMessage = FormMessage;
exports.useFormField = useFormField;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _Label = require("./Label");
var _Text = require("./Text");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const FormFieldContext = /*#__PURE__*/_react.default.createContext(null);
function useFormField() {
  return _react.default.useContext(FormFieldContext);
}
function FormField({
  invalid = false,
  disabled = false,
  required = false,
  style,
  ...props
}) {
  const {
    spacing
  } = (0, _theme.useTheme)();
  const value = _react.default.useMemo(() => ({
    invalid,
    disabled,
    required
  }), [disabled, invalid, required]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(FormFieldContext.Provider, {
    value: value,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: [{
        width: "100%",
        gap: spacing.xs
      }, style],
      ...props
    })
  });
}
function FormLabel(props) {
  const field = useFormField();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Label.Label, {
    invalid: field?.invalid,
    disabled: field?.disabled,
    required: field?.required,
    ...props
  });
}
function FormControl({
  style,
  ...props
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      width: "100%"
    }, style],
    ...props
  });
}
function FormDescription({
  children,
  style
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
    variant: "bodySmall",
    color: "textMuted",
    style: style,
    children: children
  });
}
function FormMessage({
  children,
  style
}) {
  const field = useFormField();
  if (!children) return null;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
    variant: "bodySmall",
    color: field?.invalid ? "danger" : "textMuted",
    style: style,
    children: children
  });
}
//# sourceMappingURL=FormField.js.map