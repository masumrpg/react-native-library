"use strict";

import React from "react";
import { Pressable, View } from "react-native";
import { useTheme } from "../theme/index.js";
import { Text } from "./Text.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const RadioGroupContext = /*#__PURE__*/React.createContext(null);
export function RadioGroup({
  value,
  defaultValue,
  disabled = false,
  onValueChange,
  style,
  ...props
}) {
  const {
    spacing
  } = useTheme();
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const currentValue = value ?? internalValue;
  const handleValueChange = React.useCallback(next => {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  }, [onValueChange, value]);
  const context = React.useMemo(() => ({
    value: currentValue,
    disabled,
    onValueChange: handleValueChange
  }), [currentValue, disabled, handleValueChange]);
  return /*#__PURE__*/_jsx(RadioGroupContext.Provider, {
    value: context,
    children: /*#__PURE__*/_jsx(View, {
      accessibilityRole: "radiogroup",
      style: [{
        gap: spacing.sm,
        width: "100%"
      }, style],
      ...props
    })
  });
}
export function RadioGroupItem({
  value,
  label,
  description,
  disabled = false,
  style,
  ...props
}) {
  const context = React.useContext(RadioGroupContext);
  const {
    colors,
    components,
    radii,
    spacing,
    typography
  } = useTheme();
  const checked = context?.value === value;
  const isDisabled = disabled || Boolean(context?.disabled);
  return /*#__PURE__*/_jsxs(Pressable, {
    accessibilityRole: "radio",
    accessibilityState: {
      checked,
      disabled: isDisabled
    },
    disabled: isDisabled,
    onPress: () => context?.onValueChange?.(value),
    style: ({
      pressed
    }) => [{
      width: "100%",
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.md,
      padding: spacing.md,
      borderWidth: components.borderWidth.strong,
      borderColor: checked ? colors.primary : colors.border,
      borderRadius: radii.lg,
      backgroundColor: checked ? colors.primarySoft : colors.surface,
      opacity: isDisabled ? 0.5 : pressed ? 0.78 : 1
    }, style],
    ...props,
    children: [/*#__PURE__*/_jsx(View, {
      style: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: components.borderWidth.focus,
        borderColor: checked ? colors.primary : colors.border,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 1
      },
      children: checked ? /*#__PURE__*/_jsx(View, {
        style: {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: colors.primary
        }
      }) : null
    }), /*#__PURE__*/_jsxs(View, {
      style: {
        flex: 1,
        gap: spacing.xs
      },
      children: [typeof label === "string" ? /*#__PURE__*/_jsx(Text, {
        variant: "label",
        color: "text",
        children: label
      }) : label, typeof description === "string" ? /*#__PURE__*/_jsx(Text, {
        style: [typography.bodySmall, {
          color: colors.textMuted
        }],
        children: description
      }) : description]
    })]
  });
}
//# sourceMappingURL=RadioGroup.js.map