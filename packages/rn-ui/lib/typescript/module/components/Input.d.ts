import React from "react";
import { TextInput, type StyleProp, type TextInputProps, type TextStyle } from "react-native";
export type InputSize = "sm" | "md" | "lg";
export type InputType = "text" | "email" | "number" | "password" | "tel" | "url";
export interface InputProps extends Omit<TextInputProps, "style"> {
    type?: InputType;
    size?: InputSize;
    invalid?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    style?: StyleProp<TextStyle>;
}
export declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<TextInput>>;
//# sourceMappingURL=Input.d.ts.map