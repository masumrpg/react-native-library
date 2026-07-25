import React from "react";
import {
  View,
  type StyleProp,
  type TextStyle,
  type ViewProps,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../theme";
import { Label, type LabelProps } from "./Label";
import { Text } from "./Text";

export interface FormFieldContextValue {
  invalid: boolean;
  disabled: boolean;
  required: boolean;
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(
  null,
);

export function useFormField() {
  return React.useContext(FormFieldContext);
}

export interface FormFieldProps extends ViewProps {
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function FormField({
  invalid = false,
  disabled = false,
  required = false,
  style,
  ...props
}: FormFieldProps) {
  const { spacing } = useTheme();
  const value = React.useMemo(
    () => ({ invalid, disabled, required }),
    [disabled, invalid, required],
  );

  return (
    <FormFieldContext.Provider value={value}>
      <View
        style={[
          {
            width: "100%",
            gap: spacing.xs,
          },
          style,
        ]}
        {...props}
      />
    </FormFieldContext.Provider>
  );
}

export interface FormLabelProps extends LabelProps {}

export function FormLabel(props: FormLabelProps) {
  const field = useFormField();

  return (
    <Label
      invalid={field?.invalid}
      disabled={field?.disabled}
      required={field?.required}
      {...props}
    />
  );
}

export interface FormControlProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export function FormControl({ style, ...props }: FormControlProps) {
  return (
    <View
      style={[
        {
          width: "100%",
        },
        style,
      ]}
      {...props}
    />
  );
}

export interface FormDescriptionProps {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export function FormDescription({ children, style }: FormDescriptionProps) {
  return (
    <Text variant="bodySmall" color="textMuted" style={style}>
      {children}
    </Text>
  );
}

export interface FormMessageProps {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export function FormMessage({ children, style }: FormMessageProps) {
  const field = useFormField();

  if (!children) return null;

  return (
    <Text
      variant="bodySmall"
      color={field?.invalid ? "danger" : "textMuted"}
      style={style}
    >
      {children}
    </Text>
  );
}
