import React from "react";
import {
  TextInput,
  type KeyboardTypeOptions,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
} from "react-native";

import { useTheme } from "../theme";
import { withAlpha } from "../utils";
import type { BaseGlassProps } from "./types";

export type InputSize = "sm" | "md" | "lg";
export type InputType =
  | "text"
  | "email"
  | "number"
  | "password"
  | "tel"
  | "url";

export interface InputProps extends Omit<TextInputProps, "style">, BaseGlassProps {
  type?: InputType;
  size?: InputSize;
  invalid?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<TextStyle>;
}

const inputHeights: Record<InputSize, number> = {
  sm: 36,
  md: 44,
  lg: 52,
};

const inputPaddingX: Record<InputSize, number> = {
  sm: 10,
  md: 12,
  lg: 14,
};

function getKeyboardType(type: InputType): KeyboardTypeOptions {
  if (type === "email") return "email-address";
  if (type === "number") return "numeric";
  if (type === "tel") return "phone-pad";
  if (type === "url") return "url";
  return "default";
}

import { useFormField } from "./FormField";

export const Input = React.forwardRef<TextInput, InputProps>(function Input(
  {
    type = "text",
    size = "md",
    invalid = false,
    disabled = false,
    fullWidth = true,
    glass = false,
    editable,
    multiline,
    onFocus,
    onBlur,
    keyboardType,
    secureTextEntry,
    placeholderTextColor,
    style,
    ...props
  },
  ref,
) {
  const { colors, components, typography, radii, isDark } = useTheme();
  const field = useFormField();
  const [focused, setFocused] = React.useState(false);

  const isInvalid = invalid || Boolean(field?.invalid);
  const isDisabled = disabled || Boolean(field?.disabled);
  const isEditable = editable ?? !isDisabled;

  const glassBg = isDark
    ? "rgba(15, 27, 45, 0.60)"
    : "rgba(255, 255, 255, 0.70)";

  const borderColor = isInvalid
    ? colors.danger
    : focused
      ? colors.primary
      : glass
        ? isDark
          ? "rgba(248, 250, 252, 0.20)"
          : "rgba(15, 23, 42, 0.14)"
        : colors.border;

  return (
    <TextInput
      ref={ref}
      editable={isEditable}
      keyboardType={keyboardType ?? getKeyboardType(type)}
      secureTextEntry={secureTextEntry ?? type === "password"}
      placeholderTextColor={placeholderTextColor ?? colors.placeholder}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocused(false);
        onBlur?.(event);
      }}
      style={[
        typography.body,
        {
          width: fullWidth ? "100%" : undefined,
          minHeight: multiline ? inputHeights[size] * 2 : inputHeights[size],
          paddingHorizontal: inputPaddingX[size],
          paddingVertical: multiline ? 10 : 0,
          borderRadius: radii.lg,
          borderWidth:
            focused || invalid
              ? components.borderWidth.focus
              : components.borderWidth.strong,
          borderColor,
          backgroundColor: isEditable
            ? glass
              ? glassBg
              : colors.input
            : withAlpha(colors.input, 0.55),
          color: isEditable ? colors.text : colors.disabledText,
          opacity: isEditable ? 1 : 0.72,
          textAlignVertical: multiline ? "top" : "center",
        },
        style,
      ]}
      {...props}
    />
  );
});
