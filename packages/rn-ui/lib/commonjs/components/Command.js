"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Command = Command;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _Input = require("./Input");
var _Text = require("./Text");
var _types = require("./types");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function Command({
  visible,
  items,
  title = "Command",
  placeholder = "Search...",
  emptyText = "No results",
  onClose,
  onSelect,
  style
}) {
  const {
    colors,
    components,
    radii,
    spacing
  } = (0, _theme.useTheme)();
  const [query, setQuery] = _react.default.useState("");
  const filtered = items.filter(item => {
    const text = `${item.label} ${item.description ?? ""}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Modal, {
    visible: visible,
    transparent: true,
    animationType: "fade",
    onRequestClose: onClose,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
      style: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: "flex-end"
      },
      onPress: onClose,
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Pressable, {
        style: [{
          backgroundColor: colors.surface,
          borderTopLeftRadius: radii.xxl,
          borderTopRightRadius: radii.xxl,
          borderWidth: components.borderWidth.strong,
          borderColor: colors.border,
          padding: spacing.lg,
          gap: spacing.md,
          maxHeight: "76%"
        }, style],
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
          variant: "title",
          children: title
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Input.Input, {
          value: query,
          onChangeText: setQuery,
          placeholder: placeholder
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.ScrollView, {
          keyboardShouldPersistTaps: "handled",
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
            style: {
              gap: spacing.sm
            },
            children: filtered.length === 0 ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
              color: "textMuted",
              align: "center",
              style: {
                padding: spacing.lg
              },
              children: emptyText
            }) : filtered.map(item => /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Pressable, {
              disabled: item.disabled,
              onPress: () => {
                onSelect?.(item.value, item);
                onClose();
              },
              style: ({
                pressed
              }) => ({
                minHeight: 48,
                borderRadius: radii.lg,
                padding: spacing.md,
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
                backgroundColor: pressed ? colors.backgroundMuted : colors.surface,
                opacity: item.disabled ? 0.5 : 1
              }),
              children: [(0, _types.renderIcon)(item.icon, colors.primary, 18), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
                style: {
                  flex: 1,
                  gap: spacing.xs
                },
                children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
                  variant: "label",
                  children: item.label
                }), item.description ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
                  variant: "bodySmall",
                  color: "textMuted",
                  children: item.description
                }) : null]
              })]
            }, item.value))
          })
        })]
      })
    })
  });
}
//# sourceMappingURL=Command.js.map