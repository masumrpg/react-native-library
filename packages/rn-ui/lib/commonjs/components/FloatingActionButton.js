"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FloatingActionButton = FloatingActionButton;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _theme = require("../theme");
var _utils = require("../utils");
var _Text = require("./Text");
var _types = require("./types");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
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
function FloatingActionButton({
  icon,
  label,
  extended = Boolean(label),
  size = "md",
  tone = "primary",
  variant = "filled",
  placement = "bottom-end",
  offset,
  visible = true,
  animated = true,
  loading,
  disabled,
  fullWidth,
  style,
  textStyle,
  onPressIn,
  onPressOut,
  ...props
}) {
  const {
    colors,
    components,
    radii,
    spacing,
    typography
  } = (0, _theme.useTheme)();
  const [mounted, setMounted] = _react.default.useState(visible);
  const visibility = (0, _reactNativeReanimated.useSharedValue)(visible ? 1 : 0);
  const press = (0, _reactNativeReanimated.useSharedValue)(1);
  const isDisabled = disabled || loading;
  const toneColors = getToneColors(tone, colors);
  const fabTokens = components.floatingActionButton;
  const dimension = fabTokens.size[size];
  const iconSize = fabTokens.iconSize[size];
  const resolvedOffset = offset ?? spacing.lg;
  _react.default.useEffect(() => {
    if (visible) {
      setMounted(true);
    }
    if (!animated) {
      visibility.value = visible ? 1 : 0;
      if (!visible) {
        setMounted(false);
      }
      return;
    }
    visibility.value = (0, _reactNativeReanimated.withTiming)(visible ? 1 : 0, {
      duration: 180
    }, finished => {
      if (finished && !visible) {
        (0, _reactNativeReanimated.runOnJS)(setMounted)(false);
      }
    });
  }, [animated, visible, visibility]);
  const animatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    opacity: visibility.value,
    transform: [{
      scale: press.value * (0.88 + visibility.value * 0.12)
    }, {
      translateY: 8 * (1 - visibility.value)
    }]
  }));
  if (!mounted) {
    return null;
  }
  const backgroundColor = isDisabled ? colors.disabled : variant === "filled" ? toneColors.base : variant === "soft" ? toneColors.soft : variant === "outline" ? colors.surface : colors.transparent;
  const foregroundColor = isDisabled ? colors.disabledText : variant === "filled" ? toneColors.on : toneColors.base;
  const borderColor = isDisabled ? colors.disabled : variant === "outline" ? (0, _utils.withAlpha)(toneColors.base, 0.42) : colors.transparent;
  const placementStyle = placement === "none" ? {} : {
    position: "absolute",
    bottom: placement.startsWith("bottom") ? resolvedOffset : undefined,
    top: placement.startsWith("top") ? resolvedOffset : undefined,
    right: placement.endsWith("end") ? resolvedOffset : undefined,
    left: placement.endsWith("start") ? resolvedOffset : undefined,
    zIndex: 100
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.View, {
    style: [placementStyle, animated ? animatedStyle : undefined],
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Pressable, {
      accessibilityRole: "button",
      disabled: isDisabled,
      onPressIn: event => {
        if (animated) {
          press.value = (0, _reactNativeReanimated.withSpring)(0.94, {
            damping: 16,
            stiffness: 260
          });
        }
        onPressIn?.(event);
      },
      onPressOut: event => {
        if (animated) {
          press.value = (0, _reactNativeReanimated.withSpring)(1, {
            damping: 16,
            stiffness: 260
          });
        }
        onPressOut?.(event);
      },
      style: ({
        pressed
      }) => [{
        minWidth: extended ? undefined : dimension,
        width: fullWidth ? "100%" : undefined,
        height: dimension,
        paddingHorizontal: extended ? fabTokens.paddingX[size] : 0,
        borderRadius: radii.full,
        borderWidth: variant === "outline" ? components.borderWidth.strong : 0,
        borderColor,
        backgroundColor,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.sm,
        opacity: !animated && pressed && !isDisabled ? 0.78 : 1
      }, style],
      ...props,
      children: [loading ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.ActivityIndicator, {
        size: "small",
        color: foregroundColor
      }) : (0, _types.renderIcon)(icon, foregroundColor, iconSize), extended && label ? typeof label === "string" ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
        style: [typography.label, {
          color: foregroundColor
        }, textStyle],
        children: label
      }) : label : null]
    })
  });
}
//# sourceMappingURL=FloatingActionButton.js.map