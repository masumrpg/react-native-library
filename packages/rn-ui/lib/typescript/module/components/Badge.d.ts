import React from "react";
import { type StyleProp, type ViewStyle } from "react-native";
import { type RenderIcon } from "./types.js";
export type BadgeTone = "primary" | "secondary" | "accent" | "success" | "warning" | "danger" | "info";
export type BadgeVariant = "solid" | "soft" | "outline";
export type BadgeSize = "sm" | "md" | "lg";
export interface BadgeProps {
    children: string;
    tone?: BadgeTone;
    variant?: BadgeVariant;
    size?: BadgeSize;
    icon?: RenderIcon;
    style?: StyleProp<ViewStyle>;
}
export declare function Badge({ children, tone, variant, size, icon, style, }: BadgeProps): React.JSX.Element;
//# sourceMappingURL=Badge.d.ts.map