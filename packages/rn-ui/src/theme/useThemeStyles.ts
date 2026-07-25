import { useMemo } from "react";
import { StyleSheet } from "react-native";

import { useTheme } from "./useTheme";
import type { ThemeNamedStyles, ThemeStyleFactory } from "./types";

export function useThemeStyles<T extends ThemeNamedStyles<T>>(
  factory: ThemeStyleFactory<T>,
): T {
  const { theme } = useTheme();

  return useMemo(() => StyleSheet.create(factory(theme)), [factory, theme]);
}
