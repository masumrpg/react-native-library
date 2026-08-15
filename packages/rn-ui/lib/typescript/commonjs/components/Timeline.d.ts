import React from "react";
import { type StyleProp, type ViewProps, type ViewStyle } from "react-native";
export interface TimelineProps extends ViewProps {
    style?: StyleProp<ViewStyle>;
}
export interface TimelineItemProps extends ViewProps {
    active?: boolean;
    style?: StyleProp<ViewStyle>;
}
export interface TimelineTitleProps {
    children?: React.ReactNode;
}
export interface TimelineDescriptionProps {
    children?: React.ReactNode;
}
export declare function Timeline({ style, ...props }: TimelineProps): React.JSX.Element;
export declare function TimelineItem({ active, style, children, ...props }: TimelineItemProps): React.JSX.Element;
export declare function TimelineTitle({ children }: TimelineTitleProps): React.JSX.Element;
export declare function TimelineDescription({ children }: TimelineDescriptionProps): React.JSX.Element;
//# sourceMappingURL=Timeline.d.ts.map