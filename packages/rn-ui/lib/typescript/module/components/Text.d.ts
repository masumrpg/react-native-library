import React from "react";
import { type TextProps as RNTextProps, type TextStyle } from "react-native";
import { useTheme } from "../theme/index.js";
import type { ThemeColorName } from "./types.js";
export interface TextProps extends RNTextProps {
    variant?: keyof ReturnType<typeof useTheme>["typography"];
    color?: ThemeColorName;
    align?: TextStyle["textAlign"];
    weight?: TextStyle["fontWeight"];
}
export declare function Text({ variant, color, align, weight, style, ...props }: TextProps): React.JSX.Element;
//# sourceMappingURL=Text.d.ts.map