import React from "react";
import { type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { useTheme } from "../theme";
export interface SkeletonProps extends ViewProps {
    animated?: boolean;
    radius?: keyof ReturnType<typeof useTheme>["radii"];
    style?: StyleProp<ViewStyle>;
}
export declare function Skeleton({ animated, radius, style, ...props }: SkeletonProps): React.JSX.Element;
//# sourceMappingURL=Skeleton.d.ts.map