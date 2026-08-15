"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderIcon = renderIcon;
function renderIcon(icon, color, size) {
  if (!icon) return null;
  return typeof icon === "function" ? icon({
    color,
    size
  }) : icon;
}
//# sourceMappingURL=types.js.map