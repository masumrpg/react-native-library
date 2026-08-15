import React from "react";
import { type ModalProps, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { type ThemeColors } from "../theme";
import { type RenderIcon } from "./types";
export type DropdownMenuAlign = "start" | "end";
export type DropdownMenuItemVariant = "default" | "destructive";
interface DropdownMenuTriggerLayout {
    pageX: number;
    pageY: number;
    width: number;
    height: number;
}
export interface DropdownMenuContextProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    triggerLayout: DropdownMenuTriggerLayout;
    setTriggerLayout: (layout: DropdownMenuTriggerLayout) => void;
    colors: ThemeColors;
}
export declare function useDropdownMenu(): DropdownMenuContextProps;
export interface DropdownMenuProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
}
export declare function DropdownMenu({ open: controlledOpen, defaultOpen, onOpenChange, children, }: DropdownMenuProps): React.JSX.Element;
export interface DropdownMenuTriggerProps {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
}
export declare function DropdownMenuTrigger({ children, style, disabled, }: DropdownMenuTriggerProps): React.JSX.Element;
export interface DropdownMenuContentProps {
    children?: React.ReactNode;
    align?: DropdownMenuAlign;
    width?: number;
    maxHeight?: number;
    sideOffset?: number;
    style?: StyleProp<ViewStyle>;
    overlayStyle?: StyleProp<ViewStyle>;
    modalProps?: Omit<ModalProps, "visible" | "transparent" | "animationType" | "onRequestClose">;
}
export declare function DropdownMenuContent({ children, align, width, maxHeight, sideOffset, style, overlayStyle, modalProps, }: DropdownMenuContentProps): React.JSX.Element | null;
export interface DropdownMenuItemProps {
    onPress?: () => void;
    children?: React.ReactNode;
    variant?: DropdownMenuItemVariant;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
}
export declare function DropdownMenuItem({ onPress, children, variant, disabled, style, }: DropdownMenuItemProps): React.JSX.Element;
export interface DropdownMenuCheckboxItemProps {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    children?: React.ReactNode;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    checkIcon?: RenderIcon;
}
export declare function DropdownMenuCheckboxItem({ checked, onCheckedChange, children, disabled, style, checkIcon, }: DropdownMenuCheckboxItemProps): React.JSX.Element;
export interface DropdownMenuSeparatorProps {
    style?: StyleProp<ViewStyle>;
}
export declare function DropdownMenuSeparator({ style }: DropdownMenuSeparatorProps): React.JSX.Element;
export interface DropdownMenuLabelProps {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}
export declare function DropdownMenuLabel({ children, style }: DropdownMenuLabelProps): React.JSX.Element;
export interface DropdownMenuShortcutProps {
    children?: React.ReactNode;
    style?: StyleProp<TextStyle>;
}
export declare function DropdownMenuShortcut({ children, style, }: DropdownMenuShortcutProps): React.JSX.Element;
export {};
//# sourceMappingURL=DropdownMenu.d.ts.map