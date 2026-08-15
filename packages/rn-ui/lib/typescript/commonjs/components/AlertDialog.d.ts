import React from "react";
import { type ModalProps, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { type RenderIcon } from "./types";
export type AlertDialogTone = "primary" | "success" | "warning" | "danger" | "info" | "secondary";
export interface AlertDialogProps {
    visible: boolean;
    title?: React.ReactNode;
    description?: React.ReactNode;
    children?: React.ReactNode;
    tone?: AlertDialogTone;
    icon?: RenderIcon;
    closeIcon?: RenderIcon;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    onClose?: () => void;
    confirmLoading?: boolean;
    confirmDisabled?: boolean;
    cancelDisabled?: boolean;
    dismissOnBackdropPress?: boolean;
    animated?: boolean;
    animationDuration?: number;
    modalProps?: Omit<ModalProps, "visible" | "transparent" | "animationType" | "onRequestClose">;
    overlayStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    titleStyle?: StyleProp<TextStyle>;
    descriptionStyle?: StyleProp<TextStyle>;
}
export declare function AlertDialog({ visible, title, description, children, tone, icon, closeIcon, confirmText, cancelText, onConfirm, onCancel, onClose, confirmLoading, confirmDisabled, cancelDisabled, dismissOnBackdropPress, animated, animationDuration, modalProps, overlayStyle, style, contentStyle, titleStyle, descriptionStyle, }: AlertDialogProps): React.JSX.Element | null;
//# sourceMappingURL=AlertDialog.d.ts.map