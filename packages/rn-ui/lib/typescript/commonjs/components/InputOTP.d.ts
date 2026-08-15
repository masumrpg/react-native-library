import React from "react";
import { type PressableProps, type StyleProp, type TextInputProps, type ViewProps, type ViewStyle } from "react-native";
export interface InputOTPSlotState {
    char: string;
    hasFakeCaret: boolean;
    isActive: boolean;
}
export interface InputOTPContextValue {
    slots: InputOTPSlotState[];
    disabled: boolean;
    invalid: boolean;
    focused: boolean;
    focus: () => void;
}
export declare const InputOTPContext: React.Context<InputOTPContextValue | null>;
export interface InputOTPProps extends Omit<PressableProps, "children" | "style"> {
    children: React.ReactNode;
    value?: string;
    defaultValue?: string;
    onChangeText?: (value: string) => void;
    maxLength?: number;
    disabled?: boolean;
    invalid?: boolean;
    autoFocus?: boolean;
    textInputProps?: Omit<TextInputProps, "value" | "defaultValue" | "onChangeText" | "maxLength" | "editable">;
    style?: StyleProp<ViewStyle>;
}
export declare function InputOTP({ children, value, defaultValue, onChangeText, maxLength, disabled, invalid, autoFocus, textInputProps, style, onPress, ...props }: InputOTPProps): React.JSX.Element;
export interface InputOTPGroupProps extends ViewProps {
    style?: StyleProp<ViewStyle>;
}
export declare function InputOTPGroup({ style, ...props }: InputOTPGroupProps): React.JSX.Element;
export interface InputOTPSlotProps extends ViewProps {
    index: number;
    style?: StyleProp<ViewStyle>;
}
export declare function InputOTPSlot({ index, style, ...props }: InputOTPSlotProps): React.JSX.Element;
export interface InputOTPSeparatorProps extends ViewProps {
    style?: StyleProp<ViewStyle>;
}
export declare function InputOTPSeparator({ style, children, ...props }: InputOTPSeparatorProps): React.JSX.Element;
//# sourceMappingURL=InputOTP.d.ts.map