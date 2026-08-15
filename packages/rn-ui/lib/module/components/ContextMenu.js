"use strict";

import React from "react";
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useTheme } from "../theme/index.js";
import { Text } from "./Text.js";
import { renderIcon } from "./types.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const ContextMenuContext = /*#__PURE__*/React.createContext(null);
export function useContextMenu() {
  const context = React.useContext(ContextMenuContext);
  if (!context) {
    throw new Error("useContextMenu must be used within a <ContextMenu />");
  }
  return context;
}
export function ContextMenu({
  children
}) {
  const {
    colors
  } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [triggerLayout, setTriggerLayout] = React.useState({
    pageX: 0,
    pageY: 0,
    width: 0,
    height: 0
  });
  return /*#__PURE__*/_jsx(ContextMenuContext.Provider, {
    value: {
      open,
      setOpen,
      triggerLayout,
      setTriggerLayout,
      colors
    },
    children: /*#__PURE__*/_jsx(View, {
      style: {
        width: "100%"
      },
      children: children
    })
  });
}
export function ContextMenuTrigger({
  children,
  style,
  disabled = false
}) {
  const {
    setOpen,
    setTriggerLayout
  } = useContextMenu();
  const triggerRef = React.useRef(null);
  const handleLongPress = () => {
    if (!disabled) {
      triggerRef.current?.measureInWindow((x, y, width, height) => {
        if (width > 0 && height > 0) {
          setTriggerLayout({
            pageX: x,
            pageY: y,
            width,
            height
          });
          setOpen(true);
        }
      });
    }
  };
  return /*#__PURE__*/_jsx(Pressable, {
    ref: triggerRef,
    onLongPress: handleLongPress,
    delayLongPress: 500 // Standard Android/iOS long press timing
    ,
    style: style,
    children: children
  });
}
export function ContextMenuContent({
  children,
  style,
  overlayStyle,
  modalProps,
  width = 180
}) {
  const {
    open,
    setOpen,
    triggerLayout,
    colors
  } = useContextMenu();
  const {
    components,
    radii,
    spacing
  } = useTheme();
  const progress = useSharedValue(open ? 1 : 0);
  React.useEffect(() => {
    progress.value = withTiming(open ? 1 : 0, {
      duration: 150
    });
  }, [open, progress]);
  const {
    height: SCREEN_HEIGHT
  } = Dimensions.get("window");
  const dropdownMaxHeight = 280;
  const spaceBelow = SCREEN_HEIGHT - (triggerLayout.pageY + triggerLayout.height);
  const renderAbove = spaceBelow < dropdownMaxHeight + 40;
  const positionStyle = renderAbove ? {
    bottom: SCREEN_HEIGHT - triggerLayout.pageY + 6
  } : {
    top: triggerLayout.pageY + triggerLayout.height + 6
  };
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{
      translateY: (renderAbove ? 8 : -8) * (1 - progress.value)
    }]
  }));
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
        left: Math.max(spacing.sm, triggerLayout.pageX),
        width,
        backgroundColor: colors.surface,
        borderWidth: components.borderWidth.strong,
        borderColor: colors.border,
        borderRadius: radii.lg,
        padding: spacing.xs,
        maxHeight: dropdownMaxHeight,
        overflow: "hidden"
      }, animatedStyle, positionStyle, style],
      children: /*#__PURE__*/_jsx(ScrollView, {
        keyboardShouldPersistTaps: "handled",
        children: children
      })
    })]
  });
}
export function ContextMenuItem({
  onPress,
  children,
  variant = "default",
  disabled = false,
  style
}) {
  const {
    setOpen,
    colors
  } = useContextMenu();
  const {
    radii,
    spacing,
    typography
  } = useTheme();
  const handlePress = () => {
    if (!disabled) {
      if (onPress) onPress();
      setOpen(false);
    }
  };
  const isDestructive = variant === "destructive";
  const textColor = disabled ? colors.textMuted : isDestructive ? colors.danger : colors.text;
  return /*#__PURE__*/_jsx(Pressable, {
    onPress: handlePress,
    disabled: disabled,
    style: ({
      pressed
    }) => [{
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radii.md,
      backgroundColor: pressed ? isDestructive ? colors.dangerSoft : colors.surfaceMuted : colors.transparent,
      opacity: disabled ? 0.5 : 1,
      justifyContent: "space-between"
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
export function ContextMenuSeparator({
  style
}) {
  const {
    colors
  } = useContextMenu();
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
export function ContextMenuLabel({
  children,
  style
}) {
  const {
    colors
  } = useContextMenu();
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
// Chevron checkmark for checkbox items
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
export function ContextMenuCheckboxItem({
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
  } = useContextMenu();
  const {
    radii,
    spacing,
    typography
  } = useTheme();
  const handlePress = () => {
    if (!disabled) {
      if (onCheckedChange) onCheckedChange(!checked);
      setOpen(false);
    }
  };
  const textColor = disabled ? colors.textMuted : colors.text;
  return /*#__PURE__*/_jsxs(Pressable, {
    onPress: handlePress,
    disabled: disabled,
    style: ({
      pressed
    }) => [{
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radii.md,
      backgroundColor: pressed ? colors.surfaceMuted : colors.transparent,
      opacity: disabled ? 0.5 : 1,
      justifyContent: "space-between"
    }, style],
    children: [/*#__PURE__*/_jsx(Text, {
      style: {
        ...typography.bodySmall,
        color: textColor,
        flex: 1
      },
      children: children
    }), checked && (checkIcon ? renderIcon(checkIcon, colors.primary, 14) : /*#__PURE__*/_jsx(CheckIcon, {
      color: colors.primary
    }))]
  });
}
export function ContextMenuShortcut({
  children,
  style
}) {
  const {
    colors
  } = useContextMenu();
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
//# sourceMappingURL=ContextMenu.js.map