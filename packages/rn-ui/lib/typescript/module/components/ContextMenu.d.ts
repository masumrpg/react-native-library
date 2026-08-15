import React from "react";
import { type ModalProps, type StyleProp, type ViewStyle, type TextStyle } from "react-native";
import { type ThemeColors } from "../theme/index.js";
import { type RenderIcon } from "./types.js";
export interface ContextMenuProps {
    children?: React.ReactNode;
}
export interface ContextMenuContextProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    triggerLayout: {
        pageX: number;
        pageY: number;
        width: number;
        height: number;
    };
    setTriggerLayout: (layout: any) => void;
    colors: ThemeColors;
}
export declare function useContextMenu(): ContextMenuContextProps;
export declare function ContextMenu({ children }: ContextMenuProps): React.JSX.Element;
export interface ContextMenuTriggerProps {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
}
export declare function ContextMenuTrigger({ children, style, disabled, }: ContextMenuTriggerProps): React.JSX.Element;
export interface ContextMenuContentProps {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    overlayStyle?: StyleProp<ViewStyle>;
    modalProps?: Omit<ModalProps, "visible" | "transparent" | "animationType" | "onRequestClose">;
    width?: number;
}
export declare function ContextMenuContent({ children, style, overlayStyle, modalProps, width, }: ContextMenuContentProps): React.JSX.Element | null;
export interface ContextMenuItemProps {
    onPress?: () => void;
    children?: React.ReactNode;
    variant?: "default" | "destructive";
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
}
export declare function ContextMenuItem({ onPress, children, variant, disabled, style, }: ContextMenuItemProps): React.JSX.Element;
export interface ContextMenuSeparatorProps {
    style?: StyleProp<ViewStyle>;
}
export declare function ContextMenuSeparator({ style }: ContextMenuSeparatorProps): React.JSX.Element;
export interface ContextMenuLabelProps {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}
export declare function ContextMenuLabel({ children, style }: ContextMenuLabelProps): React.JSX.Element;
export interface ContextMenuCheckboxItemProps {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    children?: React.ReactNode;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    checkIcon?: RenderIcon;
}
export declare function ContextMenuCheckboxItem({ checked, onCheckedChange, children, disabled, style, checkIcon, }: ContextMenuCheckboxItemProps): React.JSX.Element;
export interface ContextMenuShortcutProps {
    children?: React.ReactNode;
    style?: StyleProp<TextStyle>;
}
export declare function ContextMenuShortcut({ children, style, }: ContextMenuShortcutProps): React.JSX.Element;
//# sourceMappingURL=ContextMenu.d.ts.map