"use strict";

import React from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { useTheme } from "../theme/index.js";
import { Text } from "./Text.js";
import { renderIcon } from "./types.js";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export function Select({
  value,
  defaultValue,
  options,
  placeholder = "Select option",
  disabled = false,
  title = "Select",
  onValueChange,
  chevronIcon,
  checkIcon,
  style
}) {
  const {
    colors,
    components,
    radii,
    spacing
  } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const currentValue = value ?? internalValue;
  const selected = options.find(option => option.value === currentValue);
  const choose = next => {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
    setOpen(false);
  };
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsxs(Pressable, {
      accessibilityRole: "button",
      disabled: disabled,
      onPress: () => setOpen(true),
      style: ({
        pressed
      }) => [{
        minHeight: 44,
        width: "100%",
        borderWidth: components.borderWidth.strong,
        borderColor: colors.border,
        borderRadius: radii.lg,
        backgroundColor: colors.input,
        paddingHorizontal: spacing.md,
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        opacity: disabled ? 0.5 : pressed ? 0.78 : 1
      }, style],
      children: [/*#__PURE__*/_jsx(Text, {
        color: selected ? "text" : "placeholder",
        style: {
          flex: 1
        },
        children: selected?.label ?? placeholder
      }), renderIcon(chevronIcon, colors.textMuted, 18) ?? /*#__PURE__*/_jsx(Text, {
        color: "textMuted",
        children: "\u2304"
      })]
    }), /*#__PURE__*/_jsx(Modal, {
      visible: open,
      transparent: true,
      animationType: "fade",
      onRequestClose: () => setOpen(false),
      children: /*#__PURE__*/_jsx(Pressable, {
        style: {
          flex: 1,
          backgroundColor: colors.overlay,
          justifyContent: "flex-end"
        },
        onPress: () => setOpen(false),
        children: /*#__PURE__*/_jsxs(Pressable, {
          style: {
            backgroundColor: colors.surface,
            borderTopLeftRadius: radii.xxl,
            borderTopRightRadius: radii.xxl,
            borderWidth: components.borderWidth.strong,
            borderColor: colors.border,
            padding: spacing.lg,
            gap: spacing.md,
            maxHeight: "72%"
          },
          children: [/*#__PURE__*/_jsx(Text, {
            variant: "title",
            children: title
          }), /*#__PURE__*/_jsx(ScrollView, {
            children: /*#__PURE__*/_jsx(View, {
              style: {
                gap: spacing.sm
              },
              children: options.map(option => {
                const active = option.value === currentValue;
                return /*#__PURE__*/_jsxs(Pressable, {
                  disabled: option.disabled,
                  onPress: () => choose(option.value),
                  style: ({
                    pressed
                  }) => ({
                    minHeight: 48,
                    borderRadius: radii.lg,
                    borderWidth: components.borderWidth.strong,
                    borderColor: active ? colors.primary : colors.border,
                    backgroundColor: active ? colors.primarySoft : colors.surface,
                    padding: spacing.md,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.md,
                    opacity: option.disabled ? 0.5 : pressed ? 0.78 : 1
                  }),
                  children: [/*#__PURE__*/_jsxs(View, {
                    style: {
                      flex: 1,
                      gap: spacing.xs
                    },
                    children: [/*#__PURE__*/_jsx(Text, {
                      variant: "label",
                      children: option.label
                    }), option.description ? /*#__PURE__*/_jsx(Text, {
                      variant: "bodySmall",
                      color: "textMuted",
                      children: option.description
                    }) : null]
                  }), active ? renderIcon(checkIcon, colors.primary, 18) ?? /*#__PURE__*/_jsx(Text, {
                    color: "primary",
                    children: "\u2713"
                  }) : null]
                }, option.value);
              })
            })
          })]
        })
      })
    })]
  });
}
//# sourceMappingURL=Select.js.map