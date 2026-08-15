import React from "react";
import { type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { type RenderIcon } from "./types";
export interface MetricCardProps extends ViewProps {
    label: React.ReactNode;
    value: React.ReactNode;
    delta?: React.ReactNode;
    icon?: RenderIcon;
    style?: StyleProp<ViewStyle>;
}
export declare function MetricCard({ label, value, delta, icon, style, ...props }: MetricCardProps): React.JSX.Element;
//# sourceMappingURL=MetricCard.d.ts.map