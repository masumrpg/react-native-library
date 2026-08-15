"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Select = Select;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _Text = require("./Text");
var _types = require("./types");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function Select({
  value,
  defaultValue,
  options,
  placeholder = "Select option",
  disabled = false,
  title = "Select",
  onValueChange,
  chevronIcon,
  checkIcon,
  style
}) {
  const {
    colors,
    components,
    radii,
    spacing
  } = (0, _theme.useTheme)();
  const [open, setOpen] = _react.default.useState(false);
  const [internalValue, setInternalValue] = _react.default.useState(defaultValue);
  const currentValue = value ?? internalValue;
  const selected = options.find(option => option.value === currentValue);
  const choose = next => {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
    setOpen(false);
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Pressable, {
      accessibilityRole: "button",
      disabled: disabled,
      onPress: () => setOpen(true),
      style: ({
        pressed
      }) => [{
        minHeight: 44,
        width: "100%",
        borderWidth: components.borderWidth.strong,
        borderColor: colors.border,
        borderRadius: radii.lg,
        backgroundColor: colors.input,
        paddingHorizontal: spacing.md,
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        opacity: disabled ? 0.5 : pressed ? 0.78 : 1
      }, style],
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
        color: selected ? "text" : "placeholder",
        style: {
          flex: 1
        },
        children: selected?.label ?? placeholder
      }), (0, _types.renderIcon)(chevronIcon, colors.textMuted, 18) ?? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
        color: "textMuted",
        children: "\u2304"
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Modal, {
      visible: open,
      transparent: true,
      animationType: "fade",
      onRequestClose: () => setOpen(false),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
        style: {
          flex: 1,
          backgroundColor: colors.overlay,
          justifyContent: "flex-end"
        },
        onPress: () => setOpen(false),
        children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Pressable, {
          style: {
            backgroundColor: colors.surface,
            borderTopLeftRadius: radii.xxl,
            borderTopRightRadius: radii.xxl,
            borderWidth: components.borderWidth.strong,
            borderColor: colors.border,
            padding: spacing.lg,
            gap: spacing.md,
            maxHeight: "72%"
          },
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
            variant: "title",
            children: title
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.ScrollView, {
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
              style: {
                gap: spacing.sm
              },
              children: options.map(option => {
                const active = option.value === currentValue;
                return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Pressable, {
                  disabled: option.disabled,
                  onPress: () => choose(option.value),
                  style: ({
                    pressed
                  }) => ({
                    minHeight: 48,
                    borderRadius: radii.lg,
                    borderWidth: components.borderWidth.strong,
                    borderColor: active ? colors.primary : colors.border,
                    backgroundColor: active ? colors.primarySoft : colors.surface,
                    padding: spacing.md,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.md,
                    opacity: option.disabled ? 0.5 : pressed ? 0.78 : 1
                  }),
                  children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
                    style: {
                      flex: 1,
                      gap: spacing.xs
                    },
                    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
                      variant: "label",
                      children: option.label
                    }), option.description ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
                      variant: "bodySmall",
                      color: "textMuted",
                      children: option.description
                    }) : null]
                  }), active ? (0, _types.renderIcon)(checkIcon, colors.primary, 18) ?? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
                    color: "primary",
                    children: "\u2713"
                  }) : null]
                }, option.value);
              })
            })
          })]
        })
      })
    })]
  });
}
//# sourceMappingURL=Select.js.map