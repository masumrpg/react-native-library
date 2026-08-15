"use strict";

export function withAlpha(color, alpha) {
  const safeAlpha = Math.max(0, Math.min(1, alpha));
  if (color.startsWith("rgba(")) {
    return color.replace(/rgba\((.*),\s*[\d.]+\)/, `rgba($1, ${safeAlpha})`);
  }
  if (color.startsWith("rgb(")) {
    return color.replace("rgb(", "rgba(").replace(")", `, ${safeAlpha})`);
  }
  const hex = color.replace("#", "");
  if (hex.length !== 6) return color;
  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${safeAlpha})`;
}
//# sourceMappingURL=color.js.map