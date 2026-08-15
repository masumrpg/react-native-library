import React from "react";
import { type StyleProp, type ViewProps, type ViewStyle } from "react-native";
export interface ProgressProps extends ViewProps {
    value?: number;
    max?: number;
    animated?: boolean;
    style?: StyleProp<ViewStyle>;
    indicatorStyle?: StyleProp<ViewStyle>;
}
export declare function Progress({ value, max, animated, style, indicatorStyle, ...props }: ProgressProps): React.JSX.Element;
//# sourceMappingURL=Progress.d.ts.map