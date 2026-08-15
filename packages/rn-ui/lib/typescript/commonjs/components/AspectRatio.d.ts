import React from "react";
import { type ViewProps } from "react-native";
import { useTheme } from "../theme";
export interface AspectRatioProps extends ViewProps {
    /**
     * The aspect ratio of the container, e.g., 16/9, 4/3, 1.
     * Defaults to 1.
     */
    ratio?: number;
    /**
     * The border radius token from the theme.
     */
    radius?: keyof ReturnType<typeof useTheme>["radii"];
    /**
     * The content to render inside the AspectRatio container.
     */
    children?: React.ReactNode;
}
export declare function AspectRatio({ ratio, radius, children, style, ...props }: AspectRatioProps): React.JSX.Element;
//# sourceMappingURL=AspectRatio.d.ts.map