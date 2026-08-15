"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DropdownMenu = DropdownMenu;
exports.DropdownMenuCheckboxItem = DropdownMenuCheckboxItem;
exports.DropdownMenuContent = DropdownMenuContent;
exports.DropdownMenuItem = DropdownMenuItem;
exports.DropdownMenuLabel = DropdownMenuLabel;
exports.DropdownMenuSeparator = DropdownMenuSeparator;
exports.DropdownMenuShortcut = DropdownMenuShortcut;
exports.DropdownMenuTrigger = DropdownMenuTrigger;
exports.useDropdownMenu = useDropdownMenu;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _theme = require("../theme");
var _Text = require("./Text");
var _types = require("./types");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const DropdownMenuContext = /*#__PURE__*/_react.default.createContext(null);
function useDropdownMenu() {
  const context = _react.default.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("useDropdownMenu must be used within a <DropdownMenu />");
  }
  return context;
}
function DropdownMenu({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children
}) {
  const {
    colors
  } = (0, _theme.useTheme)();
  const [uncontrolledOpen, setUncontrolledOpen] = _react.default.useState(defaultOpen);
  const [triggerLayout, setTriggerLayout] = _react.default.useState({
    pageX: 0,
    pageY: 0,
    width: 0,
    height: 0
  });
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = _react.default.useCallback(nextOpen => {
    if (!isControlled) {
      setUncontrolledOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  }, [isControlled, onOpenChange]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(DropdownMenuContext.Provider, {
    value: {
      open,
      setOpen,
      triggerLayout,
      setTriggerLayout,
      colors
    },
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: {
        alignSelf: "flex-start"
      },
      children: children
    })
  });
}
function DropdownMenuTrigger({
  children,
  style,
  disabled = false
}) {
  const {
    open,
    setOpen,
    setTriggerLayout
  } = useDropdownMenu();
  const triggerRef = _react.default.useRef(null);
  const handlePress = () => {
    if (disabled) return;
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      if (width > 0 && height > 0) {
        setTriggerLayout({
          pageX: x,
          pageY: y,
          width,
          height
        });
        setOpen(!open);
      }
    });
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
    ref: triggerRef,
    accessibilityRole: "button",
    accessibilityState: {
      expanded: open,
      disabled
    },
    disabled: disabled,
    onPress: handlePress,
    style: style,
    children: children
  });
}
function DropdownMenuContent({
  children,
  align = "start",
  width = 200,
  maxHeight = 280,
  sideOffset = 6,
  style,
  overlayStyle,
  modalProps
}) {
  const {
    open,
    setOpen,
    triggerLayout,
    colors
  } = useDropdownMenu();
  const {
    components,
    radii,
    spacing
  } = (0, _theme.useTheme)();
  const progress = (0, _reactNativeReanimated.useSharedValue)(0);
  _react.default.useEffect(() => {
    progress.value = (0, _reactNativeReanimated.withTiming)(open ? 1 : 0, {
      duration: 150
    });
  }, [open, progress]);
  const {
    height: screenHeight,
    width: screenWidth
  } = _reactNative.Dimensions.get("window");
  const spaceBelow = screenHeight - (triggerLayout.pageY + triggerLayout.height);
  const renderAbove = spaceBelow < maxHeight + 40;
  const rawLeft = align === "end" ? triggerLayout.pageX + triggerLayout.width - width : triggerLayout.pageX;
  const left = Math.min(Math.max(spacing.sm, rawLeft), screenWidth - width - spacing.sm);
  const positionStyle = renderAbove ? {
    bottom: screenHeight - triggerLayout.pageY + sideOffset
  } : {
    top: triggerLayout.pageY + triggerLayout.height + sideOffset
  };
  const animatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    return {
      opacity: progress.value,
      transform: [{
        translateY: renderAbove ? (1 - progress.value) * 8 : (1 - progress.value) * -8
      }, {
        scale: 0.98 + progress.value * 0.02
      }]
    };
  });
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
        left,
        width,
        backgroundColor: colors.surface,
        borderWidth: components.borderWidth.strong,
        borderColor: colors.border,
        borderRadius: radii.lg,
        padding: spacing.xs,
        maxHeight,
        overflow: "hidden"
      }, positionStyle, animatedStyle, style],
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.ScrollView, {
        keyboardShouldPersistTaps: "handled",
        children: children
      })
    })]
  });
}
function DropdownMenuItem({
  onPress,
  children,
  variant = "default",
  disabled = false,
  style
}) {
  const {
    setOpen,
    colors
  } = useDropdownMenu();
  const {
    radii,
    spacing,
    typography
  } = (0, _theme.useTheme)();
  const isDestructive = variant === "destructive";
  const textColor = disabled ? colors.textMuted : isDestructive ? colors.danger : colors.text;
  const handlePress = () => {
    if (disabled) return;
    onPress?.();
    setOpen(false);
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
    disabled: disabled,
    onPress: handlePress,
    style: ({
      pressed
    }) => [{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radii.md,
      backgroundColor: pressed ? isDestructive ? colors.dangerSoft : colors.surfaceMuted : colors.transparent,
      opacity: disabled ? 0.5 : 1
    }, style],
    children: typeof children === "string" ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
      style: {
        ...typography.bodySmall,
        color: textColor
      },
      children: children
    }) : children
  });
}
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
      marginRight: 2
    }
  });
}
function DropdownMenuCheckboxItem({
  checked = false,
  onCheckedChange,
  children,
  disabled = false,
  style,
  checkIcon
}) {
  const {
    setOpen,
    colors
  } = useDropdownMenu();
  const {
    radii,
    spacing,
    typography
  } = (0, _theme.useTheme)();
  const handlePress = () => {
    if (disabled) return;
    onCheckedChange?.(!checked);
    setOpen(false);
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Pressable, {
    disabled: disabled,
    onPress: handlePress,
    style: ({
      pressed
    }) => [{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radii.md,
      backgroundColor: pressed ? colors.surfaceMuted : colors.transparent,
      opacity: disabled ? 0.5 : 1
    }, style],
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
      style: {
        ...typography.bodySmall,
        color: disabled ? colors.textMuted : colors.text,
        flex: 1
      },
      children: children
    }), checked && (checkIcon ? (0, _types.renderIcon)(checkIcon, colors.primary, 14) : /*#__PURE__*/(0, _jsxRuntime.jsx)(CheckIcon, {
      color: colors.primary
    }))]
  });
}
function DropdownMenuSeparator({
  style
}) {
  const {
    colors
  } = useDropdownMenu();
  const {
    spacing
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      height: 1,
      backgroundColor: colors.border,
      marginVertical: spacing.xs
    }, style]
  });
}
function DropdownMenuLabel({
  children,
  style
}) {
  const {
    colors
  } = useDropdownMenu();
  const {
    spacing,
    typography
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      paddingVertical: spacing.xs + 2,
      paddingHorizontal: spacing.md
    }, style],
    children: typeof children === "string" ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
      style: {
        ...typography.labelSmall,
        color: colors.textMuted
      },
      children: children
    }) : children
  });
}
function DropdownMenuShortcut({
  children,
  style
}) {
  const {
    colors
  } = useDropdownMenu();
  const {
    spacing,
    typography
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
    style: [{
      ...typography.caption,
      color: colors.textMuted,
      marginLeft: spacing.sm
    }, style],
    children: children
  });
}
//# sourceMappingURL=DropdownMenu.js.map