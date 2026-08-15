"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContextMenu = ContextMenu;
exports.ContextMenuCheckboxItem = ContextMenuCheckboxItem;
exports.ContextMenuContent = ContextMenuContent;
exports.ContextMenuItem = ContextMenuItem;
exports.ContextMenuLabel = ContextMenuLabel;
exports.ContextMenuSeparator = ContextMenuSeparator;
exports.ContextMenuShortcut = ContextMenuShortcut;
exports.ContextMenuTrigger = ContextMenuTrigger;
exports.useContextMenu = useContextMenu;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _theme = require("../theme");
var _Text = require("./Text");
var _types = require("./types");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const ContextMenuContext = /*#__PURE__*/_react.default.createContext(null);
function useContextMenu() {
  const context = _react.default.useContext(ContextMenuContext);
  if (!context) {
    throw new Error("useContextMenu must be used within a <ContextMenu />");
  }
  return context;
}
function ContextMenu({
  children
}) {
  const {
    colors
  } = (0, _theme.useTheme)();
  const [open, setOpen] = _react.default.useState(false);
  const [triggerLayout, setTriggerLayout] = _react.default.useState({
    pageX: 0,
    pageY: 0,
    width: 0,
    height: 0
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(ContextMenuContext.Provider, {
    value: {
      open,
      setOpen,
      triggerLayout,
      setTriggerLayout,
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
function ContextMenuTrigger({
  children,
  style,
  disabled = false
}) {
  const {
    setOpen,
    setTriggerLayout
  } = useContextMenu();
  const triggerRef = _react.default.useRef(null);
  const handleLongPress = () => {
    if (!disabled) {
      triggerRef.current?.measureInWindow((x, y, width, height) => {
        if (width > 0 && height > 0) {
          setTriggerLayout({
            pageX: x,
            pageY: y,
            width,
            height
          });
          setOpen(true);
        }
      });
    }
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
    ref: triggerRef,
    onLongPress: handleLongPress,
    delayLongPress: 500 // Standard Android/iOS long press timing
    ,
    style: style,
    children: children
  });
}
function ContextMenuContent({
  children,
  style,
  overlayStyle,
  modalProps,
  width = 180
}) {
  const {
    open,
    setOpen,
    triggerLayout,
    colors
  } = useContextMenu();
  const {
    components,
    radii,
    spacing
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
  const dropdownMaxHeight = 280;
  const spaceBelow = SCREEN_HEIGHT - (triggerLayout.pageY + triggerLayout.height);
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
        left: Math.max(spacing.sm, triggerLayout.pageX),
        width,
        backgroundColor: colors.surface,
        borderWidth: components.borderWidth.strong,
        borderColor: colors.border,
        borderRadius: radii.lg,
        padding: spacing.xs,
        maxHeight: dropdownMaxHeight,
        overflow: "hidden"
      }, animatedStyle, positionStyle, style],
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.ScrollView, {
        keyboardShouldPersistTaps: "handled",
        children: children
      })
    })]
  });
}
function ContextMenuItem({
  onPress,
  children,
  variant = "default",
  disabled = false,
  style
}) {
  const {
    setOpen,
    colors
  } = useContextMenu();
  const {
    radii,
    spacing,
    typography
  } = (0, _theme.useTheme)();
  const handlePress = () => {
    if (!disabled) {
      if (onPress) onPress();
      setOpen(false);
    }
  };
  const isDestructive = variant === "destructive";
  const textColor = disabled ? colors.textMuted : isDestructive ? colors.danger : colors.text;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
    onPress: handlePress,
    disabled: disabled,
    style: ({
      pressed
    }) => [{
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radii.md,
      backgroundColor: pressed ? isDestructive ? colors.dangerSoft : colors.surfaceMuted : colors.transparent,
      opacity: disabled ? 0.5 : 1,
      justifyContent: "space-between"
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
function ContextMenuSeparator({
  style
}) {
  const {
    colors
  } = useContextMenu();
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
function ContextMenuLabel({
  children,
  style
}) {
  const {
    colors
  } = useContextMenu();
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
// Chevron checkmark for checkbox items
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
function ContextMenuCheckboxItem({
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
  } = useContextMenu();
  const {
    radii,
    spacing,
    typography
  } = (0, _theme.useTheme)();
  const handlePress = () => {
    if (!disabled) {
      if (onCheckedChange) onCheckedChange(!checked);
      setOpen(false);
    }
  };
  const textColor = disabled ? colors.textMuted : colors.text;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Pressable, {
    onPress: handlePress,
    disabled: disabled,
    style: ({
      pressed
    }) => [{
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radii.md,
      backgroundColor: pressed ? colors.surfaceMuted : colors.transparent,
      opacity: disabled ? 0.5 : 1,
      justifyContent: "space-between"
    }, style],
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
      style: {
        ...typography.bodySmall,
        color: textColor,
        flex: 1
      },
      children: children
    }), checked && (checkIcon ? (0, _types.renderIcon)(checkIcon, colors.primary, 14) : /*#__PURE__*/(0, _jsxRuntime.jsx)(CheckIcon, {
      color: colors.primary
    }))]
  });
}
function ContextMenuShortcut({
  children,
  style
}) {
  const {
    colors
  } = useContextMenu();
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
//# sourceMappingURL=ContextMenu.js.map