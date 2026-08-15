"use strict";

import React from "react";
import { View } from "react-native";
import { useTheme } from "../theme/index.js";
import { Button } from "./Button.js";
import { Text } from "./Text.js";
import { renderIcon } from "./types.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function clampStepper(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
export function Stepper({
  value,
  defaultValue = 0,
  min = 0,
  max = 999,
  step = 1,
  disabled = false,
  onValueChange,
  decrementIcon,
  incrementIcon,
  style,
  ...props
}) {
  const {
    colors,
    components,
    radii,
    spacing
  } = useTheme();
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const currentValue = clampStepper(value ?? internalValue, min, max);
  const setNextValue = nextValue => {
    const next = clampStepper(nextValue, min, max);
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  };
  return /*#__PURE__*/_jsxs(View, {
    accessibilityRole: "adjustable",
    accessibilityValue: {
      min,
      max,
      now: currentValue
    },
    style: [{
      minHeight: 44,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: components.borderWidth.strong,
      borderColor: colors.border,
      borderRadius: radii.lg,
      backgroundColor: colors.surface,
      overflow: "hidden",
      opacity: disabled ? 0.5 : 1
    }, style],
    ...props,
    children: [/*#__PURE__*/_jsx(Button, {
      size: "sm",
      variant: "ghost",
      tone: "secondary",
      shape: "square",
      disabled: disabled || currentValue <= min,
      onPress: () => setNextValue(currentValue - step),
      children: decrementIcon ? renderIcon(decrementIcon, colors.text, 16) : "-"
    }), /*#__PURE__*/_jsx(View, {
      style: {
        minWidth: 52,
        alignItems: "center",
        paddingHorizontal: spacing.sm
      },
      children: /*#__PURE__*/_jsx(Text, {
        variant: "label",
        style: {
          fontVariant: ["tabular-nums"]
        },
        children: currentValue
      })
    }), /*#__PURE__*/_jsx(Button, {
      size: "sm",
      variant: "ghost",
      tone: "secondary",
      shape: "square",
      disabled: disabled || currentValue >= max,
      onPress: () => setNextValue(currentValue + step),
      children: incrementIcon ? renderIcon(incrementIcon, colors.text, 16) : "+"
    })]
  });
}
//# sourceMappingURL=Stepper.js.map