import React from "react";
import { type StyleProp, type TextStyle, type ViewProps, type ViewStyle } from "react-native";
import { type RenderIcon } from "./types.js";
export type ToastTone = "default" | "success" | "warning" | "danger" | "info";
export type ToastPlacement = "top" | "bottom";
export interface ToastAction {
    label: string;
    onPress: () => void;
}
export interface ToastOptions {
    id?: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    tone?: ToastTone;
    icon?: RenderIcon;
    closeIcon?: RenderIcon;
    action?: ToastAction;
    duration?: number;
}
export interface ToastRecord extends Required<Pick<ToastOptions, "id">> {
    title?: React.ReactNode;
    description?: React.ReactNode;
    tone: ToastTone;
    icon?: RenderIcon;
    closeIcon?: RenderIcon;
    action?: ToastAction;
    duration: number;
    open: boolean;
}
export interface ToastContextValue {
    show: (options: ToastOptions) => string;
    dismiss: (id?: string) => void;
    update: (id: string, options: Omit<ToastOptions, "id">) => void;
}
export declare const ToastContext: React.Context<ToastContextValue | null>;
export interface ToastProviderProps {
    children: React.ReactNode;
    placement?: ToastPlacement;
    offset?: number;
    duration?: number;
    maxToasts?: number;
    swipeToDismiss?: boolean;
    renderToast?: (toast: ToastRecord, controls: ToastContextValue) => React.ReactNode;
    viewportStyle?: StyleProp<ViewStyle>;
}
export declare function ToastProvider({ children, placement, offset, duration, maxToasts, swipeToDismiss, renderToast, viewportStyle, }: ToastProviderProps): React.JSX.Element;
export declare function useToast(): ToastContextValue;
export interface ToastViewportProps extends ViewProps {
    placement?: ToastPlacement;
    offset?: number;
    style?: StyleProp<ViewStyle>;
}
export declare function ToastViewport({ placement, offset, style, ...props }: ToastViewportProps): React.JSX.Element;
export interface ToastProps extends ViewProps {
    toast: ToastRecord;
    placement?: ToastPlacement;
    swipeToDismiss?: boolean;
    onDismiss?: () => void;
    onCloseComplete?: () => void;
    style?: StyleProp<ViewStyle>;
}
export declare function Toast({ toast, placement, swipeToDismiss, onDismiss, onCloseComplete, style, ...props }: ToastProps): React.JSX.Element;
export interface ToastContentProps extends ViewProps {
    style?: StyleProp<ViewStyle>;
}
export declare function ToastContent({ style, ...props }: ToastContentProps): React.JSX.Element;
export interface ToastTitleProps {
    children?: React.ReactNode;
    style?: StyleProp<TextStyle>;
}
export declare function ToastTitle({ children, style }: ToastTitleProps): React.JSX.Element;
export interface ToastDescriptionProps {
    children?: React.ReactNode;
    style?: StyleProp<TextStyle>;
}
export declare function ToastDescription({ children, style }: ToastDescriptionProps): React.JSX.Element;
export interface ToastActionProps {
    label: string;
    onPress?: () => void;
}
export declare function ToastAction({ label, onPress }: ToastActionProps): React.JSX.Element;
export interface ToastCloseProps {
    onPress?: () => void;
    icon?: RenderIcon;
}
export declare function ToastClose({ onPress, icon }: ToastCloseProps): React.JSX.Element;
//# sourceMappingURL=Toast.d.ts.map