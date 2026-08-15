"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Alert = Alert;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _theme = require("../theme");
var _types = require("./types");
var _Text = require("./Text");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function getToneColors(tone, colors) {
  if (tone === "primary") return {
    base: colors.primary,
    soft: colors.primarySoft,
    on: colors.onPrimary
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
  if (tone === "info") return {
    base: colors.info,
    soft: colors.infoSoft,
    on: colors.onInfo
  };
  return {
    base: colors.secondary,
    soft: colors.secondarySoft,
    on: colors.onSecondary
  };
}
function renderTextContent(content, fallbackStyle) {
  if (typeof content === "string") {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
      style: fallbackStyle,
      children: content
    });
  }
  return content;
}
function Alert({
  title,
  children,
  tone = "info",
  variant = "soft",
  icon,
  action,
  dismissible = false,
  animated = true,
  animationDuration = 180,
  onClose,
  closeIcon,
  style,
  contentStyle,
  titleStyle,
  textStyle
}) {
  const {
    colors,
    components,
    radii,
    spacing
  } = (0, _theme.useTheme)();
  const [visible, setVisible] = _react.default.useState(true);
  const progress = (0, _reactNativeReanimated.useSharedValue)(1);
  const toneColors = getToneColors(tone, colors);
  const isSolid = variant === "solid";
  const backgroundColor = variant === "solid" ? toneColors.base : variant === "soft" ? toneColors.soft : colors.surface;
  const foregroundColor = isSolid ? toneColors.on : toneColors.base;
  const bodyColor = isSolid ? toneColors.on : colors.textMuted;
  const borderColor = variant === "outline" ? toneColors.base : toneColors.base;
  const animatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    opacity: progress.value,
    transform: [{
      scale: 0.98 + progress.value * 0.02
    }]
  }));
  const handleClose = () => {
    if (dismissible && animated) {
      progress.value = (0, _reactNativeReanimated.withTiming)(0, {
        duration: animationDuration
      }, finished => {
        if (finished) {
          (0, _reactNativeReanimated.runOnJS)(setVisible)(false);
        }
      });
    } else if (dismissible) {
      setVisible(false);
    }
    onClose?.();
  };
  const container = /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
    accessibilityRole: "alert",
    style: [{
      backgroundColor,
      borderColor,
      borderWidth: components.borderWidth.strong,
      borderRadius: radii.xl,
      padding: spacing.lg,
      flexDirection: "row",
      gap: spacing.md
    }, style],
    children: [(0, _types.renderIcon)(icon, foregroundColor, 20), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
      style: [{
        flex: 1,
        gap: spacing.xs
      }, contentStyle],
      children: [title ? renderTextContent(title, [{
        color: isSolid ? toneColors.on : colors.text
      }, titleStyle]) : null, children ? renderTextContent(children, [{
        color: bodyColor
      }, textStyle]) : null, action ? /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Pressable, {
        accessibilityRole: "button",
        onPress: action.onPress,
        style: ({
          pressed
        }) => ({
          alignSelf: "flex-start",
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.xs,
          marginTop: spacing.xs,
          opacity: pressed ? 0.72 : 1
        }),
        children: [(0, _types.renderIcon)(action.icon, foregroundColor, 14), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
          variant: "labelSmall",
          style: {
            color: foregroundColor
          },
          children: action.label
        })]
      }) : null]
    }), dismissible || onClose ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
      accessibilityRole: "button",
      accessibilityLabel: "Close alert",
      onPress: handleClose,
      style: ({
        pressed
      }) => ({
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        opacity: pressed ? 0.72 : 1
      }),
      children: closeIcon ? (0, _types.renderIcon)(closeIcon, foregroundColor, 16) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
        variant: "label",
        style: {
          color: foregroundColor
        },
        children: "x"
      })
    }) : null]
  });
  if (!visible) {
    return null;
  }
  if (animated) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.View, {
      style: animatedStyle,
      children: container
    });
  }
  return container;
}
//# sourceMappingURL=Alert.js.map