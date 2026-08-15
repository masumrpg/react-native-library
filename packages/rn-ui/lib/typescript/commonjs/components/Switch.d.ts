import React from "react";
import { type GestureResponderEvent, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import { type RenderIcon } from "./types";
export type SwitchSize = "sm" | "md" | "lg";
export type SwitchTone = "primary" | "secondary" | "accent" | "success" | "warning" | "danger" | "info";
export interface SwitchRenderThumbParams {
    checked: boolean;
    disabled: boolean;
    invalid: boolean;
    color: string;
    size: number;
}
export type SwitchThumbContent = React.ReactNode | ((params: SwitchRenderThumbParams) => React.ReactNode);
export interface SwitchProps extends Omit<PressableProps, "onPress" | "style" | "children"> {
    value?: boolean;
    defaultValue?: boolean;
    onValueChange?: (value: boolean) => void;
    disabled?: boolean;
    invalid?: boolean;
    size?: SwitchSize;
    tone?: SwitchTone;
    style?: StyleProp<ViewStyle>;
    trackStyle?: StyleProp<ViewStyle>;
    thumbStyle?: StyleProp<ViewStyle>;
    activeIcon?: RenderIcon;
    inactiveIcon?: RenderIcon;
    thumbContent?: SwitchThumbContent;
    activeThumbContent?: SwitchThumbContent;
    inactiveThumbContent?: SwitchThumbContent;
    renderThumb?: (params: SwitchRenderThumbParams) => React.ReactNode;
    onPress?: (event: GestureResponderEvent) => void;
}
export declare function Switch({ value, defaultValue, onValueChange, disabled, invalid, size, tone, style, trackStyle, thumbStyle, activeIcon, inactiveIcon, thumbContent, activeThumbContent, inactiveThumbContent, renderThumb, onPress, onPressIn, onPressOut, accessibilityLabel, ...props }: SwitchProps): React.JSX.Element;
//# sourceMappingURL=Switch.d.ts.map