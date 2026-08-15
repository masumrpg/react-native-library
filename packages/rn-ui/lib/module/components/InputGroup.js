"use strict";

import React from "react";
import { Text as RNText, View } from "react-native";
import { useTheme } from "../theme/index.js";
import { withAlpha } from "../utils/index.js";
import { Button } from "./Button.js";
import { Input } from "./Input.js";
import { jsx as _jsx } from "react/jsx-runtime";
const InputGroupContext = /*#__PURE__*/React.createContext(null);
function useInputGroupContext() {
  return React.useContext(InputGroupContext);
}
export function InputGroup({
  orientation = "inline",
  invalid = false,
  disabled = false,
  style,
  children,
  ...props
}) {
  const {
    colors,
    radii
  } = useTheme();
  const [focused, setFocused] = React.useState(false);
  const [controlState, setControlState] = React.useState({
    invalid: false,
    disabled: false
  });
  const isInvalid = invalid || controlState.invalid;
  const isDisabled = disabled || controlState.disabled;
  const borderColor = isInvalid ? colors.danger : focused ? colors.primary : colors.border;
  const value = React.useMemo(() => ({
    focused,
    orientation,
    invalid: isInvalid,
    disabled: isDisabled,
    setFocused,
    setControlState: state => {
      setControlState(current => ({
        invalid: state.invalid ?? current.invalid,
        disabled: state.disabled ?? current.disabled
      }));
    }
  }), [focused, isDisabled, isInvalid, orientation]);
  return /*#__PURE__*/_jsx(InputGroupContext.Provider, {
    value: value,
    children: /*#__PURE__*/_jsx(View, {
      accessibilityState: {
        disabled: isDisabled
      },
      style: [{
        width: "100%",
        minHeight: 44,
        borderRadius: radii.lg,
        borderWidth: focused || isInvalid ? 1.5 : 1.25,
        borderColor,
        backgroundColor: isDisabled ? withAlpha(colors.input, 0.55) : colors.input,
        flexDirection: orientation === "block" ? "column" : "row",
        alignItems: orientation === "block" ? "stretch" : "center",
        overflow: "hidden",
        opacity: isDisabled ? 0.72 : 1
      }, style],
      ...props,
      children: children
    })
  });
}
export function InputGroupAddon({
  align = "inline-start",
  style,
  children,
  ...props
}) {
  const {
    spacing
  } = useTheme();
  const isBlock = align === "block-start" || align === "block-end";
  return /*#__PURE__*/_jsx(View, {
    style: [{
      width: isBlock ? "100%" : undefined,
      minHeight: isBlock ? undefined : 44,
      paddingHorizontal: isBlock ? spacing.md : spacing.sm,
      paddingVertical: isBlock ? spacing.sm : 0,
      alignItems: isBlock ? "flex-start" : "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: spacing.sm
    }, style],
    ...props,
    children: children
  });
}
export function InputGroupButton({
  size = "xs",
  variant = "ghost",
  shape,
  children,
  style,
  ...props
}) {
  const {
    radii
  } = useTheme();
  const isIcon = size === "icon-xs" || size === "icon-sm";
  const buttonSize = size === "sm" || size === "icon-sm" ? "sm" : "xs";
  return /*#__PURE__*/_jsx(Button, {
    size: buttonSize,
    variant: variant,
    shape: shape ?? (isIcon ? "square" : "rounded"),
    style: [{
      minWidth: isIcon ? size === "icon-sm" ? 32 : 24 : undefined,
      paddingHorizontal: isIcon ? 0 : size === "sm" ? 12 : 10,
      borderRadius: isIcon ? radii.sm : radii.md
    }, style],
    ...props,
    children: children ?? ""
  });
}
export function InputGroupText({
  style,
  textStyle,
  children,
  ...props
}) {
  const {
    colors,
    typography,
    spacing
  } = useTheme();
  const context = useInputGroupContext();
  return /*#__PURE__*/_jsx(View, {
    style: [{
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm
    }, style],
    ...props,
    children: typeof children === "string" || typeof children === "number" ? /*#__PURE__*/_jsx(RNText, {
      style: [typography.bodySmall, {
        color: context?.disabled ? colors.disabledText : colors.textMuted,
        fontWeight: "500"
      }, textStyle],
      children: children
    }) : children
  });
}
export const InputGroupInput = /*#__PURE__*/React.forwardRef(function InputGroupInput({
  invalid = false,
  disabled = false,
  editable,
  onFocus,
  onBlur,
  style,
  ...props
}, ref) {
  const context = useInputGroupContext();
  const isEditable = editable ?? !disabled;
  React.useEffect(() => {
    context?.setControlState({
      invalid,
      disabled: !isEditable
    });
  }, [context, invalid, isEditable]);
  return /*#__PURE__*/_jsx(Input, {
    ref: ref,
    invalid: false,
    disabled: !isEditable,
    editable: isEditable,
    fullWidth: false,
    onFocus: event => {
      context?.setFocused(true);
      onFocus?.(event);
    },
    onBlur: event => {
      context?.setFocused(false);
      onBlur?.(event);
    },
    style: [{
      flex: context?.orientation === "block" ? undefined : 1,
      width: context?.orientation === "block" ? "100%" : undefined,
      borderWidth: 0,
      borderRadius: 0,
      backgroundColor: "transparent",
      minHeight: 42
    }, style],
    ...props
  });
});
export const InputGroupTextarea = /*#__PURE__*/React.forwardRef(function InputGroupTextarea({
  style,
  ...props
}, ref) {
  return /*#__PURE__*/_jsx(InputGroupInput, {
    ref: ref,
    multiline: true,
    textAlignVertical: "top",
    style: [{
      minHeight: 96,
      paddingVertical: 10
    }, style],
    ...props
  });
});
//# sourceMappingURL=InputGroup.js.map