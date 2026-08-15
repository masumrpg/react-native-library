import React from "react";
import { View, type ImageProps, type ImageStyle, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
export type AvatarSize = "default" | "sm" | "lg";
export interface AvatarProps extends React.ComponentPropsWithoutRef<typeof View> {
    size?: AvatarSize;
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
}
export declare function Avatar({ size, style, children, ...props }: AvatarProps): React.JSX.Element;
export interface AvatarImageProps extends Omit<ImageProps, "style"> {
    style?: StyleProp<ImageStyle>;
}
export declare function AvatarImage({ source, style, onLoad, onError, ...props }: AvatarImageProps): React.JSX.Element | null;
export interface AvatarFallbackProps extends React.ComponentPropsWithoutRef<typeof View> {
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    children?: React.ReactNode;
}
export declare function AvatarFallback({ style, textStyle, children, ...props }: AvatarFallbackProps): React.JSX.Element | null;
export interface AvatarBadgeProps extends React.ComponentPropsWithoutRef<typeof View> {
    style?: StyleProp<ViewStyle>;
    bg?: string;
}
export declare function AvatarBadge({ style, bg, ...props }: AvatarBadgeProps): React.JSX.Element;
export interface AvatarGroupProps extends React.ComponentPropsWithoutRef<typeof View> {
    size?: AvatarSize;
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
}
export declare function AvatarGroup({ size, style, children, ...props }: AvatarGroupProps): React.JSX.Element;
export interface AvatarGroupCountProps extends React.ComponentPropsWithoutRef<typeof View> {
    count: number;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}
export declare function AvatarGroupCount({ count, style, textStyle, ...props }: AvatarGroupCountProps): React.JSX.Element;
//# sourceMappingURL=Avatar.d.ts.map