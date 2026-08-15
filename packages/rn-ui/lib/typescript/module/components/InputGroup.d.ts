import React from "react";
import { type StyleProp, type TextInput, type TextStyle, type ViewProps, type ViewStyle } from "react-native";
import { type ButtonProps, type ButtonVariant } from "./Button.js";
import { type InputProps } from "./Input.js";
export type InputGroupAddonAlign = "inline-start" | "inline-end" | "block-start" | "block-end";
export type InputGroupButtonSize = "xs" | "sm" | "icon-xs" | "icon-sm";
export type InputGroupOrientation = "inline" | "block";
export interface InputGroupProps extends ViewProps {
    orientation?: InputGroupOrientation;
    invalid?: boolean;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
}
export declare function InputGroup({ orientation, invalid, disabled, style, children, ...props }: InputGroupProps): React.JSX.Element;
export interface InputGroupAddonProps extends ViewProps {
    align?: InputGroupAddonAlign;
    style?: StyleProp<ViewStyle>;
}
export declare function InputGroupAddon({ align, style, children, ...props }: InputGroupAddonProps): React.JSX.Element;
export interface InputGroupButtonProps extends Omit<ButtonProps, "size" | "children"> {
    size?: InputGroupButtonSize;
    variant?: ButtonVariant;
    children?: React.ReactNode;
}
export declare function InputGroupButton({ size, variant, shape, children, style, ...props }: InputGroupButtonProps): React.JSX.Element;
export interface InputGroupTextProps extends ViewProps {
    textStyle?: StyleProp<TextStyle>;
}
export declare function InputGroupText({ style, textStyle, children, ...props }: InputGroupTextProps): React.JSX.Element;
export interface InputGroupInputProps extends InputProps {
}
export declare const InputGroupInput: React.ForwardRefExoticComponent<InputGroupInputProps & React.RefAttributes<TextInput>>;
export interface InputGroupTextareaProps extends Omit<InputGroupInputProps, "multiline"> {
}
export declare const InputGroupTextarea: React.ForwardRefExoticComponent<InputGroupTextareaProps & React.RefAttributes<TextInput>>;
//# sourceMappingURL=InputGroup.d.ts.map