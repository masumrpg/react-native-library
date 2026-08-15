import React from "react";
import { type PressableProps, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { type RenderIcon } from "./types";
export type ButtonVariant = "filled" | "outline" | "ghost" | "soft" | "danger";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ButtonTone = "primary" | "secondary" | "accent" | "success" | "warning" | "danger" | "info";
export type ButtonShape = "rounded" | "pill" | "square";
export interface ButtonProps extends Omit<PressableProps, "children" | "style"> {
    children: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    tone?: ButtonTone;
    shape?: ButtonShape;
    leftIcon?: RenderIcon;
    rightIcon?: RenderIcon;
    loading?: boolean;
    fullWidth?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}
export declare function Button({ children, variant, size, tone, shape, leftIcon, rightIcon, loading, fullWidth, disabled, style, textStyle, ...props }: ButtonProps): React.JSX.Element;
//# sourceMappingURL=Button.d.ts.map