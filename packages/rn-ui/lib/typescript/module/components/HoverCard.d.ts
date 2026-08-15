import React from "react";
import { type ModalProps, type StyleProp, type ViewStyle } from "react-native";
import { type ThemeColors } from "../theme/index.js";
export type HoverCardAlign = "start" | "center" | "end";
export type HoverCardTriggerMode = "longPress" | "press" | "manual";
interface HoverCardTriggerLayout {
    pageX: number;
    pageY: number;
    width: number;
    height: number;
}
export interface HoverCardContextProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    triggerLayout: HoverCardTriggerLayout;
    setTriggerLayout: (layout: HoverCardTriggerLayout) => void;
    openDelay: number;
    closeDelay: number;
    triggerMode: HoverCardTriggerMode;
    colors: ThemeColors;
}
export declare function useHoverCard(): HoverCardContextProps;
export interface HoverCardProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    openDelay?: number;
    closeDelay?: number;
    triggerMode?: HoverCardTriggerMode;
    children?: React.ReactNode;
}
export declare function HoverCard({ open: controlledOpen, defaultOpen, onOpenChange, openDelay, closeDelay, triggerMode, children, }: HoverCardProps): React.JSX.Element;
export interface HoverCardTriggerProps {
    children?: React.ReactNode;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
}
export declare function HoverCardTrigger({ children, disabled, style, }: HoverCardTriggerProps): React.JSX.Element;
export interface HoverCardContentProps {
    children?: React.ReactNode;
    align?: HoverCardAlign;
    width?: number;
    maxHeight?: number;
    sideOffset?: number;
    style?: StyleProp<ViewStyle>;
    overlayStyle?: StyleProp<ViewStyle>;
    modalProps?: Omit<ModalProps, "visible" | "transparent" | "animationType" | "onRequestClose">;
}
export declare function HoverCardContent({ children, align, width, maxHeight, sideOffset, style, overlayStyle, modalProps, }: HoverCardContentProps): React.JSX.Element | null;
export {};
//# sourceMappingURL=HoverCard.d.ts.map