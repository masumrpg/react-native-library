import type { DeepPartial, Theme, ThemeInput, ThemeMode } from "./types";
export declare function mergeTheme<T extends object>(base: T, override?: DeepPartial<T>): T;
export declare function createTheme(mode: ThemeMode, override?: ThemeInput): Theme;
//# sourceMappingURL=createTheme.d.ts.map