"use strict";

import React from "react";
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useTheme } from "../theme/index.js";
import { Text } from "./Text.js";
import { renderIcon } from "./types.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const ComboboxContext = /*#__PURE__*/React.createContext(null);
export function useCombobox() {
  const context = React.useContext(ComboboxContext);
  if (!context) {
    throw new Error("useCombobox must be used within a <Combobox />");
  }
  return context;
}
export function Combobox({
  value: controlledValue,
  onValueChange,
  open: controlledOpen,
  onOpenChange,
  children
}) {
  const {
    colors
  } = useTheme();
  const [uncontrolledValue, setUncontrolledValue] = React.useState("");
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [triggerLayout, setTriggerLayout] = React.useState({
    pageX: 0,
    pageY: 0,
    width: 0,
    height: 0
  });
  const triggerRef = React.useRef(null);
  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue;
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen = React.useCallback(nextOpen => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(nextOpen);
    }
    if (onOpenChange) {
      onOpenChange(nextOpen);
    }
  }, [controlledOpen, onOpenChange]);
  const handleValueChange = React.useCallback(nextVal => {
    if (controlledValue === undefined) {
      setUncontrolledValue(nextVal);
    }
    if (onValueChange) {
      onValueChange(nextVal);
    }
  }, [controlledValue, onValueChange]);
  const measureTrigger = React.useCallback(() => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      if (width > 0 && height > 0) {
        setTriggerLayout({
          pageX: x,
          pageY: y,
          width,
          height
        });
      }
    });
  }, []);
  return /*#__PURE__*/_jsx(ComboboxContext.Provider, {
    value: {
      value,
      onValueChange: handleValueChange,
      open,
      setOpen,
      inputValue,
      setInputValue,
      triggerRef,
      triggerLayout,
      measureTrigger,
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

// Chevron pure arrow down icon
function ChevronDownIcon({
  color
}) {
  return /*#__PURE__*/_jsx(View, {
    style: {
      width: 8,
      height: 8,
      borderRightWidth: 1.5,
      borderBottomWidth: 1.5,
      borderColor: color,
      transform: [{
        rotate: "45deg"
      }],
      marginTop: -3,
      marginRight: 4
    }
  });
}
export function ComboboxInput({
  placeholder = "Select option...",
  style,
  inputStyle,
  disabled = false,
  chevronIcon
}) {
  const {
    inputValue,
    setInputValue,
    open,
    setOpen,
    triggerRef,
    measureTrigger,
    colors
  } = useCombobox();
  const {
    components,
    radii,
    spacing,
    typography
  } = useTheme();
  const handleFocus = () => {
    if (!disabled) {
      measureTrigger();
      setOpen(true);
    }
  };
  const handlePress = () => {
    if (!disabled) {
      measureTrigger();
      setOpen(!open);
    }
  };
  return /*#__PURE__*/_jsxs(Pressable, {
    ref: triggerRef,
    onPress: handlePress,
    disabled: disabled,
    style: [{
      flexDirection: "row",
      alignItems: "center",
      height: 40,
      borderWidth: components.borderWidth.strong,
      borderColor: colors.border,
      borderRadius: radii.lg,
      backgroundColor: colors.input,
      paddingHorizontal: spacing.md,
      width: "100%",
      opacity: disabled ? 0.5 : 1
    }, style],
    children: [/*#__PURE__*/_jsx(TextInput, {
      editable: !disabled,
      placeholder: placeholder,
      placeholderTextColor: colors.textMuted,
      value: inputValue,
      onChangeText: setInputValue,
      onFocus: handleFocus,
      pointerEvents: disabled ? "none" : "auto",
      style: [{
        flex: 1,
        ...typography.bodySmall,
        color: colors.text,
        padding: 0,
        height: "100%"
      }, inputStyle]
    }), chevronIcon ? renderIcon(chevronIcon, colors.textMuted, 16) : /*#__PURE__*/_jsx(ChevronDownIcon, {
      color: colors.textMuted
    })]
  });
}
export function ComboboxContent({
  children,
  style,
  overlayStyle,
  modalProps
}) {
  const {
    open,
    setOpen,
    triggerLayout,
    colors
  } = useCombobox();
  const {
    components,
    radii
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
  const spaceBelow = SCREEN_HEIGHT - (triggerLayout.pageY + triggerLayout.height);
  const dropdownMaxHeight = 220;
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
        left: triggerLayout.pageX,
        width: triggerLayout.width,
        backgroundColor: colors.surface,
        borderWidth: components.borderWidth.strong,
        borderColor: colors.border,
        borderRadius: radii.lg,
        maxHeight: dropdownMaxHeight,
        overflow: "hidden"
      }, animatedStyle, positionStyle, style],
      children: children
    })]
  });
}
export function ComboboxList({
  children,
  style
}) {
  const {
    spacing
  } = useTheme();
  return /*#__PURE__*/_jsx(ScrollView, {
    keyboardShouldPersistTaps: "handled",
    style: [{
      flex: 1,
      padding: spacing.xs
    }, style],
    children: children
  });
}
// Chevron checkmark for selected indicator
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
      marginRight: 6
    }
  });
}
export function ComboboxItem({
  value,
  label,
  children,
  style,
  checkIcon
}) {
  const {
    value: selectedValue,
    onValueChange,
    setOpen,
    inputValue,
    setInputValue,
    colors
  } = useCombobox();
  const {
    radii,
    spacing,
    typography
  } = useTheme();

  // Automatic filter matching
  if (inputValue && !label.toLowerCase().includes(inputValue.toLowerCase())) {
    return null;
  }
  const isSelected = selectedValue === value;
  const handlePress = () => {
    onValueChange(value);
    setInputValue(label);
    setOpen(false);
  };
  return /*#__PURE__*/_jsxs(Pressable, {
    onPress: handlePress,
    style: ({
      pressed
    }) => [{
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.sm + 1,
      paddingHorizontal: spacing.md,
      borderRadius: radii.md,
      backgroundColor: isSelected ? colors.surfaceMuted : pressed ? colors.surfaceMuted : colors.transparent,
      justifyContent: "space-between"
    }, style],
    children: [/*#__PURE__*/_jsx(Text, {
      style: {
        ...typography.bodySmall,
        color: colors.text,
        fontWeight: isSelected ? "500" : "400"
      },
      children: children || label
    }), isSelected && (checkIcon ? renderIcon(checkIcon, colors.primary, 14) : /*#__PURE__*/_jsx(CheckIcon, {
      color: colors.primary
    }))]
  });
}
export function ComboboxEmpty({
  children = "No results found.",
  style
}) {
  const {
    colors
  } = useCombobox();
  const {
    spacing,
    typography
  } = useTheme();
  return /*#__PURE__*/_jsx(View, {
    style: [{
      padding: spacing.md,
      alignItems: "center"
    }, style],
    children: /*#__PURE__*/_jsx(Text, {
      style: {
        ...typography.caption,
        color: colors.textMuted
      },
      children: children
    })
  });
}
//# sourceMappingURL=Combobox.js.map