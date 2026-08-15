"use strict";

import React from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { useTheme } from "../theme/index.js";
import { Input } from "./Input.js";
import { Text } from "./Text.js";
import { renderIcon } from "./types.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Command({
  visible,
  items,
  title = "Command",
  placeholder = "Search...",
  emptyText = "No results",
  onClose,
  onSelect,
  style
}) {
  const {
    colors,
    components,
    radii,
    spacing
  } = useTheme();
  const [query, setQuery] = React.useState("");
  const filtered = items.filter(item => {
    const text = `${item.label} ${item.description ?? ""}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });
  return /*#__PURE__*/_jsx(Modal, {
    visible: visible,
    transparent: true,
    animationType: "fade",
    onRequestClose: onClose,
    children: /*#__PURE__*/_jsx(Pressable, {
      style: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: "flex-end"
      },
      onPress: onClose,
      children: /*#__PURE__*/_jsxs(Pressable, {
        style: [{
          backgroundColor: colors.surface,
          borderTopLeftRadius: radii.xxl,
          borderTopRightRadius: radii.xxl,
          borderWidth: components.borderWidth.strong,
          borderColor: colors.border,
          padding: spacing.lg,
          gap: spacing.md,
          maxHeight: "76%"
        }, style],
        children: [/*#__PURE__*/_jsx(Text, {
          variant: "title",
          children: title
        }), /*#__PURE__*/_jsx(Input, {
          value: query,
          onChangeText: setQuery,
          placeholder: placeholder
        }), /*#__PURE__*/_jsx(ScrollView, {
          keyboardShouldPersistTaps: "handled",
          children: /*#__PURE__*/_jsx(View, {
            style: {
              gap: spacing.sm
            },
            children: filtered.length === 0 ? /*#__PURE__*/_jsx(Text, {
              color: "textMuted",
              align: "center",
              style: {
                padding: spacing.lg
              },
              children: emptyText
            }) : filtered.map(item => /*#__PURE__*/_jsxs(Pressable, {
              disabled: item.disabled,
              onPress: () => {
                onSelect?.(item.value, item);
                onClose();
              },
              style: ({
                pressed
              }) => ({
                minHeight: 48,
                borderRadius: radii.lg,
                padding: spacing.md,
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
                backgroundColor: pressed ? colors.backgroundMuted : colors.surface,
                opacity: item.disabled ? 0.5 : 1
              }),
              children: [renderIcon(item.icon, colors.primary, 18), /*#__PURE__*/_jsxs(View, {
                style: {
                  flex: 1,
                  gap: spacing.xs
                },
                children: [/*#__PURE__*/_jsx(Text, {
                  variant: "label",
                  children: item.label
                }), item.description ? /*#__PURE__*/_jsx(Text, {
                  variant: "bodySmall",
                  color: "textMuted",
                  children: item.description
                }) : null]
              })]
            }, item.value))
          })
        })]
      })
    })
  });
}
//# sourceMappingURL=Command.js.map