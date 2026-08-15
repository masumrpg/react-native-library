import React from "react";
import { type ModalProps, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { type ThemeColors } from "../theme/index.js";
import { type RenderIcon } from "./types.js";
export interface ComboboxProps {
    value?: string;
    onValueChange?: (value: string) => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
}
export interface ComboboxContextProps {
    value: string;
    onValueChange: (value: string) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
    inputValue: string;
    setInputValue: (val: string) => void;
    triggerRef: React.RefObject<any>;
    triggerLayout: {
        pageX: number;
        pageY: number;
        width: number;
        height: number;
    };
    measureTrigger: () => void;
    colors: ThemeColors;
}
export declare function useCombobox(): ComboboxContextProps;
export declare function Combobox({ value: controlledValue, onValueChange, open: controlledOpen, onOpenChange, children, }: ComboboxProps): React.JSX.Element;
export interface ComboboxInputProps {
    placeholder?: string;
    style?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    disabled?: boolean;
    chevronIcon?: RenderIcon;
}
export declare function ComboboxInput({ placeholder, style, inputStyle, disabled, chevronIcon, }: ComboboxInputProps): React.JSX.Element;
export interface ComboboxContentProps {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    overlayStyle?: StyleProp<ViewStyle>;
    modalProps?: Omit<ModalProps, "visible" | "transparent" | "animationType" | "onRequestClose">;
}
export declare function ComboboxContent({ children, style, overlayStyle, modalProps, }: ComboboxContentProps): React.JSX.Element | null;
export interface ComboboxListProps {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}
export declare function ComboboxList({ children, style }: ComboboxListProps): React.JSX.Element;
export interface ComboboxItemProps {
    value: string;
    label: string;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    checkIcon?: RenderIcon;
}
export declare function ComboboxItem({ value, label, children, style, checkIcon, }: ComboboxItemProps): React.JSX.Element | null;
export interface ComboboxEmptyProps {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}
export declare function ComboboxEmpty({ children, style, }: ComboboxEmptyProps): React.JSX.Element;
//# sourceMappingURL=Combobox.d.ts.map