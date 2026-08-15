import React from "react";
import { type PressableProps, type StyleProp, type TextProps, type TextStyle, type ViewProps, type ViewStyle } from "react-native";
export type ItemVariant = "default" | "outline" | "muted";
export type ItemSize = "default" | "sm" | "xs";
export type ItemMediaVariant = "default" | "icon" | "image";
export interface ItemGroupProps extends ViewProps {
    size?: ItemSize;
    style?: StyleProp<ViewStyle>;
}
export declare function ItemGroup({ size, style, ...props }: ItemGroupProps): React.JSX.Element;
export interface ItemSeparatorProps extends ViewProps {
    style?: StyleProp<ViewStyle>;
}
export declare function ItemSeparator({ style, ...props }: ItemSeparatorProps): React.JSX.Element;
export interface ItemProps extends Omit<PressableProps, "style"> {
    variant?: ItemVariant;
    size?: ItemSize;
    style?: StyleProp<ViewStyle> | ((state: {
        pressed: boolean;
    }) => StyleProp<ViewStyle>);
}
export declare function Item({ variant, size, disabled, style, ...props }: ItemProps): React.JSX.Element;
export interface ItemMediaProps extends ViewProps {
    variant?: ItemMediaVariant;
    size?: ItemSize;
    style?: StyleProp<ViewStyle>;
}
export declare function ItemMedia({ variant, size, style, ...props }: ItemMediaProps): React.JSX.Element;
export interface ItemContentProps extends ViewProps {
    style?: StyleProp<ViewStyle>;
}
export declare function ItemContent({ style, ...props }: ItemContentProps): React.JSX.Element;
export interface ItemTitleProps extends TextProps {
    style?: StyleProp<TextStyle>;
}
export declare function ItemTitle({ style, ...props }: ItemTitleProps): React.JSX.Element;
export interface ItemDescriptionProps extends TextProps {
    style?: StyleProp<TextStyle>;
}
export declare function ItemDescription({ style, ...props }: ItemDescriptionProps): React.JSX.Element;
export interface ItemActionsProps extends ViewProps {
    style?: StyleProp<ViewStyle>;
}
export declare function ItemActions({ style, ...props }: ItemActionsProps): React.JSX.Element;
export interface ItemHeaderProps extends ViewProps {
    style?: StyleProp<ViewStyle>;
}
export declare function ItemHeader({ style, ...props }: ItemHeaderProps): React.JSX.Element;
export interface ItemFooterProps extends ViewProps {
    style?: StyleProp<ViewStyle>;
}
export declare function ItemFooter({ style, ...props }: ItemFooterProps): React.JSX.Element;
//# sourceMappingURL=Item.d.ts.map