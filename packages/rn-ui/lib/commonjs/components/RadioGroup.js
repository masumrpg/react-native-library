"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RadioGroup = RadioGroup;
exports.RadioGroupItem = RadioGroupItem;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _Text = require("./Text");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const RadioGroupContext = /*#__PURE__*/_react.default.createContext(null);
function RadioGroup({
  value,
  defaultValue,
  disabled = false,
  onValueChange,
  style,
  ...props
}) {
  const {
    spacing
  } = (0, _theme.useTheme)();
  const [internalValue, setInternalValue] = _react.default.useState(defaultValue);
  const currentValue = value ?? internalValue;
  const handleValueChange = _react.default.useCallback(next => {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  }, [onValueChange, value]);
  const context = _react.default.useMemo(() => ({
    value: currentValue,
    disabled,
    onValueChange: handleValueChange
  }), [currentValue, disabled, handleValueChange]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(RadioGroupContext.Provider, {
    value: context,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      accessibilityRole: "radiogroup",
      style: [{
        gap: spacing.sm,
        width: "100%"
      }, style],
      ...props
    })
  });
}
function RadioGroupItem({
  value,
  label,
  description,
  disabled = false,
  style,
  ...props
}) {
  const context = _react.default.useContext(RadioGroupContext);
  const {
    colors,
    components,
    radii,
    spacing,
    typography
  } = (0, _theme.useTheme)();
  const checked = context?.value === value;
  const isDisabled = disabled || Boolean(context?.disabled);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Pressable, {
    accessibilityRole: "radio",
    accessibilityState: {
      checked,
      disabled: isDisabled
    },
    disabled: isDisabled,
    onPress: () => context?.onValueChange?.(value),
    style: ({
      pressed
    }) => [{
      width: "100%",
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.md,
      padding: spacing.md,
      borderWidth: components.borderWidth.strong,
      borderColor: checked ? colors.primary : colors.border,
      borderRadius: radii.lg,
      backgroundColor: checked ? colors.primarySoft : colors.surface,
      opacity: isDisabled ? 0.5 : pressed ? 0.78 : 1
    }, style],
    ...props,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: components.borderWidth.focus,
        borderColor: checked ? colors.primary : colors.border,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 1
      },
      children: checked ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
        style: {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: colors.primary
        }
      }) : null
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
      style: {
        flex: 1,
        gap: spacing.xs
      },
      children: [typeof label === "string" ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
        variant: "label",
        color: "text",
        children: label
      }) : label, typeof description === "string" ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
        style: [typography.bodySmall, {
          color: colors.textMuted
        }],
        children: description
      }) : description]
    })]
  });
}
//# sourceMappingURL=RadioGroup.js.map