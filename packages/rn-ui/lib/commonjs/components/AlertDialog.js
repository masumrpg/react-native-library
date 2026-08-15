"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertDialog = AlertDialog;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _theme = require("../theme");
var _types = require("./types");
var _Button = require("./Button");
var _Text = require("./Text");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function getToneColor(tone, colors) {
  if (tone === "primary") return colors.primary;
  if (tone === "success") return colors.success;
  if (tone === "warning") return colors.warning;
  if (tone === "danger") return colors.danger;
  if (tone === "info") return colors.info;
  return colors.secondary;
}
function renderDialogText(content, variant, color, style) {
  if (typeof content === "string") {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
      variant: variant,
      color: color,
      style: style,
      children: content
    });
  }
  return content;
}
function AlertDialog({
  visible,
  title,
  description,
  children,
  tone = "primary",
  icon,
  closeIcon,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  onClose,
  confirmLoading = false,
  confirmDisabled = false,
  cancelDisabled = false,
  dismissOnBackdropPress = true,
  animated = true,
  animationDuration = 180,
  modalProps,
  overlayStyle,
  style,
  contentStyle,
  titleStyle,
  descriptionStyle
}) {
  const {
    colors,
    components,
    radii,
    spacing
  } = (0, _theme.useTheme)();
  const [mounted, setMounted] = (0, _react.useState)(visible);
  const progress = (0, _reactNativeReanimated.useSharedValue)(visible ? 1 : 0);
  const toneColor = getToneColor(tone, colors);
  (0, _react.useEffect)(() => {
    if (visible) {
      setMounted(true);
    }
    if (!animated) {
      if (!visible) {
        setMounted(false);
      }
      return;
    }
    progress.value = (0, _reactNativeReanimated.withTiming)(visible ? 1 : 0, {
      duration: animationDuration
    }, finished => {
      if (finished && !visible) {
        (0, _reactNativeReanimated.runOnJS)(setMounted)(false);
      }
    });
  }, [animated, animationDuration, progress, visible]);
  const animatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    opacity: progress.value,
    transform: [{
      scale: 0.96 + progress.value * 0.04
    }, {
      translateY: 12 * (1 - progress.value)
    }]
  }));
  if (!mounted) {
    return null;
  }
  const requestClose = () => {
    onClose?.();
  };
  const handleBackdropPress = () => {
    if (dismissOnBackdropPress) {
      requestClose();
    }
  };
  const dialog = /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
    style: [{
      width: "100%",
      maxWidth: 420,
      backgroundColor: colors.surface,
      borderRadius: radii.xxl,
      borderWidth: components.borderWidth.strong,
      borderColor: colors.border,
      padding: spacing.lg,
      gap: spacing.lg
    }, style],
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
      style: {
        flexDirection: "row",
        gap: spacing.md,
        alignItems: "flex-start"
      },
      children: [icon ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
        style: {
          width: 40,
          height: 40,
          borderRadius: radii.lg,
          backgroundColor: colors.backgroundMuted,
          alignItems: "center",
          justifyContent: "center"
        },
        children: (0, _types.renderIcon)(icon, toneColor, 22)
      }) : null, /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
        style: [{
          flex: 1,
          gap: spacing.xs
        }, contentStyle],
        children: [title ? renderDialogText(title, "title", "text", titleStyle) : null, description ? renderDialogText(description, "bodySmall", "textMuted", descriptionStyle) : null]
      }), onClose ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
        accessibilityRole: "button",
        accessibilityLabel: "Close dialog",
        onPress: requestClose,
        style: ({
          pressed
        }) => ({
          width: 32,
          height: 32,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
          opacity: pressed ? 0.72 : 1
        }),
        children: closeIcon ? (0, _types.renderIcon)(closeIcon, colors.textMuted, 18) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
          variant: "label",
          color: "textMuted",
          children: "x"
        })
      }) : null]
    }), children ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      children: children
    }) : null, onCancel || onConfirm ? /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
      style: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: spacing.sm
      },
      children: [onCancel ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.Button, {
        variant: "outline",
        tone: "secondary",
        size: "sm",
        disabled: cancelDisabled,
        onPress: onCancel,
        children: cancelText
      }) : null, onConfirm ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.Button, {
        variant: "filled",
        tone: tone,
        size: "sm",
        loading: confirmLoading,
        disabled: confirmDisabled,
        onPress: onConfirm,
        children: confirmText
      }) : null]
    }) : null]
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Modal, {
    visible: mounted,
    transparent: true,
    animationType: "none",
    statusBarTranslucent: true,
    navigationBarTranslucent: true,
    hardwareAccelerated: true,
    onRequestClose: requestClose,
    ...modalProps,
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
      style: [{
        flex: 1,
        backgroundColor: colors.overlay,
        padding: spacing.xl,
        alignItems: "center",
        justifyContent: "center"
      }, overlayStyle],
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
        accessibilityRole: "button",
        style: {
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        onPress: handleBackdropPress
      }), animated ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.View, {
        style: [{
          width: "100%",
          maxWidth: 420
        }, animatedStyle],
        children: dialog
      }) : dialog]
    })
  });
}
//# sourceMappingURL=AlertDialog.js.map