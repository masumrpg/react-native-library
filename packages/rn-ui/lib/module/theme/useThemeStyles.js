"use strict";

import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "./useTheme.js";
export function useThemeStyles(factory) {
  const {
    theme
  } = useTheme();
  return useMemo(() => StyleSheet.create(factory(theme)), [factory, theme]);
}
//# sourceMappingURL=useThemeStyles.js.map