import React from "react";
import { type StyleProp, type TextStyle, type ViewProps, type ViewStyle } from "react-native";
export type EmptyMediaVariant = "default" | "icon";
export interface EmptyProps extends ViewProps {
    bordered?: boolean;
    style?: StyleProp<ViewStyle>;
}
export declare function Empty({ bordered, style, ...props }: EmptyProps): React.JSX.Element;
export interface EmptyHeaderProps extends ViewProps {
    style?: StyleProp<ViewStyle>;
}
export declare function EmptyHeader({ style, ...props }: EmptyHeaderProps): React.JSX.Element;
export interface EmptyMediaProps extends ViewProps {
    variant?: EmptyMediaVariant;
    style?: StyleProp<ViewStyle>;
}
export declare function EmptyMedia({ variant, style, ...props }: EmptyMediaProps): React.JSX.Element;
export interface EmptyTitleProps {
    children?: React.ReactNode;
    style?: StyleProp<TextStyle>;
}
export declare function EmptyTitle({ children, style }: EmptyTitleProps): React.JSX.Element;
export interface EmptyDescriptionProps {
    children?: React.ReactNode;
    style?: StyleProp<TextStyle>;
}
export declare function EmptyDescription({ children, style }: EmptyDescriptionProps): React.JSX.Element;
export interface EmptyContentProps extends ViewProps {
    style?: StyleProp<ViewStyle>;
}
export declare function EmptyContent({ style, ...props }: EmptyContentProps): React.JSX.Element;
//# sourceMappingURL=Empty.d.ts.map