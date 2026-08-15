import React from "react";
import { type PressableProps, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
export interface TabsContextValue {
    value?: string;
    onValueChange?: (value: string) => void;
}
export interface TabsProps extends ViewProps {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    style?: StyleProp<ViewStyle>;
}
export declare function Tabs({ value, defaultValue, onValueChange, style, ...props }: TabsProps): React.JSX.Element;
export interface TabsListProps extends ViewProps {
    style?: StyleProp<ViewStyle>;
}
export declare function TabsList({ style, ...props }: TabsListProps): React.JSX.Element;
export interface TabsTriggerProps extends Omit<PressableProps, "style"> {
    value: string;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}
export declare function TabsTrigger({ value, children, style, disabled, ...props }: TabsTriggerProps): React.JSX.Element;
export interface TabsContentProps extends ViewProps {
    value: string;
    forceMount?: boolean;
    style?: StyleProp<ViewStyle>;
}
export declare function TabsContent({ value, forceMount, style, ...props }: TabsContentProps): React.JSX.Element | null;
//# sourceMappingURL=Tabs.d.ts.map