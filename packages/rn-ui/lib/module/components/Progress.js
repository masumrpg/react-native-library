"use strict";

import React from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useTheme } from "../theme/index.js";
import { jsx as _jsx } from "react/jsx-runtime";
export function Progress({
  value = 0,
  max = 100,
  animated = true,
  style,
  indicatorStyle,
  ...props
}) {
  const {
    colors,
    radii
  } = useTheme();
  const progress = Math.max(0, Math.min(1, max <= 0 ? 0 : value / max));
  const width = useSharedValue(progress);
  React.useEffect(() => {
    if (!animated) {
      width.value = progress;
      return;
    }
    width.value = withTiming(progress, {
      duration: 180
    });
  }, [animated, progress, width]);
  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`
  }));
  return /*#__PURE__*/_jsx(View, {
    accessibilityRole: "progressbar",
    accessibilityValue: {
      min: 0,
      max,
      now: value
    },
    style: [{
      width: "100%",
      height: 10,
      borderRadius: radii.full,
      overflow: "hidden",
      backgroundColor: colors.backgroundSubtle
    }, style],
    ...props,
    children: /*#__PURE__*/_jsx(Animated.View, {
      style: [{
        height: "100%",
        borderRadius: radii.full,
        backgroundColor: colors.primary
      }, indicatorAnimatedStyle, indicatorStyle]
    })
  });
}
//# sourceMappingURL=Progress.js.map