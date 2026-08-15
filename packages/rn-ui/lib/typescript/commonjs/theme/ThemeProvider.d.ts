import React from "react";
import type { ThemeContextValue, ThemeProviderProps } from "./types";
export declare const ThemeContext: React.Context<ThemeContextValue | null>;
export declare function ThemeProvider({ children, colorScheme, defaultColorScheme, themes, storage, storageKey, waitForStorage, fallback, onColorSchemeChange, }: ThemeProviderProps): React.JSX.Element;
//# sourceMappingURL=ThemeProvider.d.ts.map