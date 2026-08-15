"use strict";

import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useColorScheme as useNativeColorScheme } from "react-native";
import { createTheme } from "./createTheme.js";
import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
export const ThemeContext = /*#__PURE__*/createContext(null);
const DEFAULT_STORAGE_KEY = "rn-ui-color-scheme";
const VALID_SCHEMES = new Set(["light", "dark", "system"]);
function isValidScheme(value) {
  return !!value && VALID_SCHEMES.has(value);
}
function resolveColorScheme(preference, nativeScheme) {
  if (preference === "system") {
    return nativeScheme === "dark" ? "dark" : "light";
  }
  return preference;
}
export function ThemeProvider({
  children,
  colorScheme,
  defaultColorScheme = "system",
  themes,
  storage,
  storageKey = DEFAULT_STORAGE_KEY,
  waitForStorage = true,
  fallback = null,
  onColorSchemeChange
}) {
  const nativeScheme = useNativeColorScheme();
  const isControlled = colorScheme !== undefined;
  const [internalScheme, setInternalScheme] = useState(colorScheme ?? defaultColorScheme);
  const [isHydrated, setIsHydrated] = useState(isControlled || !storage);
  useEffect(() => {
    if (isControlled || !storage) {
      setIsHydrated(true);
      return;
    }
    let mounted = true;
    setIsHydrated(false);
    Promise.resolve(storage.getItem(storageKey)).then(saved => {
      if (mounted && isValidScheme(saved)) {
        setInternalScheme(saved);
      }
    }).catch(() => undefined).finally(() => {
      if (mounted) {
        setIsHydrated(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, [isControlled, storage, storageKey]);
  const activeScheme = colorScheme ?? internalScheme;
  const resolvedColorScheme = resolveColorScheme(activeScheme, nativeScheme);
  const theme = useMemo(() => createTheme(resolvedColorScheme, themes?.[resolvedColorScheme]), [resolvedColorScheme, themes]);
  const setColorScheme = useCallback(next => {
    if (!isControlled) {
      setInternalScheme(next);
    }
    onColorSchemeChange?.(next);
    if (storage) {
      Promise.resolve(storage.setItem(storageKey, next)).catch(() => undefined);
    }
  }, [isControlled, onColorSchemeChange, storage, storageKey]);
  const toggleColorScheme = useCallback(() => {
    setColorScheme(resolvedColorScheme === "dark" ? "light" : "dark");
  }, [resolvedColorScheme, setColorScheme]);
  const value = useMemo(() => ({
    theme,
    colors: theme.colors,
    fonts: theme.fonts,
    typography: theme.typography,
    spacing: theme.spacing,
    radii: theme.radii,
    shadows: theme.shadows,
    components: theme.components,
    colorScheme: activeScheme,
    resolvedColorScheme,
    isDark: theme.dark,
    isHydrated,
    setColorScheme,
    toggleColorScheme
  }), [activeScheme, isHydrated, resolvedColorScheme, setColorScheme, theme, toggleColorScheme]);
  if (waitForStorage && !isHydrated) {
    return /*#__PURE__*/_jsx(_Fragment, {
      children: fallback
    });
  }
  return /*#__PURE__*/_jsx(ThemeContext.Provider, {
    value: value,
    children: children
  });
}
//# sourceMappingURL=ThemeProvider.js.map