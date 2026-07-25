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

export type InputSize = "sm" | "md" | "lg";
export type InputType =
  | "text"
  | "email"
  | "number"
  | "password"
  | "tel"
  | "url";

export interface InputProps extends Omit<TextInputProps, "style"> {
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

export const Input = React.forwardRef<TextInput, InputProps>(function Input(
  {
    type = "text",
    size = "md",
    invalid = false,
    disabled = false,
    fullWidth = true,
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
  const { colors, components, typography, radii } = useTheme();
  const [focused, setFocused] = React.useState(false);
  const isEditable = editable ?? !disabled;

  const borderColor = invalid
    ? colors.danger
    : focused
      ? colors.primary
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
            ? colors.input
            : withAlpha(colors.input, 0.55),
          color: isEditable ? colors.text : colors.disabledText,
          opacity: isEditable ? 1 : 0.72,
          textAlignVertical: multiline ? "top" : "center",
        },
        focused && {
          shadowColor: invalid ? colors.danger : colors.primary,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
        },
        style,
      ]}
      {...props}
    />
  );
});
