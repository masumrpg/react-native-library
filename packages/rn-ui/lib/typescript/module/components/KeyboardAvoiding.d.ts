import React from "react";
import { type KeyboardAvoidingViewProps, type ScrollViewProps, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "../theme/index.js";
import type { ThemeColorName } from "./types.js";
type Space = keyof ReturnType<typeof useTheme>["spacing"];
export interface KeyboardAvoidingProps extends Omit<KeyboardAvoidingViewProps, "style"> {
    bg?: ThemeColorName;
    p?: Space;
    px?: Space;
    py?: Space;
    gap?: Space;
    scroll?: boolean;
    fullHeight?: boolean;
    contentContainerStyle?: StyleProp<ViewStyle>;
    scrollViewProps?: ScrollViewProps;
    style?: StyleProp<ViewStyle>;
}
export declare function KeyboardAvoiding({ bg, p, px, py, gap, scroll, fullHeight, behavior, keyboardVerticalOffset, enabled, contentContainerStyle, scrollViewProps, style, children, ...props }: KeyboardAvoidingProps): React.JSX.Element;
export {};
//# sourceMappingURL=KeyboardAvoiding.d.ts.map