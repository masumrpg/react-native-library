"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IconButton = IconButton;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _utils = require("../utils");
var _Text = require("./Text");
var _types = require("./types");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function getToneColor(tone, colors) {
  if (tone === "primary") return colors.primary;
  if (tone === "secondary") return colors.secondary;
  if (tone === "accent") return colors.accent;
  if (tone === "success") return colors.success;
  if (tone === "warning") return colors.warning;
  if (tone === "danger") return colors.danger;
  return colors.info;
}
function resolveColor(color, colors) {
  if (!color) return undefined;
  return color in colors ? colors[color] : color;
}
function IconButton({
  icon,
  variant = "ghost",
  size = "md",
  tone = "primary",
  color,
  loading,
  disabled,
  badge,
  style,
  ...props
}) {
  const {
    colors,
    components
  } = (0, _theme.useTheme)();
  const base = resolveColor(color, colors) ?? getToneColor(tone, colors);
  const isDisabled = disabled || loading;
  const containerSize = components.iconButton.size[size];
  const iconSize = components.iconButton.iconSize[size];
  const badgeTokens = components.iconButton.badge;
  const backgroundColor = isDisabled ? colors.disabled : variant === "filled" ? base : variant === "soft" ? (0, _utils.withAlpha)(base, 0.12) : variant === "outline" ? colors.surface : colors.transparent;
  const iconColor = isDisabled ? colors.disabledText : variant === "filled" ? colors.onPrimary : variant === "ghost" ? colors.text : base;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Pressable, {
    accessibilityRole: "button",
    disabled: isDisabled,
    style: ({
      pressed
    }) => [{
      width: containerSize,
      height: containerSize,
      borderRadius: containerSize / 2,
      backgroundColor,
      borderColor: variant === "outline" ? colors.border : colors.transparent,
      borderWidth: variant === "outline" ? components.borderWidth.strong : 0,
      alignItems: "center",
      justifyContent: "center",
      opacity: pressed && !isDisabled ? 0.72 : 1
    }, style],
    ...props,
    children: [loading ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.ActivityIndicator, {
      color: iconColor
    }) : (0, _types.renderIcon)(icon, iconColor, iconSize), !!badge && badge > 0 && /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: {
        position: "absolute",
        top: badgeTokens.offset,
        right: badgeTokens.offset,
        minWidth: badgeTokens.minWidth,
        height: badgeTokens.size,
        paddingHorizontal: badgeTokens.paddingX,
        borderRadius: badgeTokens.size / 2,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.danger,
        borderWidth: badgeTokens.borderWidth,
        borderColor: colors.surface
      },
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
        variant: "caption",
        color: "onDanger",
        weight: "700",
        style: {
          fontSize: badgeTokens.fontSize,
          lineHeight: badgeTokens.lineHeight
        },
        children: badge > 99 ? "99+" : String(badge)
      })
    })]
  });
}
//# sourceMappingURL=IconButton.js.map