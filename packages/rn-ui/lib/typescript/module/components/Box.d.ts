import React from "react";
import { type ViewProps } from "react-native";
import { useTheme } from "../theme/index.js";
import type { ThemeColorName } from "./types.js";
type Space = keyof ReturnType<typeof useTheme>["spacing"];
export interface BoxProps extends ViewProps {
    bg?: ThemeColorName;
    borderColor?: ThemeColorName;
    radius?: keyof ReturnType<typeof useTheme>["radii"];
    p?: Space;
    px?: Space;
    py?: Space;
    m?: Space;
    mx?: Space;
    my?: Space;
    flex?: number;
    row?: boolean;
    center?: boolean;
    gap?: Space;
}
export declare function Box({ bg, borderColor, radius, p, px, py, m, mx, my, flex, row, center, gap, style, ...props }: BoxProps): React.JSX.Element;
export {};
//# sourceMappingURL=Box.d.ts.map