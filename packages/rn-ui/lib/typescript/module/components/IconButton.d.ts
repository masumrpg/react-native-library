import React from "react";
import { type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import { type RenderIcon, type ThemeColorName } from "./types.js";
export type IconButtonVariant = "filled" | "outline" | "ghost" | "soft";
export type IconButtonSize = "sm" | "md" | "lg";
export type IconButtonTone = "primary" | "secondary" | "accent" | "success" | "warning" | "danger" | "info";
export interface IconButtonProps extends Omit<PressableProps, "children" | "style"> {
    icon: RenderIcon;
    variant?: IconButtonVariant;
    size?: IconButtonSize;
    tone?: IconButtonTone;
    color?: ThemeColorName | string;
    loading?: boolean;
    badge?: number;
    style?: StyleProp<ViewStyle>;
}
export declare function IconButton({ icon, variant, size, tone, color, loading, disabled, badge, style, ...props }: IconButtonProps): React.JSX.Element;
//# sourceMappingURL=IconButton.d.ts.map