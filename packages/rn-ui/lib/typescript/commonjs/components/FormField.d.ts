import React from "react";
import { type StyleProp, type TextStyle, type ViewProps, type ViewStyle } from "react-native";
import { type LabelProps } from "./Label";
export interface FormFieldContextValue {
    invalid: boolean;
    disabled: boolean;
    required: boolean;
}
export declare function useFormField(): FormFieldContextValue | null;
export interface FormFieldProps extends ViewProps {
    invalid?: boolean;
    disabled?: boolean;
    required?: boolean;
    style?: StyleProp<ViewStyle>;
}
export declare function FormField({ invalid, disabled, required, style, ...props }: FormFieldProps): React.JSX.Element;
export interface FormLabelProps extends LabelProps {
}
export declare function FormLabel(props: FormLabelProps): React.JSX.Element;
export interface FormControlProps extends ViewProps {
    style?: StyleProp<ViewStyle>;
}
export declare function FormControl({ style, ...props }: FormControlProps): React.JSX.Element;
export interface FormDescriptionProps {
    children?: React.ReactNode;
    style?: StyleProp<TextStyle>;
}
export declare function FormDescription({ children, style }: FormDescriptionProps): React.JSX.Element;
export interface FormMessageProps {
    children?: React.ReactNode;
    style?: StyleProp<TextStyle>;
}
export declare function FormMessage({ children, style }: FormMessageProps): React.JSX.Element | null;
//# sourceMappingURL=FormField.d.ts.map