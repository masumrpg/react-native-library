import React from "react";
import { View, type PressableProps, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
export type BubbleVariant = "default" | "secondary" | "muted" | "tinted" | "outline" | "ghost" | "destructive";
export type BubbleAlign = "start" | "end";
export interface BubbleGroupProps extends React.ComponentPropsWithoutRef<typeof View> {
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
}
export declare function BubbleGroup({ style, children, ...props }: BubbleGroupProps): React.JSX.Element;
export interface BubbleProps extends React.ComponentPropsWithoutRef<typeof View> {
    variant?: BubbleVariant;
    align?: BubbleAlign;
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
}
export declare function Bubble({ variant, align, style, children, ...props }: BubbleProps): React.JSX.Element;
export interface BubbleContentProps extends Omit<PressableProps, "style"> {
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    onPress?: () => void;
    children?: React.ReactNode;
}
export declare function BubbleContent({ style, textStyle, onPress, children, ...props }: BubbleContentProps): React.JSX.Element;
export interface BubbleReactionsProps extends React.ComponentPropsWithoutRef<typeof View> {
    side?: "top" | "bottom";
    align?: "start" | "end";
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
}
export declare function BubbleReactions({ side, align, style, children, ...props }: BubbleReactionsProps): React.JSX.Element;
//# sourceMappingURL=Bubble.d.ts.map