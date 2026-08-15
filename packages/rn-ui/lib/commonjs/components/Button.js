"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Button = Button;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _utils = require("../utils");
var _types = require("./types");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function getToneColors(tone, colors) {
  if (tone === "primary") return {
    base: colors.primary,
    soft: colors.primarySoft,
    on: colors.onPrimary
  };
  if (tone === "secondary") return {
    base: colors.secondary,
    soft: colors.secondarySoft,
    on: colors.onSecondary
  };
  if (tone === "accent") return {
    base: colors.accent,
    soft: colors.accentSoft,
    on: colors.onAccent
  };
  if (tone === "success") return {
    base: colors.success,
    soft: colors.successSoft,
    on: colors.onSuccess
  };
  if (tone === "warning") return {
    base: colors.warning,
    soft: colors.warningSoft,
    on: colors.onWarning
  };
  if (tone === "danger") return {
    base: colors.danger,
    soft: colors.dangerSoft,
    on: colors.onDanger
  };
  return {
    base: colors.info,
    soft: colors.infoSoft,
    on: colors.onInfo
  };
}
function Button({
  children,
  variant = "filled",
  size = "md",
  tone = "primary",
  shape = "rounded",
  leftIcon,
  rightIcon,
  loading = false,
  fullWidth,
  disabled,
  style,
  textStyle,
  ...props
}) {
  const {
    colors,
    typography,
    radii,
    components,
    spacing
  } = (0, _theme.useTheme)();
  const isDisabled = disabled || loading;
  const visualVariant = variant === "danger" ? "filled" : variant;
  const resolvedTone = variant === "danger" ? "danger" : tone;
  const toneColors = getToneColors(resolvedTone, colors);
  const backgroundColor = isDisabled ? colors.disabled : visualVariant === "filled" ? toneColors.base : visualVariant === "soft" ? toneColors.soft : colors.transparent;
  const foregroundColor = isDisabled ? colors.disabledText : visualVariant === "filled" ? toneColors.on : toneColors.base;
  const borderColor = isDisabled ? colors.disabled : visualVariant === "outline" ? (0, _utils.withAlpha)(toneColors.base, 0.42) : colors.transparent;
  const height = components.button.height[size];
  const iconSize = components.button.iconSize[size];
  const borderRadius = shape === "pill" ? radii.full : shape === "square" ? radii.sm : radii.lg;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
    accessibilityRole: "button",
    disabled: isDisabled,
    style: ({
      pressed
    }) => [{
      minHeight: height,
      paddingHorizontal: components.button.paddingX[size],
      borderRadius,
      backgroundColor,
      borderColor,
      borderWidth: visualVariant === "outline" ? components.borderWidth.strong : 0,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: spacing.sm,
      opacity: pressed && !isDisabled ? 0.78 : 1,
      width: fullWidth ? "100%" : undefined
    }, style],
    ...props,
    children: loading ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.ActivityIndicator, {
      size: "small",
      color: foregroundColor
    }) : /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
      children: [(0, _types.renderIcon)(leftIcon, foregroundColor, iconSize), typeof children === "string" ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
        style: [typography.label, {
          color: foregroundColor,
          textAlign: "center"
        }, textStyle],
        children: children
      }) : children, (0, _types.renderIcon)(rightIcon, foregroundColor, iconSize)]
    })
  });
}
//# sourceMappingURL=Button.js.map