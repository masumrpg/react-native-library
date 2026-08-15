"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Item = Item;
exports.ItemActions = ItemActions;
exports.ItemContent = ItemContent;
exports.ItemDescription = ItemDescription;
exports.ItemFooter = ItemFooter;
exports.ItemGroup = ItemGroup;
exports.ItemHeader = ItemHeader;
exports.ItemMedia = ItemMedia;
exports.ItemSeparator = ItemSeparator;
exports.ItemTitle = ItemTitle;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ItemGroup({
  size = "default",
  style,
  ...props
}) {
  const {
    spacing
  } = (0, _theme.useTheme)();
  const gap = size === "xs" ? spacing.sm : size === "sm" ? spacing.md : spacing.lg;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    accessibilityRole: "list",
    style: [{
      width: "100%",
      gap
    }, style],
    ...props
  });
}
function ItemSeparator({
  style,
  ...props
}) {
  const {
    colors,
    spacing
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      height: 1,
      width: "100%",
      marginVertical: spacing.sm,
      backgroundColor: colors.divider
    }, style],
    ...props
  });
}
function Item({
  variant = "default",
  size = "default",
  disabled,
  style,
  ...props
}) {
  const {
    colors,
    radii,
    spacing
  } = (0, _theme.useTheme)();
  const paddingX = size === "xs" ? spacing.md : spacing.lg;
  const paddingY = size === "xs" ? spacing.sm : spacing.md;
  const gap = size === "xs" ? spacing.sm : spacing.md;
  const isDisabled = Boolean(disabled);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
    accessibilityRole: props.onPress ? "button" : undefined,
    accessibilityState: {
      disabled: isDisabled
    },
    disabled: isDisabled,
    style: ({
      pressed
    }) => [{
      width: "100%",
      minHeight: size === "xs" ? 40 : 48,
      paddingHorizontal: paddingX,
      paddingVertical: paddingY,
      borderRadius: radii.lg,
      borderWidth: variant === "outline" ? 1.25 : 1.25,
      borderColor: variant === "outline" ? colors.border : colors.transparent,
      backgroundColor: variant === "muted" ? colors.surfaceMuted : colors.transparent,
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap,
      opacity: isDisabled ? 0.5 : pressed ? 0.78 : 1
    }, typeof style === "function" ? style({
      pressed
    }) : style],
    ...props
  });
}
function ItemMedia({
  variant = "default",
  size = "default",
  style,
  ...props
}) {
  const {
    colors,
    radii
  } = (0, _theme.useTheme)();
  const imageSize = size === "xs" ? 24 : size === "sm" ? 32 : 40;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      width: variant === "image" ? imageSize : undefined,
      height: variant === "image" ? imageSize : undefined,
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",
      overflow: variant === "image" ? "hidden" : undefined,
      borderRadius: variant === "image" ? radii.sm : undefined,
      backgroundColor: variant === "image" ? colors.backgroundMuted : colors.transparent
    }, style],
    ...props
  });
}
function ItemContent({
  style,
  ...props
}) {
  const {
    spacing
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      flex: 1,
      minWidth: 0,
      gap: spacing.xs
    }, style],
    ...props
  });
}
function ItemTitle({
  style,
  ...props
}) {
  const {
    colors,
    typography
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
    numberOfLines: 1,
    style: [typography.label, {
      color: colors.text
    }, style],
    ...props
  });
}
function ItemDescription({
  style,
  ...props
}) {
  const {
    colors,
    typography
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
    numberOfLines: 2,
    style: [typography.bodySmall, {
      color: colors.textMuted
    }, style],
    ...props
  });
}
function ItemActions({
  style,
  ...props
}) {
  const {
    spacing
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm
    }, style],
    ...props
  });
}
function ItemHeader({
  style,
  ...props
}) {
  const {
    spacing
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm
    }, style],
    ...props
  });
}
function ItemFooter({
  style,
  ...props
}) {
  const {
    spacing
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm
    }, style],
    ...props
  });
}
//# sourceMappingURL=Item.js.map