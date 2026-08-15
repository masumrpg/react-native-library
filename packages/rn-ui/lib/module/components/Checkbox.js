"use strict";

import React from "react";
import { Pressable, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useTheme } from "../theme/index.js";
import { renderIcon } from "./types.js";
import { jsx as _jsx } from "react/jsx-runtime";
// Pure SVG/Vector checkmark to avoid external dependencies
function CheckIcon({
  color
}) {
  return /*#__PURE__*/_jsx(View, {
    style: {
      width: 10,
      height: 6,
      borderLeftWidth: 1.8,
      borderBottomWidth: 1.8,
      borderColor: color,
      transform: [{
        rotate: "-45deg"
      }],
      marginTop: -2
    }
  });
}
export function Checkbox({
  checked = false,
  onCheckedChange,
  disabled = false,
  invalid = false,
  style,
  icon,
  ...props
}) {
  const {
    colors,
    components
  } = useTheme();
  const progress = useSharedValue(checked ? 1 : 0);
  React.useEffect(() => {
    progress.value = withSpring(checked ? 1 : 0, {
      damping: 14,
      stiffness: 220
    });
  }, [checked, progress]);
  const handlePress = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };
  const borderColor = invalid ? colors.danger : checked ? colors.primary : colors.border;
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{
      scale: 0.65 + progress.value * 0.35
    }]
  }));
  return /*#__PURE__*/_jsx(Pressable, {
    accessibilityRole: "checkbox",
    accessibilityState: {
      checked,
      disabled
    },
    onPress: handlePress,
    disabled: disabled,
    style: ({
      pressed
    }) => [{
      width: 18,
      height: 18,
      borderRadius: 4,
      borderWidth: components.borderWidth.focus,
      borderColor,
      backgroundColor: colors.transparent,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      opacity: disabled ? 0.5 : pressed ? 0.82 : 1
    }, style],
    ...props,
    children: /*#__PURE__*/_jsx(Animated.View, {
      style: [{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: invalid ? colors.danger : colors.primary,
        justifyContent: "center",
        alignItems: "center"
      }, overlayStyle],
      children: icon ? renderIcon(icon, colors.onPrimary, 12) : /*#__PURE__*/_jsx(CheckIcon, {
        color: colors.onPrimary
      })
    })
  });
}
//# sourceMappingURL=Checkbox.js.map