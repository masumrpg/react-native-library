"use strict";

import React from "react";
import { Pressable } from "react-native";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { useTheme } from "../theme/index.js";
import { renderIcon } from "./types.js";
import { jsx as _jsx } from "react/jsx-runtime";
export function Switch({
  value,
  defaultValue = false,
  onValueChange,
  disabled = false,
  invalid = false,
  size = "md",
  tone = "primary",
  style,
  trackStyle,
  thumbStyle,
  activeIcon,
  inactiveIcon,
  thumbContent,
  activeThumbContent,
  inactiveThumbContent,
  renderThumb,
  onPress,
  onPressIn,
  onPressOut,
  accessibilityLabel,
  ...props
}) {
  const {
    colors,
    components,
    radii
  } = useTheme();
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const checked = isControlled ? value : uncontrolledValue;
  const progress = useSharedValue(checked ? 1 : 0);
  const pressed = useSharedValue(0);
  React.useEffect(() => {
    progress.value = withSpring(checked ? 1 : 0, {
      damping: 16,
      stiffness: 240,
      mass: 0.8
    });
  }, [checked, progress]);
  const activeColor = invalid ? colors.danger : colors[tone];
  const activeSoftColor = invalid ? colors.dangerSoft : tone === "primary" ? colors.primarySoft : tone === "secondary" ? colors.secondarySoft : tone === "accent" ? colors.accentSoft : tone === "success" ? colors.successSoft : tone === "warning" ? colors.warningSoft : tone === "danger" ? colors.dangerSoft : colors.infoSoft;
  const thumbIcon = checked ? activeIcon : inactiveIcon;
  const selectedThumbContent = (checked ? activeThumbContent : inactiveThumbContent) ?? thumbContent;
  const width = components.switch.width[size];
  const height = components.switch.height[size];
  const thumbSize = components.switch.thumbSize[size];
  const iconSize = components.switch.iconSize[size];
  const borderWidth = components.borderWidth.focus;
  const inset = (height - thumbSize) / 2;
  const travel = width - thumbSize - (inset + borderWidth) * 2;
  const thumbColor = disabled ? colors.disabledText : colors.surface;
  const inactiveTrackColor = disabled ? colors.disabled : colors.backgroundMuted;
  const inactiveBorderColor = invalid ? colors.danger : colors.border;
  const handlePress = event => {
    onPress?.(event);
    if (disabled) return;
    const nextValue = !checked;
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }
    onValueChange?.(nextValue);
  };
  const handlePressIn = event => {
    onPressIn?.(event);
    pressed.value = withTiming(1, {
      duration: 120
    });
  };
  const handlePressOut = event => {
    onPressOut?.(event);
    pressed.value = withTiming(0, {
      duration: 140
    });
  };
  const trackAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [inactiveTrackColor, activeSoftColor]),
    borderColor: interpolateColor(progress.value, [0, 1], [inactiveBorderColor, activeColor])
  }));
  const thumbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{
      translateX: progress.value * travel
    }, {
      scale: 1 + pressed.value * 0.06
    }],
    backgroundColor: interpolateColor(progress.value, [0, 1], [thumbColor, activeColor])
  }));
  const iconColor = checked ? invalid ? colors.onDanger : tone === "primary" ? colors.onPrimary : tone === "secondary" ? colors.onSecondary : tone === "accent" ? colors.onAccent : tone === "success" ? colors.onSuccess : tone === "warning" ? colors.onWarning : tone === "danger" ? colors.onDanger : colors.onInfo : colors.textSubtle;
  const thumbContentParams = {
    checked,
    disabled,
    invalid,
    color: iconColor,
    size: iconSize
  };
  const renderedThumbContent = typeof selectedThumbContent === "function" ? selectedThumbContent(thumbContentParams) : selectedThumbContent;
  return /*#__PURE__*/_jsx(Pressable, {
    accessibilityRole: "switch",
    accessibilityLabel: accessibilityLabel,
    accessibilityState: {
      checked,
      disabled
    },
    disabled: disabled,
    onPress: handlePress,
    onPressIn: handlePressIn,
    onPressOut: handlePressOut,
    style: ({
      pressed: isPressed
    }) => [{
      opacity: disabled ? 0.56 : isPressed ? 0.9 : 1,
      alignSelf: "flex-start"
    }, style],
    ...props,
    children: /*#__PURE__*/_jsx(Animated.View, {
      style: [{
        width,
        height,
        borderRadius: radii.full,
        borderWidth,
        padding: inset,
        justifyContent: "center"
      }, trackAnimatedStyle, trackStyle],
      children: /*#__PURE__*/_jsx(Animated.View, {
        style: [{
          width: thumbSize,
          height: thumbSize,
          borderRadius: radii.full,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: components.borderWidth.default,
          borderColor: checked ? activeColor : colors.borderMuted
        }, thumbAnimatedStyle, thumbStyle],
        children: renderThumb ? renderThumb(thumbContentParams) : renderedThumbContent ? renderedThumbContent : thumbIcon ? renderIcon(thumbIcon, iconColor, iconSize) : null
      })
    })
  });
}
//# sourceMappingURL=Switch.js.map