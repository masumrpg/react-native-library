import React from "react";
import { type PressableProps, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { type RenderIcon } from "./types";
import type { ButtonTone, ButtonVariant } from "./Button";
export type FloatingActionButtonSize = "sm" | "md" | "lg";
export type FloatingActionButtonPlacement = "none" | "bottom-end" | "bottom-start" | "top-end" | "top-start";
export interface FloatingActionButtonProps extends Omit<PressableProps, "children" | "style"> {
    icon?: RenderIcon;
    label?: React.ReactNode;
    extended?: boolean;
    size?: FloatingActionButtonSize;
    tone?: ButtonTone;
    variant?: Exclude<ButtonVariant, "danger">;
    placement?: FloatingActionButtonPlacement;
    offset?: number;
    visible?: boolean;
    animated?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}
export declare function FloatingActionButton({ icon, label, extended, size, tone, variant, placement, offset, visible, animated, loading, disabled, fullWidth, style, textStyle, onPressIn, onPressOut, ...props }: FloatingActionButtonProps): React.JSX.Element | null;
//# sourceMappingURL=FloatingActionButton.d.ts.map