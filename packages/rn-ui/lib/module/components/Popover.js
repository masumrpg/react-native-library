"use strict";

import React from "react";
import { Modal, Pressable } from "react-native";
import { useTheme } from "../theme/index.js";
import { jsx as _jsx } from "react/jsx-runtime";
const PopoverContext = /*#__PURE__*/React.createContext(null);
export function Popover({
  open,
  defaultOpen = false,
  onOpenChange,
  children
}) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const currentOpen = open ?? internalOpen;
  const setOpen = next => {
    if (open === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };
  return /*#__PURE__*/_jsx(PopoverContext.Provider, {
    value: {
      open: currentOpen,
      setOpen
    },
    children: children
  });
}
export function PopoverTrigger({
  triggerMode = "press",
  onPress,
  onLongPress,
  ...props
}) {
  const context = React.useContext(PopoverContext);
  return /*#__PURE__*/_jsx(Pressable, {
    onPress: event => {
      if (triggerMode === "press") context?.setOpen(true);
      onPress?.(event);
    },
    onLongPress: event => {
      if (triggerMode === "longPress") context?.setOpen(true);
      onLongPress?.(event);
    },
    ...props
  });
}
export function PopoverContent({
  children,
  width = 280,
  style
}) {
  const context = React.useContext(PopoverContext);
  const {
    colors,
    components,
    radii,
    spacing
  } = useTheme();
  if (!context) return null;
  return /*#__PURE__*/_jsx(Modal, {
    visible: context.open,
    transparent: true,
    animationType: "fade",
    onRequestClose: () => context.setOpen(false),
    children: /*#__PURE__*/_jsx(Pressable, {
      style: {
        flex: 1,
        backgroundColor: colors.overlay,
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.xl
      },
      onPress: () => context.setOpen(false),
      children: /*#__PURE__*/_jsx(Pressable, {
        style: [{
          width,
          maxWidth: "100%",
          borderRadius: radii.xl,
          borderWidth: components.borderWidth.strong,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          padding: spacing.lg
        }, style],
        children: children
      })
    })
  });
}
//# sourceMappingURL=Popover.js.map