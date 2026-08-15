"use strict";

import React, { useEffect, useState } from "react";
import { Modal, Pressable, View } from "react-native";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useTheme } from "../theme/index.js";
import { renderIcon } from "./types.js";
import { Button } from "./Button.js";
import { Text } from "./Text.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return /*#__PURE__*/_jsx(Text, {
      variant: variant,
      color: color,
      style: style,
      children: content
    });
  }
  return content;
}
export function AlertDialog({
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
  } = useTheme();
  const [mounted, setMounted] = useState(visible);
  const progress = useSharedValue(visible ? 1 : 0);
  const toneColor = getToneColor(tone, colors);
  useEffect(() => {
    if (visible) {
      setMounted(true);
    }
    if (!animated) {
      if (!visible) {
        setMounted(false);
      }
      return;
    }
    progress.value = withTiming(visible ? 1 : 0, {
      duration: animationDuration
    }, finished => {
      if (finished && !visible) {
        runOnJS(setMounted)(false);
      }
    });
  }, [animated, animationDuration, progress, visible]);
  const animatedStyle = useAnimatedStyle(() => ({
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
  const dialog = /*#__PURE__*/_jsxs(View, {
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
    children: [/*#__PURE__*/_jsxs(View, {
      style: {
        flexDirection: "row",
        gap: spacing.md,
        alignItems: "flex-start"
      },
      children: [icon ? /*#__PURE__*/_jsx(View, {
        style: {
          width: 40,
          height: 40,
          borderRadius: radii.lg,
          backgroundColor: colors.backgroundMuted,
          alignItems: "center",
          justifyContent: "center"
        },
        children: renderIcon(icon, toneColor, 22)
      }) : null, /*#__PURE__*/_jsxs(View, {
        style: [{
          flex: 1,
          gap: spacing.xs
        }, contentStyle],
        children: [title ? renderDialogText(title, "title", "text", titleStyle) : null, description ? renderDialogText(description, "bodySmall", "textMuted", descriptionStyle) : null]
      }), onClose ? /*#__PURE__*/_jsx(Pressable, {
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
        children: closeIcon ? renderIcon(closeIcon, colors.textMuted, 18) : /*#__PURE__*/_jsx(Text, {
          variant: "label",
          color: "textMuted",
          children: "x"
        })
      }) : null]
    }), children ? /*#__PURE__*/_jsx(View, {
      children: children
    }) : null, onCancel || onConfirm ? /*#__PURE__*/_jsxs(View, {
      style: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: spacing.sm
      },
      children: [onCancel ? /*#__PURE__*/_jsx(Button, {
        variant: "outline",
        tone: "secondary",
        size: "sm",
        disabled: cancelDisabled,
        onPress: onCancel,
        children: cancelText
      }) : null, onConfirm ? /*#__PURE__*/_jsx(Button, {
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
  return /*#__PURE__*/_jsx(Modal, {
    visible: mounted,
    transparent: true,
    animationType: "none",
    statusBarTranslucent: true,
    navigationBarTranslucent: true,
    hardwareAccelerated: true,
    onRequestClose: requestClose,
    ...modalProps,
    children: /*#__PURE__*/_jsxs(View, {
      style: [{
        flex: 1,
        backgroundColor: colors.overlay,
        padding: spacing.xl,
        alignItems: "center",
        justifyContent: "center"
      }, overlayStyle],
      children: [/*#__PURE__*/_jsx(Pressable, {
        accessibilityRole: "button",
        style: {
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        onPress: handleBackdropPress
      }), animated ? /*#__PURE__*/_jsx(Animated.View, {
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