import React from "react";
import { View, type StyleProp, type TextStyle, type ViewProps, type ViewStyle } from "react-native";
export type ButtonGroupOrientation = "horizontal" | "vertical";
export interface ButtonGroupProps extends ViewProps {
    orientation?: ButtonGroupOrientation;
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
}
export declare function ButtonGroup({ orientation, style, children, ...props }: ButtonGroupProps): React.JSX.Element;
export interface ButtonGroupTextProps extends React.ComponentPropsWithoutRef<typeof View> {
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    children?: React.ReactNode;
}
export declare function ButtonGroupText({ style, textStyle, children, ...props }: ButtonGroupTextProps): React.JSX.Element;
export interface ButtonGroupSeparatorProps extends React.ComponentPropsWithoutRef<typeof View> {
    orientation?: ButtonGroupOrientation;
    style?: StyleProp<ViewStyle>;
}
export declare function ButtonGroupSeparator({ orientation, style, ...props }: ButtonGroupSeparatorProps): React.JSX.Element;
//# sourceMappingURL=ButtonGroup.d.ts.map