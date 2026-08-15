import React from "react";
import { type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { type RenderIcon } from "./types";
export interface StepperProps extends ViewProps {
    value?: number;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    onValueChange?: (value: number) => void;
    decrementIcon?: RenderIcon;
    incrementIcon?: RenderIcon;
    style?: StyleProp<ViewStyle>;
}
export declare function Stepper({ value, defaultValue, min, max, step, disabled, onValueChange, decrementIcon, incrementIcon, style, ...props }: StepperProps): React.JSX.Element;
//# sourceMappingURL=Stepper.d.ts.map