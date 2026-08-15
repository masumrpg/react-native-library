import React from "react";
import { type PressableProps, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
export interface RadioGroupContextValue {
    value?: string;
    disabled: boolean;
    onValueChange?: (value: string) => void;
}
export interface RadioGroupProps extends ViewProps {
    value?: string;
    defaultValue?: string;
    disabled?: boolean;
    onValueChange?: (value: string) => void;
    style?: StyleProp<ViewStyle>;
}
export declare function RadioGroup({ value, defaultValue, disabled, onValueChange, style, ...props }: RadioGroupProps): React.JSX.Element;
export interface RadioGroupItemProps extends Omit<PressableProps, "style"> {
    value: string;
    label?: React.ReactNode;
    description?: React.ReactNode;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
}
export declare function RadioGroupItem({ value, label, description, disabled, style, ...props }: RadioGroupItemProps): React.JSX.Element;
//# sourceMappingURL=RadioGroup.d.ts.map