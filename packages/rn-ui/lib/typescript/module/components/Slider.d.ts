import React from "react";
import { type StyleProp, type ViewProps, type ViewStyle } from "react-native";
export type SliderTone = "primary" | "secondary" | "accent" | "success" | "warning" | "danger" | "info";
export interface SliderProps extends Omit<ViewProps, "style"> {
    value?: number;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    tone?: SliderTone;
    onValueChange?: (value: number) => void;
    onSlidingStart?: (value: number) => void;
    onSlidingComplete?: (value: number) => void;
    style?: StyleProp<ViewStyle>;
    trackStyle?: StyleProp<ViewStyle>;
    activeTrackStyle?: StyleProp<ViewStyle>;
    thumbStyle?: StyleProp<ViewStyle>;
}
export declare function Slider({ value, defaultValue, min, max, step, disabled, tone, onValueChange, onSlidingStart, onSlidingComplete, style, trackStyle, activeTrackStyle, thumbStyle, onLayout, ...props }: SliderProps): React.JSX.Element;
//# sourceMappingURL=Slider.d.ts.map