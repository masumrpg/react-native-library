"use strict";

import React from "react";
import { PanResponder, Platform, Pressable, StatusBar, View } from "react-native";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { useTheme } from "../theme/index.js";
import { Button } from "./Button.js";
import { Text } from "./Text.js";
import { renderIcon } from "./types.js";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export const ToastContext = /*#__PURE__*/React.createContext(null);
function createToastId() {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
export function ToastProvider({
  children,
  placement = "top",
  offset,
  duration = 3500,
  maxToasts = 3,
  swipeToDismiss = true,
  renderToast,
  viewportStyle
}) {
  const [toasts, setToasts] = React.useState([]);
  const timers = React.useRef(new Map());
  const clearTimer = React.useCallback(id => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);
  const remove = React.useCallback(id => {
    clearTimer(id);
    setToasts(current => current.filter(toast => toast.id !== id));
  }, [clearTimer]);
  const dismiss = React.useCallback(id => {
    setToasts(current => current.map(toast => {
      if (id && toast.id !== id) return toast;
      clearTimer(toast.id);
      return {
        ...toast,
        open: false
      };
    }));
  }, [clearTimer]);
  const scheduleDismiss = React.useCallback(toast => {
    clearTimer(toast.id);
    if (toast.duration <= 0) return;
    const timer = setTimeout(() => dismiss(toast.id), toast.duration);
    timers.current.set(toast.id, timer);
  }, [clearTimer, dismiss]);
  const show = React.useCallback(options => {
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
  const update = React.useCallback((id, options) => {
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
  React.useEffect(() => () => {
    timers.current.forEach(timer => clearTimeout(timer));
    timers.current.clear();
  }, []);
  const controls = React.useMemo(() => ({
    show,
    dismiss,
    update
  }), [dismiss, show, update]);
  return /*#__PURE__*/_jsx(ToastContext.Provider, {
    value: controls,
    children: /*#__PURE__*/_jsxs(View, {
      style: {
        flex: 1
      },
      children: [children, /*#__PURE__*/_jsx(ToastViewport, {
        placement: placement,
        offset: offset,
        style: viewportStyle,
        children: toasts.map(toast => renderToast ? /*#__PURE__*/_jsx(React.Fragment, {
          children: renderToast(toast, controls)
        }, toast.id) : /*#__PURE__*/_jsx(Toast, {
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
export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
export function ToastViewport({
  placement = "top",
  offset,
  style,
  ...props
}) {
  const {
    spacing
  } = useTheme();
  const defaultOffset = Platform.OS === "android" ? placement === "top" ? (StatusBar.currentHeight ?? 0) + spacing.lg : spacing.xxxl + spacing.lg : spacing.xxl;
  const resolvedOffset = offset ?? defaultOffset;
  return /*#__PURE__*/_jsx(View, {
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
export function Toast({
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
  } = useTheme();
  const progress = useSharedValue(0);
  const translateX = useSharedValue(0);
  const tone = getToastTone(toast.tone, colors);
  React.useEffect(() => {
    progress.value = withTiming(toast.open ? 1 : 0, {
      duration: 180
    }, finished => {
      if (finished && !toast.open) {
        if (onCloseComplete) {
          runOnJS(onCloseComplete)();
        }
      }
    });
  }, [onCloseComplete, progress, toast.open]);
  const panResponder = React.useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_event, gesture) => swipeToDismiss && Math.abs(gesture.dx) > 8 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
    onPanResponderMove: (_event, gesture) => {
      translateX.value = gesture.dx;
    },
    onPanResponderRelease: (_event, gesture) => {
      if (Math.abs(gesture.dx) > 72) {
        translateX.value = withTiming(gesture.dx > 0 ? 420 : -420, {
          duration: 160
        }, finished => {
          if (finished && onDismiss) {
            runOnJS(onDismiss)();
          }
        });
        return;
      }
      translateX.value = withSpring(0, {
        damping: 16,
        stiffness: 180
      });
    }
  }), [onDismiss, swipeToDismiss, translateX]);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{
      translateY: (placement === "top" ? -14 : 14) * (1 - progress.value)
    }, {
      translateX: translateX.value
    }]
  }));
  return /*#__PURE__*/_jsx(Animated.View, {
    pointerEvents: "box-none",
    style: animatedStyle,
    ...(swipeToDismiss ? panResponder.panHandlers : {}),
    children: /*#__PURE__*/_jsxs(View, {
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
      children: [toast.icon ? /*#__PURE__*/_jsx(View, {
        style: {
          width: 32,
          height: 32,
          borderRadius: radii.lg,
          backgroundColor: tone.soft,
          alignItems: "center",
          justifyContent: "center"
        },
        children: renderIcon(toast.icon, tone.base, 18)
      }) : null, /*#__PURE__*/_jsxs(ToastContent, {
        children: [toast.title ? /*#__PURE__*/_jsx(ToastTitle, {
          children: toast.title
        }) : null, toast.description ? /*#__PURE__*/_jsx(ToastDescription, {
          children: toast.description
        }) : null]
      }), toast.action ? /*#__PURE__*/_jsx(ToastAction, {
        label: toast.action.label,
        onPress: () => {
          toast.action?.onPress();
          onDismiss?.();
        }
      }) : null, /*#__PURE__*/_jsx(ToastClose, {
        onPress: onDismiss,
        icon: toast.closeIcon
      })]
    })
  });
}
export function ToastContent({
  style,
  ...props
}) {
  const {
    spacing
  } = useTheme();
  return /*#__PURE__*/_jsx(View, {
    style: [{
      flex: 1,
      gap: spacing.xs
    }, style],
    ...props
  });
}
export function ToastTitle({
  children,
  style
}) {
  if (typeof children !== "string") return /*#__PURE__*/_jsx(_Fragment, {
    children: children
  });
  return /*#__PURE__*/_jsx(Text, {
    variant: "label",
    color: "text",
    style: style,
    children: children
  });
}
export function ToastDescription({
  children,
  style
}) {
  if (typeof children !== "string") return /*#__PURE__*/_jsx(_Fragment, {
    children: children
  });
  return /*#__PURE__*/_jsx(Text, {
    variant: "bodySmall",
    color: "textMuted",
    style: style,
    children: children
  });
}
export function ToastAction({
  label,
  onPress
}) {
  return /*#__PURE__*/_jsx(Button, {
    size: "xs",
    variant: "outline",
    tone: "secondary",
    onPress: onPress,
    children: label
  });
}
export function ToastClose({
  onPress,
  icon
}) {
  const {
    colors
  } = useTheme();
  return /*#__PURE__*/_jsx(Pressable, {
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
    children: icon ? renderIcon(icon, colors.textMuted, 16) : /*#__PURE__*/_jsx(Text, {
      variant: "label",
      color: "textMuted",
      children: "x"
    })
  });
}
//# sourceMappingURL=Toast.js.map