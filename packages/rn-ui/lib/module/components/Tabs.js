"use strict";

import React from "react";
import { Pressable, View } from "react-native";
import { useTheme } from "../theme/index.js";
import { Text } from "./Text.js";
import { jsx as _jsx } from "react/jsx-runtime";
const TabsContext = /*#__PURE__*/React.createContext(null);
export function Tabs({
  value,
  defaultValue,
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
    onValueChange: handleValueChange
  }), [currentValue, handleValueChange]);
  return /*#__PURE__*/_jsx(TabsContext.Provider, {
    value: context,
    children: /*#__PURE__*/_jsx(View, {
      style: [{
        width: "100%",
        gap: spacing.md
      }, style],
      ...props
    })
  });
}
export function TabsList({
  style,
  ...props
}) {
  const {
    colors,
    components,
    radii,
    spacing
  } = useTheme();
  return /*#__PURE__*/_jsx(View, {
    style: [{
      width: "100%",
      minHeight: 44,
      padding: 3,
      borderRadius: radii.lg,
      borderWidth: components.borderWidth.strong,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      flexDirection: "row",
      gap: spacing.xs
    }, style],
    ...props
  });
}
export function TabsTrigger({
  value,
  children,
  style,
  disabled,
  ...props
}) {
  const context = React.useContext(TabsContext);
  const {
    colors,
    radii,
    spacing
  } = useTheme();
  const active = context?.value === value;
  return /*#__PURE__*/_jsx(Pressable, {
    accessibilityRole: "tab",
    accessibilityState: {
      selected: active,
      disabled: Boolean(disabled)
    },
    disabled: disabled,
    onPress: () => context?.onValueChange?.(value),
    style: ({
      pressed
    }) => [{
      flex: 1,
      minHeight: 36,
      borderRadius: radii.md,
      backgroundColor: active ? colors.primary : colors.transparent,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.md,
      opacity: disabled ? 0.5 : pressed ? 0.78 : 1
    }, style],
    ...props,
    children: typeof children === "string" ? /*#__PURE__*/_jsx(Text, {
      variant: "label",
      style: {
        color: active ? colors.onPrimary : colors.textMuted
      },
      children: children
    }) : children
  });
}
export function TabsContent({
  value,
  forceMount = false,
  style,
  ...props
}) {
  const context = React.useContext(TabsContext);
  const active = context?.value === value;
  if (!active && !forceMount) return null;
  return /*#__PURE__*/_jsx(View, {
    style: [{
      display: active ? "flex" : "none"
    }, style],
    ...props
  });
}
//# sourceMappingURL=Tabs.js.map