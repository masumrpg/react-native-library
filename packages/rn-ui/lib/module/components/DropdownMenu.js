"use strict";

import React from "react";
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useTheme } from "../theme/index.js";
import { Text } from "./Text.js";
import { renderIcon } from "./types.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const DropdownMenuContext = /*#__PURE__*/React.createContext(null);
export function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("useDropdownMenu must be used within a <DropdownMenu />");
  }
  return context;
}
export function DropdownMenu({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children
}) {
  const {
    colors
  } = useTheme();
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const [triggerLayout, setTriggerLayout] = React.useState({
    pageX: 0,
    pageY: 0,
    width: 0,
    height: 0
  });
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = React.useCallback(nextOpen => {
    if (!isControlled) {
      setUncontrolledOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  }, [isControlled, onOpenChange]);
  return /*#__PURE__*/_jsx(DropdownMenuContext.Provider, {
    value: {
      open,
      setOpen,
      triggerLayout,
      setTriggerLayout,
      colors
    },
    children: /*#__PURE__*/_jsx(View, {
      style: {
        alignSelf: "flex-start"
      },
      children: children
    })
  });
}
export function DropdownMenuTrigger({
  children,
  style,
  disabled = false
}) {
  const {
    open,
    setOpen,
    setTriggerLayout
  } = useDropdownMenu();
  const triggerRef = React.useRef(null);
  const handlePress = () => {
    if (disabled) return;
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      if (width > 0 && height > 0) {
        setTriggerLayout({
          pageX: x,
          pageY: y,
          width,
          height
        });
        setOpen(!open);
      }
    });
  };
  return /*#__PURE__*/_jsx(Pressable, {
    ref: triggerRef,
    accessibilityRole: "button",
    accessibilityState: {
      expanded: open,
      disabled
    },
    disabled: disabled,
    onPress: handlePress,
    style: style,
    children: children
  });
}
export function DropdownMenuContent({
  children,
  align = "start",
  width = 200,
  maxHeight = 280,
  sideOffset = 6,
  style,
  overlayStyle,
  modalProps
}) {
  const {
    open,
    setOpen,
    triggerLayout,
    colors
  } = useDropdownMenu();
  const {
    components,
    radii,
    spacing
  } = useTheme();
  const progress = useSharedValue(0);
  React.useEffect(() => {
    progress.value = withTiming(open ? 1 : 0, {
      duration: 150
    });
  }, [open, progress]);
  const {
    height: screenHeight,
    width: screenWidth
  } = Dimensions.get("window");
  const spaceBelow = screenHeight - (triggerLayout.pageY + triggerLayout.height);
  const renderAbove = spaceBelow < maxHeight + 40;
  const rawLeft = align === "end" ? triggerLayout.pageX + triggerLayout.width - width : triggerLayout.pageX;
  const left = Math.min(Math.max(spacing.sm, rawLeft), screenWidth - width - spacing.sm);
  const positionStyle = renderAbove ? {
    bottom: screenHeight - triggerLayout.pageY + sideOffset
  } : {
    top: triggerLayout.pageY + triggerLayout.height + sideOffset
  };
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [{
        translateY: renderAbove ? (1 - progress.value) * 8 : (1 - progress.value) * -8
      }, {
        scale: 0.98 + progress.value * 0.02
      }]
    };
  });
  if (!open) return null;
  return /*#__PURE__*/_jsxs(Modal, {
    transparent: true,
    visible: open,
    animationType: "none",
    statusBarTranslucent: true,
    navigationBarTranslucent: true,
    hardwareAccelerated: true,
    onRequestClose: () => setOpen(false),
    ...modalProps,
    children: [/*#__PURE__*/_jsx(Pressable, {
      style: [StyleSheet.absoluteFill, overlayStyle],
      onPress: () => setOpen(false)
    }), /*#__PURE__*/_jsx(Animated.View, {
      style: [{
        position: "absolute",
        left,
        width,
        backgroundColor: colors.surface,
        borderWidth: components.borderWidth.strong,
        borderColor: colors.border,
        borderRadius: radii.lg,
        padding: spacing.xs,
        maxHeight,
        overflow: "hidden"
      }, positionStyle, animatedStyle, style],
      children: /*#__PURE__*/_jsx(ScrollView, {
        keyboardShouldPersistTaps: "handled",
        children: children
      })
    })]
  });
}
export function DropdownMenuItem({
  onPress,
  children,
  variant = "default",
  disabled = false,
  style
}) {
  const {
    setOpen,
    colors
  } = useDropdownMenu();
  const {
    radii,
    spacing,
    typography
  } = useTheme();
  const isDestructive = variant === "destructive";
  const textColor = disabled ? colors.textMuted : isDestructive ? colors.danger : colors.text;
  const handlePress = () => {
    if (disabled) return;
    onPress?.();
    setOpen(false);
  };
  return /*#__PURE__*/_jsx(Pressable, {
    disabled: disabled,
    onPress: handlePress,
    style: ({
      pressed
    }) => [{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radii.md,
      backgroundColor: pressed ? isDestructive ? colors.dangerSoft : colors.surfaceMuted : colors.transparent,
      opacity: disabled ? 0.5 : 1
    }, style],
    children: typeof children === "string" ? /*#__PURE__*/_jsx(Text, {
      style: {
        ...typography.bodySmall,
        color: textColor
      },
      children: children
    }) : children
  });
}
function CheckIcon({
  color
}) {
  return /*#__PURE__*/_jsx(View, {
    style: {
      width: 8,
      height: 5,
      borderLeftWidth: 1.75,
      borderBottomWidth: 1.75,
      borderColor: color,
      transform: [{
        rotate: "-45deg"
      }],
      marginRight: 2
    }
  });
}
export function DropdownMenuCheckboxItem({
  checked = false,
  onCheckedChange,
  children,
  disabled = false,
  style,
  checkIcon
}) {
  const {
    setOpen,
    colors
  } = useDropdownMenu();
  const {
    radii,
    spacing,
    typography
  } = useTheme();
  const handlePress = () => {
    if (disabled) return;
    onCheckedChange?.(!checked);
    setOpen(false);
  };
  return /*#__PURE__*/_jsxs(Pressable, {
    disabled: disabled,
    onPress: handlePress,
    style: ({
      pressed
    }) => [{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radii.md,
      backgroundColor: pressed ? colors.surfaceMuted : colors.transparent,
      opacity: disabled ? 0.5 : 1
    }, style],
    children: [/*#__PURE__*/_jsx(Text, {
      style: {
        ...typography.bodySmall,
        color: disabled ? colors.textMuted : colors.text,
        flex: 1
      },
      children: children
    }), checked && (checkIcon ? renderIcon(checkIcon, colors.primary, 14) : /*#__PURE__*/_jsx(CheckIcon, {
      color: colors.primary
    }))]
  });
}
export function DropdownMenuSeparator({
  style
}) {
  const {
    colors
  } = useDropdownMenu();
  const {
    spacing
  } = useTheme();
  return /*#__PURE__*/_jsx(View, {
    style: [{
      height: 1,
      backgroundColor: colors.border,
      marginVertical: spacing.xs
    }, style]
  });
}
export function DropdownMenuLabel({
  children,
  style
}) {
  const {
    colors
  } = useDropdownMenu();
  const {
    spacing,
    typography
  } = useTheme();
  return /*#__PURE__*/_jsx(View, {
    style: [{
      paddingVertical: spacing.xs + 2,
      paddingHorizontal: spacing.md
    }, style],
    children: typeof children === "string" ? /*#__PURE__*/_jsx(Text, {
      style: {
        ...typography.labelSmall,
        color: colors.textMuted
      },
      children: children
    }) : children
  });
}
export function DropdownMenuShortcut({
  children,
  style
}) {
  const {
    colors
  } = useDropdownMenu();
  const {
    spacing,
    typography
  } = useTheme();
  return /*#__PURE__*/_jsx(Text, {
    style: [{
      ...typography.caption,
      color: colors.textMuted,
      marginLeft: spacing.sm
    }, style],
    children: children
  });
}
//# sourceMappingURL=DropdownMenu.js.map