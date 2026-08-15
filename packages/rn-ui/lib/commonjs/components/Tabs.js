"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tabs = Tabs;
exports.TabsContent = TabsContent;
exports.TabsList = TabsList;
exports.TabsTrigger = TabsTrigger;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _Text = require("./Text");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const TabsContext = /*#__PURE__*/_react.default.createContext(null);
function Tabs({
  value,
  defaultValue,
  onValueChange,
  style,
  ...props
}) {
  const {
    spacing
  } = (0, _theme.useTheme)();
  const [internalValue, setInternalValue] = _react.default.useState(defaultValue);
  const currentValue = value ?? internalValue;
  const handleValueChange = _react.default.useCallback(next => {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  }, [onValueChange, value]);
  const context = _react.default.useMemo(() => ({
    value: currentValue,
    onValueChange: handleValueChange
  }), [currentValue, handleValueChange]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(TabsContext.Provider, {
    value: context,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: [{
        width: "100%",
        gap: spacing.md
      }, style],
      ...props
    })
  });
}
function TabsList({
  style,
  ...props
}) {
  const {
    colors,
    components,
    radii,
    spacing
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      width: "100%",
      minHeight: 44,
      padding: 3,
      borderRadius: radii.lg,
      borderWidth: components.borderWidth.strong,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      flexDirection: "row",
      gap: spacing.xs
    }, style],
    ...props
  });
}
function TabsTrigger({
  value,
  children,
  style,
  disabled,
  ...props
}) {
  const context = _react.default.useContext(TabsContext);
  const {
    colors,
    radii,
    spacing
  } = (0, _theme.useTheme)();
  const active = context?.value === value;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
    accessibilityRole: "tab",
    accessibilityState: {
      selected: active,
      disabled: Boolean(disabled)
    },
    disabled: disabled,
    onPress: () => context?.onValueChange?.(value),
    style: ({
      pressed
    }) => [{
      flex: 1,
      minHeight: 36,
      borderRadius: radii.md,
      backgroundColor: active ? colors.primary : colors.transparent,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.md,
      opacity: disabled ? 0.5 : pressed ? 0.78 : 1
    }, style],
    ...props,
    children: typeof children === "string" ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
      variant: "label",
      style: {
        color: active ? colors.onPrimary : colors.textMuted
      },
      children: children
    }) : children
  });
}
function TabsContent({
  value,
  forceMount = false,
  style,
  ...props
}) {
  const context = _react.default.useContext(TabsContext);
  const active = context?.value === value;
  if (!active && !forceMount) return null;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      display: active ? "flex" : "none"
    }, style],
    ...props
  });
}
//# sourceMappingURL=Tabs.js.map