"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThemeContext = void 0;
exports.ThemeProvider = ThemeProvider;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _createTheme = require("./createTheme");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const ThemeContext = exports.ThemeContext = /*#__PURE__*/(0, _react.createContext)(null);
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
function ThemeProvider({
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
  const nativeScheme = (0, _reactNative.useColorScheme)();
  const isControlled = colorScheme !== undefined;
  const [internalScheme, setInternalScheme] = (0, _react.useState)(colorScheme ?? defaultColorScheme);
  const [isHydrated, setIsHydrated] = (0, _react.useState)(isControlled || !storage);
  (0, _react.useEffect)(() => {
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
  const theme = (0, _react.useMemo)(() => (0, _createTheme.createTheme)(resolvedColorScheme, themes?.[resolvedColorScheme]), [resolvedColorScheme, themes]);
  const setColorScheme = (0, _react.useCallback)(next => {
    if (!isControlled) {
      setInternalScheme(next);
    }
    onColorSchemeChange?.(next);
    if (storage) {
      Promise.resolve(storage.setItem(storageKey, next)).catch(() => undefined);
    }
  }, [isControlled, onColorSchemeChange, storage, storageKey]);
  const toggleColorScheme = (0, _react.useCallback)(() => {
    setColorScheme(resolvedColorScheme === "dark" ? "light" : "dark");
  }, [resolvedColorScheme, setColorScheme]);
  const value = (0, _react.useMemo)(() => ({
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
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {
      children: fallback
    });
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(ThemeContext.Provider, {
    value: value,
    children: children
  });
}
//# sourceMappingURL=ThemeProvider.js.map