import React from "react";
import { type StyleProp, type ViewStyle } from "react-native";
import { type RenderIcon } from "./types";
export interface CommandItem {
    value: string;
    label: string;
    description?: string;
    icon?: RenderIcon;
    disabled?: boolean;
}
export interface CommandProps {
    visible: boolean;
    items: CommandItem[];
    title?: string;
    placeholder?: string;
    emptyText?: string;
    onClose: () => void;
    onSelect?: (value: string, item: CommandItem) => void;
    style?: StyleProp<ViewStyle>;
}
export declare function Command({ visible, items, title, placeholder, emptyText, onClose, onSelect, style, }: CommandProps): React.JSX.Element;
//# sourceMappingURL=Command.d.ts.map