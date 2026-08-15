import React from "react";
import { type StyleProp, type ViewStyle } from "react-native";
export interface CollapsibleProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}
export interface CollapsibleContextProps {
    open: boolean;
    toggle: () => void;
}
export declare function useCollapsible(): CollapsibleContextProps;
export declare function Collapsible({ open: controlledOpen, defaultOpen, onOpenChange, children, style, ...props }: CollapsibleProps): React.JSX.Element;
export interface CollapsibleTriggerProps {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}
export declare function CollapsibleTrigger({ children, style, ...props }: CollapsibleTriggerProps): React.JSX.Element;
export interface CollapsibleContentProps {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}
export declare function CollapsibleContent({ children, style, ...props }: CollapsibleContentProps): React.JSX.Element;
//# sourceMappingURL=Collapsible.d.ts.map