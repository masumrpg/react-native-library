import React from "react";
import { type StyleProp, type TextProps, type TextStyle } from "react-native";
export interface LabelProps extends TextProps {
    required?: boolean;
    requiredIndicator?: React.ReactNode;
    requiredIndicatorStyle?: StyleProp<TextStyle>;
    disabled?: boolean;
    invalid?: boolean;
    style?: StyleProp<TextStyle>;
}
export declare function Label({ required, requiredIndicator, requiredIndicatorStyle, disabled, invalid, style, children, ...props }: LabelProps): React.JSX.Element;
//# sourceMappingURL=Label.d.ts.map