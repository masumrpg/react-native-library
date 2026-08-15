"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTheme = createTheme;
exports.mergeTheme = mergeTheme;
var _tokens = require("./tokens");
function isRecord(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
function mergeTheme(base, override) {
  if (!override) return base;
  const output = {
    ...base
  };
  Object.entries(override).forEach(([key, value]) => {
    const baseValue = output[key];
    if (isRecord(baseValue) && isRecord(value)) {
      output[key] = mergeTheme(baseValue, value);
    } else if (value !== undefined) {
      output[key] = value;
    }
  });
  return output;
}
function createTheme(mode, override) {
  const base = mode === "dark" ? _tokens.darkTheme : _tokens.lightTheme;
  const merged = mergeTheme(base, override);
  return {
    ...merged,
    mode,
    dark: mode === "dark",
    typography: applyFontTokens(merged)
  };
}
function withFont(variant, fontFamily) {
  return {
    ...variant,
    fontFamily: variant.fontFamily ?? fontFamily
  };
}
function applyFontTokens(theme) {
  const {
    fonts,
    typography
  } = theme;
  return {
    display: withFont(typography.display, fonts.bold),
    h1: withFont(typography.h1, fonts.bold),
    h2: withFont(typography.h2, fonts.bold),
    h3: withFont(typography.h3, fonts.semibold),
    title: withFont(typography.title, fonts.semibold),
    subtitle: withFont(typography.subtitle, fonts.semibold),
    body: withFont(typography.body, fonts.regular),
    bodySmall: withFont(typography.bodySmall, fonts.regular),
    label: withFont(typography.label, fonts.semibold ?? fonts.medium),
    labelSmall: withFont(typography.labelSmall, fonts.semibold ?? fonts.medium),
    caption: withFont(typography.caption, fonts.regular)
  };
}
//# sourceMappingURL=createTheme.js.map