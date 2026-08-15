import React from "react";
import { type PressableProps, type StyleProp, type ViewStyle } from "react-native";
export interface PopoverProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
}
export declare function Popover({ open, defaultOpen, onOpenChange, children, }: PopoverProps): React.JSX.Element;
export interface PopoverTriggerProps extends PressableProps {
    triggerMode?: "press" | "longPress";
}
export declare function PopoverTrigger({ triggerMode, onPress, onLongPress, ...props }: PopoverTriggerProps): React.JSX.Element;
export interface PopoverContentProps {
    children?: React.ReactNode;
    width?: number;
    style?: StyleProp<ViewStyle>;
}
export declare function PopoverContent({ children, width, style, }: PopoverContentProps): React.JSX.Element | null;
//# sourceMappingURL=Popover.d.ts.map