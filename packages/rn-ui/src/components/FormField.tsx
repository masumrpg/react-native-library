import React from "react";
import {
  Animated,
  View,
  type StyleProp,
  type TextStyle,
  type ViewProps,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../theme";
import { triggerHaptic } from "../utils/haptics";
import { Label, type LabelProps } from "./Label";
import { Text } from "./Text";
import { renderIcon, type RenderIcon, type BaseGlassProps } from "./types";

export interface FormFieldContextValue {
  invalid: boolean;
  disabled: boolean;
  required: boolean;
  error?: string;
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(
  null,
);

export function useFormField() {
  return React.useContext(FormFieldContext);
}

export interface FormFieldProps extends ViewProps, BaseGlassProps {
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  shakeOnError?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function FormField({
  invalid: explicitInvalid,
  disabled = false,
  required = false,
  error,
  shakeOnError = true,
  style,
  ...props
}: FormFieldProps) {
  const { spacing } = useTheme();
  const shakeAnim = React.useRef(new Animated.Value(0)).current;

  const invalid = explicitInvalid ?? Boolean(error);

  React.useEffect(() => {
    if (invalid && shakeOnError) {
      triggerHaptic("error");
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [invalid, shakeAnim, shakeOnError]);

  const value = React.useMemo(
    () => ({ invalid, disabled, required, error }),
    [disabled, invalid, required, error],
  );

  return (
    <FormFieldContext.Provider value={value}>
      <Animated.View
        style={[
          {
            width: "100%",
            gap: spacing.xs,
            transform: [{ translateX: shakeAnim }],
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

export interface FormErrorProps {
  children?: React.ReactNode;
  icon?: RenderIcon;
  style?: StyleProp<TextStyle>;
}

export function FormError({ children, icon, style }: FormErrorProps) {
  const { colors } = useTheme();
  const field = useFormField();
  const content = children ?? field?.error;

  if (!content) return null;

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
      {icon ? renderIcon(icon, colors.danger, 14) : null}
      <Text
        variant="bodySmall"
        color={field?.invalid ? "danger" : "textMuted"}
        style={style}
      >
        {content}
      </Text>
    </View>
  );
}

export interface FormMessageProps extends FormErrorProps {}
export const FormMessage = FormError;
