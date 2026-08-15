"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Toast = Toast;
exports.ToastAction = ToastAction;
exports.ToastClose = ToastClose;
exports.ToastContent = ToastContent;
exports.ToastContext = void 0;
exports.ToastDescription = ToastDescription;
exports.ToastProvider = ToastProvider;
exports.ToastTitle = ToastTitle;
exports.ToastViewport = ToastViewport;
exports.useToast = useToast;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _theme = require("../theme");
var _Button = require("./Button");
var _Text = require("./Text");
var _types = require("./types");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const ToastContext = exports.ToastContext = /*#__PURE__*/_react.default.createContext(null);
function createToastId() {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function ToastProvider({
  children,
  placement = "top",
  offset,
  duration = 3500,
  maxToasts = 3,
  swipeToDismiss = true,
  renderToast,
  viewportStyle
}) {
  const [toasts, setToasts] = _react.default.useState([]);
  const timers = _react.default.useRef(new Map());
  const clearTimer = _react.default.useCallback(id => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);
  const remove = _react.default.useCallback(id => {
    clearTimer(id);
    setToasts(current => current.filter(toast => toast.id !== id));
  }, [clearTimer]);
  const dismiss = _react.default.useCallback(id => {
    setToasts(current => current.map(toast => {
      if (id && toast.id !== id) return toast;
      clearTimer(toast.id);
      return {
        ...toast,
        open: false
      };
    }));
  }, [clearTimer]);
  const scheduleDismiss = _react.default.useCallback(toast => {
    clearTimer(toast.id);
    if (toast.duration <= 0) return;
    const timer = setTimeout(() => dismiss(toast.id), toast.duration);
    timers.current.set(toast.id, timer);
  }, [clearTimer, dismiss]);
  const show = _react.default.useCallback(options => {
    const id = options.id ?? createToastId();
    const nextToast = {
      ...options,
      id,
      tone: options.tone ?? "default",
      duration: options.duration ?? duration,
      open: true
    };
    setToasts(current => {
      const withoutDuplicate = current.filter(toast => toast.id !== id);
      const next = placement === "top" ? [nextToast, ...withoutDuplicate] : [...withoutDuplicate, nextToast];
      return placement === "top" ? next.slice(0, maxToasts) : next.slice(-maxToasts);
    });
    scheduleDismiss(nextToast);
    return id;
  }, [duration, maxToasts, placement, scheduleDismiss]);
  const update = _react.default.useCallback((id, options) => {
    setToasts(current => current.map(toast => {
      if (toast.id !== id) return toast;
      const nextToast = {
        ...toast,
        ...options,
        duration: options.duration ?? toast.duration,
        open: true
      };
      scheduleDismiss(nextToast);
      return nextToast;
    }));
  }, [scheduleDismiss]);
  _react.default.useEffect(() => () => {
    timers.current.forEach(timer => clearTimeout(timer));
    timers.current.clear();
  }, []);
  const controls = _react.default.useMemo(() => ({
    show,
    dismiss,
    update
  }), [dismiss, show, update]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(ToastContext.Provider, {
    value: controls,
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
      style: {
        flex: 1
      },
      children: [children, /*#__PURE__*/(0, _jsxRuntime.jsx)(ToastViewport, {
        placement: placement,
        offset: offset,
        style: viewportStyle,
        children: toasts.map(toast => renderToast ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_react.default.Fragment, {
          children: renderToast(toast, controls)
        }, toast.id) : /*#__PURE__*/(0, _jsxRuntime.jsx)(Toast, {
          toast: toast,
          placement: placement,
          swipeToDismiss: swipeToDismiss,
          onDismiss: () => dismiss(toast.id),
          onCloseComplete: () => remove(toast.id)
        }, toast.id))
      })]
    })
  });
}
function useToast() {
  const context = _react.default.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
function ToastViewport({
  placement = "top",
  offset,
  style,
  ...props
}) {
  const {
    spacing
  } = (0, _theme.useTheme)();
  const defaultOffset = _reactNative.Platform.OS === "android" ? placement === "top" ? (_reactNative.StatusBar.currentHeight ?? 0) + spacing.lg : spacing.xxxl + spacing.lg : spacing.xxl;
  const resolvedOffset = offset ?? defaultOffset;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    pointerEvents: "box-none",
    style: [{
      position: "absolute",
      left: spacing.lg,
      right: spacing.lg,
      top: placement === "top" ? resolvedOffset : undefined,
      bottom: placement === "bottom" ? resolvedOffset : undefined,
      gap: spacing.sm,
      zIndex: 1000
    }, style],
    ...props
  });
}
function getToastTone(tone, colors) {
  if (tone === "success") return {
    base: colors.success,
    soft: colors.successSoft
  };
  if (tone === "warning") return {
    base: colors.warning,
    soft: colors.warningSoft
  };
  if (tone === "danger") return {
    base: colors.danger,
    soft: colors.dangerSoft
  };
  if (tone === "info") return {
    base: colors.info,
    soft: colors.infoSoft
  };
  return {
    base: colors.primary,
    soft: colors.surface
  };
}
function Toast({
  toast,
  placement = "top",
  swipeToDismiss = true,
  onDismiss,
  onCloseComplete,
  style,
  ...props
}) {
  const {
    colors,
    components,
    radii,
    spacing
  } = (0, _theme.useTheme)();
  const progress = (0, _reactNativeReanimated.useSharedValue)(0);
  const translateX = (0, _reactNativeReanimated.useSharedValue)(0);
  const tone = getToastTone(toast.tone, colors);
  _react.default.useEffect(() => {
    progress.value = (0, _reactNativeReanimated.withTiming)(toast.open ? 1 : 0, {
      duration: 180
    }, finished => {
      if (finished && !toast.open) {
        if (onCloseComplete) {
          (0, _reactNativeReanimated.runOnJS)(onCloseComplete)();
        }
      }
    });
  }, [onCloseComplete, progress, toast.open]);
  const panResponder = _react.default.useMemo(() => _reactNative.PanResponder.create({
    onMoveShouldSetPanResponder: (_event, gesture) => swipeToDismiss && Math.abs(gesture.dx) > 8 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
    onPanResponderMove: (_event, gesture) => {
      translateX.value = gesture.dx;
    },
    onPanResponderRelease: (_event, gesture) => {
      if (Math.abs(gesture.dx) > 72) {
        translateX.value = (0, _reactNativeReanimated.withTiming)(gesture.dx > 0 ? 420 : -420, {
          duration: 160
        }, finished => {
          if (finished && onDismiss) {
            (0, _reactNativeReanimated.runOnJS)(onDismiss)();
          }
        });
        return;
      }
      translateX.value = (0, _reactNativeReanimated.withSpring)(0, {
        damping: 16,
        stiffness: 180
      });
    }
  }), [onDismiss, swipeToDismiss, translateX]);
  const animatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    opacity: progress.value,
    transform: [{
      translateY: (placement === "top" ? -14 : 14) * (1 - progress.value)
    }, {
      translateX: translateX.value
    }]
  }));
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.View, {
    pointerEvents: "box-none",
    style: animatedStyle,
    ...(swipeToDismiss ? panResponder.panHandlers : {}),
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
      accessibilityRole: "alert",
      style: [{
        width: "100%",
        borderRadius: radii.xl,
        borderWidth: components.borderWidth.strong,
        borderColor: tone.base,
        backgroundColor: colors.surface,
        padding: spacing.md,
        flexDirection: "row",
        gap: spacing.md,
        alignItems: "flex-start"
      }, style],
      ...props,
      children: [toast.icon ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
        style: {
          width: 32,
          height: 32,
          borderRadius: radii.lg,
          backgroundColor: tone.soft,
          alignItems: "center",
          justifyContent: "center"
        },
        children: (0, _types.renderIcon)(toast.icon, tone.base, 18)
      }) : null, /*#__PURE__*/(0, _jsxRuntime.jsxs)(ToastContent, {
        children: [toast.title ? /*#__PURE__*/(0, _jsxRuntime.jsx)(ToastTitle, {
          children: toast.title
        }) : null, toast.description ? /*#__PURE__*/(0, _jsxRuntime.jsx)(ToastDescription, {
          children: toast.description
        }) : null]
      }), toast.action ? /*#__PURE__*/(0, _jsxRuntime.jsx)(ToastAction, {
        label: toast.action.label,
        onPress: () => {
          toast.action?.onPress();
          onDismiss?.();
        }
      }) : null, /*#__PURE__*/(0, _jsxRuntime.jsx)(ToastClose, {
        onPress: onDismiss,
        icon: toast.closeIcon
      })]
    })
  });
}
function ToastContent({
  style,
  ...props
}) {
  const {
    spacing
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      flex: 1,
      gap: spacing.xs
    }, style],
    ...props
  });
}
function ToastTitle({
  children,
  style
}) {
  if (typeof children !== "string") return /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {
    children: children
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
    variant: "label",
    color: "text",
    style: style,
    children: children
  });
}
function ToastDescription({
  children,
  style
}) {
  if (typeof children !== "string") return /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {
    children: children
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
    variant: "bodySmall",
    color: "textMuted",
    style: style,
    children: children
  });
}
function ToastAction({
  label,
  onPress
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.Button, {
    size: "xs",
    variant: "outline",
    tone: "secondary",
    onPress: onPress,
    children: label
  });
}
function ToastClose({
  onPress,
  icon
}) {
  const {
    colors
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
    accessibilityRole: "button",
    accessibilityLabel: "Close toast",
    onPress: onPress,
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
    children: icon ? (0, _types.renderIcon)(icon, colors.textMuted, 16) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
      variant: "label",
      color: "textMuted",
      children: "x"
    })
  });
}
//# sourceMappingURL=Toast.js.map