"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Badge = Badge;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _types = require("./types");
var _Text = require("./Text");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function getBadgeColors(tone, colors) {
  const map = {
    primary: {
      solid: colors.primary,
      soft: colors.primarySoft,
      on: colors.onPrimary
    },
    secondary: {
      solid: colors.secondary,
      soft: colors.secondarySoft,
      on: colors.onSecondary
    },
    accent: {
      solid: colors.accent,
      soft: colors.accentSoft,
      on: colors.onAccent
    },
    success: {
      solid: colors.success,
      soft: colors.successSoft,
      on: colors.onSuccess
    },
    warning: {
      solid: colors.warning,
      soft: colors.warningSoft,
      on: colors.onWarning
    },
    danger: {
      solid: colors.danger,
      soft: colors.dangerSoft,
      on: colors.onDanger
    },
    info: {
      solid: colors.info,
      soft: colors.infoSoft,
      on: colors.onInfo
    }
  };
  return map[tone];
}
function Badge({
  children,
  tone = "primary",
  variant = "soft",
  size = "md",
  icon,
  style
}) {
  const {
    colors,
    components,
    radii,
    spacing
  } = (0, _theme.useTheme)();
  const toneColors = getBadgeColors(tone, colors);
  const isSolid = variant === "solid";
  const iconSize = size === "lg" ? 14 : size === "sm" ? 10 : 12;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
    style: [{
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      paddingHorizontal: size === "lg" ? spacing.md : spacing.sm,
      paddingVertical: size === "lg" ? spacing.xs : spacing.xxs,
      borderRadius: radii.full,
      backgroundColor: isSolid ? toneColors.solid : variant === "soft" ? toneColors.soft : colors.transparent,
      borderWidth: variant === "outline" ? components.borderWidth.default : 0,
      borderColor: variant === "outline" ? colors.border : colors.transparent
    }, style],
    children: [(0, _types.renderIcon)(icon, isSolid ? toneColors.on : toneColors.solid, iconSize), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
      variant: "labelSmall",
      color: isSolid ? "textInverse" : "text",
      style: {
        color: isSolid ? toneColors.on : toneColors.solid
      },
      children: children
    })]
  });
}
//# sourceMappingURL=Badge.js.map