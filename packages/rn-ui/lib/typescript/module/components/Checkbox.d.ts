import React from "react";
import { type StyleProp, type ViewStyle } from "react-native";
import { type RenderIcon } from "./types.js";
export interface CheckboxProps {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
    invalid?: boolean;
    style?: StyleProp<ViewStyle>;
    icon?: RenderIcon;
}
export declare function Checkbox({ checked, onCheckedChange, disabled, invalid, style, icon, ...props }: CheckboxProps): React.JSX.Element;
//# sourceMappingURL=Checkbox.d.ts.map