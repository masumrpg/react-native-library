"use strict";

import React from "react";
import { View } from "react-native";
import { useTheme } from "../theme/index.js";
import { Label } from "./Label.js";
import { Text } from "./Text.js";
import { jsx as _jsx } from "react/jsx-runtime";
const FormFieldContext = /*#__PURE__*/React.createContext(null);
export function useFormField() {
  return React.useContext(FormFieldContext);
}
export function FormField({
  invalid = false,
  disabled = false,
  required = false,
  style,
  ...props
}) {
  const {
    spacing
  } = useTheme();
  const value = React.useMemo(() => ({
    invalid,
    disabled,
    required
  }), [disabled, invalid, required]);
  return /*#__PURE__*/_jsx(FormFieldContext.Provider, {
    value: value,
    children: /*#__PURE__*/_jsx(View, {
      style: [{
        width: "100%",
        gap: spacing.xs
      }, style],
      ...props
    })
  });
}
export function FormLabel(props) {
  const field = useFormField();
  return /*#__PURE__*/_jsx(Label, {
    invalid: field?.invalid,
    disabled: field?.disabled,
    required: field?.required,
    ...props
  });
}
export function FormControl({
  style,
  ...props
}) {
  return /*#__PURE__*/_jsx(View, {
    style: [{
      width: "100%"
    }, style],
    ...props
  });
}
export function FormDescription({
  children,
  style
}) {
  return /*#__PURE__*/_jsx(Text, {
    variant: "bodySmall",
    color: "textMuted",
    style: style,
    children: children
  });
}
export function FormMessage({
  children,
  style
}) {
  const field = useFormField();
  if (!children) return null;
  return /*#__PURE__*/_jsx(Text, {
    variant: "bodySmall",
    color: field?.invalid ? "danger" : "textMuted",
    style: style,
    children: children
  });
}
//# sourceMappingURL=FormField.js.map