"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Combobox = Combobox;
exports.ComboboxContent = ComboboxContent;
exports.ComboboxEmpty = ComboboxEmpty;
exports.ComboboxInput = ComboboxInput;
exports.ComboboxItem = ComboboxItem;
exports.ComboboxList = ComboboxList;
exports.useCombobox = useCombobox;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _theme = require("../theme");
var _Text = require("./Text");
var _types = require("./types");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const ComboboxContext = /*#__PURE__*/_react.default.createContext(null);
function useCombobox() {
  const context = _react.default.useContext(ComboboxContext);
  if (!context) {
    throw new Error("useCombobox must be used within a <Combobox />");
  }
  return context;
}
function Combobox({
  value: controlledValue,
  onValueChange,
  open: controlledOpen,
  onOpenChange,
  children
}) {
  const {
    colors
  } = (0, _theme.useTheme)();
  const [uncontrolledValue, setUncontrolledValue] = _react.default.useState("");
  const [uncontrolledOpen, setUncontrolledOpen] = _react.default.useState(false);
  const [inputValue, setInputValue] = _react.default.useState("");
  const [triggerLayout, setTriggerLayout] = _react.default.useState({
    pageX: 0,
    pageY: 0,
    width: 0,
    height: 0
  });
  const triggerRef = _react.default.useRef(null);
  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue;
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen = _react.default.useCallback(nextOpen => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(nextOpen);
    }
    if (onOpenChange) {
      onOpenChange(nextOpen);
    }
  }, [controlledOpen, onOpenChange]);
  const handleValueChange = _react.default.useCallback(nextVal => {
    if (controlledValue === undefined) {
      setUncontrolledValue(nextVal);
    }
    if (onValueChange) {
      onValueChange(nextVal);
    }
  }, [controlledValue, onValueChange]);
  const measureTrigger = _react.default.useCallback(() => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      if (width > 0 && height > 0) {
        setTriggerLayout({
          pageX: x,
          pageY: y,
          width,
          height
        });
      }
    });
  }, []);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(ComboboxContext.Provider, {
    value: {
      value,
      onValueChange: handleValueChange,
      open,
      setOpen,
      inputValue,
      setInputValue,
      triggerRef,
      triggerLayout,
      measureTrigger,
      colors
    },
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: {
        width: "100%"
      },
      children: children
    })
  });
}

// Chevron pure arrow down icon
function ChevronDownIcon({
  color
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: {
      width: 8,
      height: 8,
      borderRightWidth: 1.5,
      borderBottomWidth: 1.5,
      borderColor: color,
      transform: [{
        rotate: "45deg"
      }],
      marginTop: -3,
      marginRight: 4
    }
  });
}
function ComboboxInput({
  placeholder = "Select option...",
  style,
  inputStyle,
  disabled = false,
  chevronIcon
}) {
  const {
    inputValue,
    setInputValue,
    open,
    setOpen,
    triggerRef,
    measureTrigger,
    colors
  } = useCombobox();
  const {
    components,
    radii,
    spacing,
    typography
  } = (0, _theme.useTheme)();
  const handleFocus = () => {
    if (!disabled) {
      measureTrigger();
      setOpen(true);
    }
  };
  const handlePress = () => {
    if (!disabled) {
      measureTrigger();
      setOpen(!open);
    }
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Pressable, {
    ref: triggerRef,
    onPress: handlePress,
    disabled: disabled,
    style: [{
      flexDirection: "row",
      alignItems: "center",
      height: 40,
      borderWidth: components.borderWidth.strong,
      borderColor: colors.border,
      borderRadius: radii.lg,
      backgroundColor: colors.input,
      paddingHorizontal: spacing.md,
      width: "100%",
      opacity: disabled ? 0.5 : 1
    }, style],
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.TextInput, {
      editable: !disabled,
      placeholder: placeholder,
      placeholderTextColor: colors.textMuted,
      value: inputValue,
      onChangeText: setInputValue,
      onFocus: handleFocus,
      pointerEvents: disabled ? "none" : "auto",
      style: [{
        flex: 1,
        ...typography.bodySmall,
        color: colors.text,
        padding: 0,
        height: "100%"
      }, inputStyle]
    }), chevronIcon ? (0, _types.renderIcon)(chevronIcon, colors.textMuted, 16) : /*#__PURE__*/(0, _jsxRuntime.jsx)(ChevronDownIcon, {
      color: colors.textMuted
    })]
  });
}
function ComboboxContent({
  children,
  style,
  overlayStyle,
  modalProps
}) {
  const {
    open,
    setOpen,
    triggerLayout,
    colors
  } = useCombobox();
  const {
    components,
    radii
  } = (0, _theme.useTheme)();
  const progress = (0, _reactNativeReanimated.useSharedValue)(open ? 1 : 0);
  _react.default.useEffect(() => {
    progress.value = (0, _reactNativeReanimated.withTiming)(open ? 1 : 0, {
      duration: 150
    });
  }, [open, progress]);
  const {
    height: SCREEN_HEIGHT
  } = _reactNative.Dimensions.get("window");
  const spaceBelow = SCREEN_HEIGHT - (triggerLayout.pageY + triggerLayout.height);
  const dropdownMaxHeight = 220;
  const renderAbove = spaceBelow < dropdownMaxHeight + 40;
  const positionStyle = renderAbove ? {
    bottom: SCREEN_HEIGHT - triggerLayout.pageY + 6
  } : {
    top: triggerLayout.pageY + triggerLayout.height + 6
  };
  const animatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    opacity: progress.value,
    transform: [{
      translateY: (renderAbove ? 8 : -8) * (1 - progress.value)
    }]
  }));
  if (!open) return null;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Modal, {
    transparent: true,
    visible: open,
    animationType: "none",
    statusBarTranslucent: true,
    navigationBarTranslucent: true,
    hardwareAccelerated: true,
    onRequestClose: () => setOpen(false),
    ...modalProps,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
      style: [_reactNative.StyleSheet.absoluteFill, overlayStyle],
      onPress: () => setOpen(false)
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.View, {
      style: [{
        position: "absolute",
        left: triggerLayout.pageX,
        width: triggerLayout.width,
        backgroundColor: colors.surface,
        borderWidth: components.borderWidth.strong,
        borderColor: colors.border,
        borderRadius: radii.lg,
        maxHeight: dropdownMaxHeight,
        overflow: "hidden"
      }, animatedStyle, positionStyle, style],
      children: children
    })]
  });
}
function ComboboxList({
  children,
  style
}) {
  const {
    spacing
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.ScrollView, {
    keyboardShouldPersistTaps: "handled",
    style: [{
      flex: 1,
      padding: spacing.xs
    }, style],
    children: children
  });
}
// Chevron checkmark for selected indicator
function CheckIcon({
  color
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: {
      width: 8,
      height: 5,
      borderLeftWidth: 1.75,
      borderBottomWidth: 1.75,
      borderColor: color,
      transform: [{
        rotate: "-45deg"
      }],
      marginRight: 6
    }
  });
}
function ComboboxItem({
  value,
  label,
  children,
  style,
  checkIcon
}) {
  const {
    value: selectedValue,
    onValueChange,
    setOpen,
    inputValue,
    setInputValue,
    colors
  } = useCombobox();
  const {
    radii,
    spacing,
    typography
  } = (0, _theme.useTheme)();

  // Automatic filter matching
  if (inputValue && !label.toLowerCase().includes(inputValue.toLowerCase())) {
    return null;
  }
  const isSelected = selectedValue === value;
  const handlePress = () => {
    onValueChange(value);
    setInputValue(label);
    setOpen(false);
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Pressable, {
    onPress: handlePress,
    style: ({
      pressed
    }) => [{
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.sm + 1,
      paddingHorizontal: spacing.md,
      borderRadius: radii.md,
      backgroundColor: isSelected ? colors.surfaceMuted : pressed ? colors.surfaceMuted : colors.transparent,
      justifyContent: "space-between"
    }, style],
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
      style: {
        ...typography.bodySmall,
        color: colors.text,
        fontWeight: isSelected ? "500" : "400"
      },
      children: children || label
    }), isSelected && (checkIcon ? (0, _types.renderIcon)(checkIcon, colors.primary, 14) : /*#__PURE__*/(0, _jsxRuntime.jsx)(CheckIcon, {
      color: colors.primary
    }))]
  });
}
function ComboboxEmpty({
  children = "No results found.",
  style
}) {
  const {
    colors
  } = useCombobox();
  const {
    spacing,
    typography
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      padding: spacing.md,
      alignItems: "center"
    }, style],
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
      style: {
        ...typography.caption,
        color: colors.textMuted
      },
      children: children
    })
  });
}
//# sourceMappingURL=Combobox.js.map