import React from "react";
import { type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { type RenderIcon } from "./types";
export type AlertTone = "primary" | "success" | "warning" | "danger" | "info" | "secondary";
export type AlertVariant = "soft" | "outline" | "solid";
export interface AlertAction {
    label: string;
    onPress: () => void;
    icon?: RenderIcon;
}
export interface AlertProps {
    title?: React.ReactNode;
    children?: React.ReactNode;
    tone?: AlertTone;
    variant?: AlertVariant;
    icon?: RenderIcon;
    action?: AlertAction;
    dismissible?: boolean;
    animated?: boolean;
    animationDuration?: number;
    onClose?: () => void;
    closeIcon?: RenderIcon;
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    titleStyle?: StyleProp<TextStyle>;
    textStyle?: StyleProp<TextStyle>;
}
export declare function Alert({ title, children, tone, variant, icon, action, dismissible, animated, animationDuration, onClose, closeIcon, style, contentStyle, titleStyle, textStyle, }: AlertProps): React.JSX.Element | null;
//# sourceMappingURL=Alert.d.ts.map