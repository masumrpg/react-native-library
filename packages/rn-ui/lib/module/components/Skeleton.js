"use strict";

import React from "react";
import { View } from "react-native";
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { useTheme } from "../theme/index.js";
import { jsx as _jsx } from "react/jsx-runtime";
export function Skeleton({
  animated = true,
  radius = "md",
  style,
  ...props
}) {
  const {
    colors,
    radii
  } = useTheme();
  const opacity = useSharedValue(animated ? 0.55 : 1);
  React.useEffect(() => {
    if (!animated) {
      cancelAnimation(opacity);
      opacity.value = 1;
      return;
    }
    opacity.value = withRepeat(withSequence(withTiming(1, {
      duration: 700
    }), withTiming(0.55, {
      duration: 700
    })), -1, true);
    return () => cancelAnimation(opacity);
  }, [animated, opacity]);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }));
  return /*#__PURE__*/_jsx(Animated.View, {
    style: animatedStyle,
    children: /*#__PURE__*/_jsx(View, {
      style: [{
        backgroundColor: colors.backgroundSubtle,
        borderRadius: radii[radius]
      }, style],
      ...props
    })
  });
}
//# sourceMappingURL=Skeleton.js.map