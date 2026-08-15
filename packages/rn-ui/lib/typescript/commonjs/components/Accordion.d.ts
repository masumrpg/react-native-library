import React from "react";
import { type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { type RenderIcon } from "./types";
export interface AccordionItem {
    id: string;
    title: React.ReactNode;
    content: React.ReactNode;
    subtitle?: React.ReactNode;
    icon?: RenderIcon;
    disabled?: boolean;
}
export interface AccordionIndicatorProps {
    expanded: boolean;
    color: string;
    size: number;
}
export interface AccordionAnimatedContentProps {
    expanded: boolean;
    children: React.ReactNode;
    duration: number;
    style?: StyleProp<ViewStyle>;
}
export interface AccordionAnimatedIndicatorProps {
    expanded: boolean;
    children: React.ReactNode;
    duration: number;
    style?: StyleProp<ViewStyle>;
}
export interface AccordionAnimationComponents {
    Content?: React.ComponentType<AccordionAnimatedContentProps>;
    Indicator?: React.ComponentType<AccordionAnimatedIndicatorProps>;
}
export type AccordionIndicator = React.ReactNode | ((props: AccordionIndicatorProps) => React.ReactNode);
export interface AccordionProps {
    items: AccordionItem[];
    allowMultiple?: boolean;
    defaultOpenIds?: string[];
    openIds?: string[];
    onOpenChange?: (openIds: string[]) => void;
    disabled?: boolean;
    animated?: boolean;
    animationDuration?: number;
    animationComponents?: AccordionAnimationComponents;
    indicator?: AccordionIndicator;
    itemStyle?: StyleProp<ViewStyle>;
    headerStyle?: StyleProp<ViewStyle>;
    titleStyle?: StyleProp<TextStyle>;
    subtitleStyle?: StyleProp<TextStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
}
export declare function Accordion({ items, allowMultiple, defaultOpenIds, openIds, onOpenChange, disabled, animated, animationDuration, animationComponents, indicator, itemStyle, headerStyle, titleStyle, subtitleStyle, contentStyle, style, }: AccordionProps): React.JSX.Element;
//# sourceMappingURL=Accordion.d.ts.map