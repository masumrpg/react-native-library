import React from "react";
import { TextInput } from "react-native";
import { type InputProps } from "./Input";
export interface TextareaProps extends Omit<InputProps, "multiline"> {
    minRows?: number;
}
export declare const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<TextInput>>;
//# sourceMappingURL=Textarea.d.ts.map