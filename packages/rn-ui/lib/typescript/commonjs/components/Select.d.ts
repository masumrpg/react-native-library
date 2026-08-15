import React from "react";
import { type StyleProp, type ViewStyle } from "react-native";
import { type RenderIcon } from "./types";
export interface SelectOption {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
}
export interface SelectProps {
    value?: string;
    defaultValue?: string;
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    title?: string;
    onValueChange?: (value: string) => void;
    chevronIcon?: RenderIcon;
    checkIcon?: RenderIcon;
    style?: StyleProp<ViewStyle>;
}
export declare function Select({ value, defaultValue, options, placeholder, disabled, title, onValueChange, chevronIcon, checkIcon, style, }: SelectProps): React.JSX.Element;
//# sourceMappingURL=Select.d.ts.map