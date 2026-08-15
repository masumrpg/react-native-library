"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Stepper = Stepper;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _Button = require("./Button");
var _Text = require("./Text");
var _types = require("./types");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function clampStepper(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function Stepper({
  value,
  defaultValue = 0,
  min = 0,
  max = 999,
  step = 1,
  disabled = false,
  onValueChange,
  decrementIcon,
  incrementIcon,
  style,
  ...props
}) {
  const {
    colors,
    components,
    radii,
    spacing
  } = (0, _theme.useTheme)();
  const [internalValue, setInternalValue] = _react.default.useState(defaultValue);
  const currentValue = clampStepper(value ?? internalValue, min, max);
  const setNextValue = nextValue => {
    const next = clampStepper(nextValue, min, max);
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
    accessibilityRole: "adjustable",
    accessibilityValue: {
      min,
      max,
      now: currentValue
    },
    style: [{
      minHeight: 44,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: components.borderWidth.strong,
      borderColor: colors.border,
      borderRadius: radii.lg,
      backgroundColor: colors.surface,
      overflow: "hidden",
      opacity: disabled ? 0.5 : 1
    }, style],
    ...props,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.Button, {
      size: "sm",
      variant: "ghost",
      tone: "secondary",
      shape: "square",
      disabled: disabled || currentValue <= min,
      onPress: () => setNextValue(currentValue - step),
      children: decrementIcon ? (0, _types.renderIcon)(decrementIcon, colors.text, 16) : "-"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: {
        minWidth: 52,
        alignItems: "center",
        paddingHorizontal: spacing.sm
      },
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
        variant: "label",
        style: {
          fontVariant: ["tabular-nums"]
        },
        children: currentValue
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.Button, {
      size: "sm",
      variant: "ghost",
      tone: "secondary",
      shape: "square",
      disabled: disabled || currentValue >= max,
      onPress: () => setNextValue(currentValue + step),
      children: incrementIcon ? (0, _types.renderIcon)(incrementIcon, colors.text, 16) : "+"
    })]
  });
}
//# sourceMappingURL=Stepper.js.map