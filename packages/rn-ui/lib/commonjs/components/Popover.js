"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Popover = Popover;
exports.PopoverContent = PopoverContent;
exports.PopoverTrigger = PopoverTrigger;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const PopoverContext = /*#__PURE__*/_react.default.createContext(null);
function Popover({
  open,
  defaultOpen = false,
  onOpenChange,
  children
}) {
  const [internalOpen, setInternalOpen] = _react.default.useState(defaultOpen);
  const currentOpen = open ?? internalOpen;
  const setOpen = next => {
    if (open === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(PopoverContext.Provider, {
    value: {
      open: currentOpen,
      setOpen
    },
    children: children
  });
}
function PopoverTrigger({
  triggerMode = "press",
  onPress,
  onLongPress,
  ...props
}) {
  const context = _react.default.useContext(PopoverContext);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
    onPress: event => {
      if (triggerMode === "press") context?.setOpen(true);
      onPress?.(event);
    },
    onLongPress: event => {
      if (triggerMode === "longPress") context?.setOpen(true);
      onLongPress?.(event);
    },
    ...props
  });
}
function PopoverContent({
  children,
  width = 280,
  style
}) {
  const context = _react.default.useContext(PopoverContext);
  const {
    colors,
    components,
    radii,
    spacing
  } = (0, _theme.useTheme)();
  if (!context) return null;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Modal, {
    visible: context.open,
    transparent: true,
    animationType: "fade",
    onRequestClose: () => context.setOpen(false),
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
      style: {
        flex: 1,
        backgroundColor: colors.overlay,
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.xl
      },
      onPress: () => context.setOpen(false),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
        style: [{
          width,
          maxWidth: "100%",
          borderRadius: radii.xl,
          borderWidth: components.borderWidth.strong,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          padding: spacing.lg
        }, style],
        children: children
      })
    })
  });
}
//# sourceMappingURL=Popover.js.map