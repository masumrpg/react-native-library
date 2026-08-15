"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HoverCard = HoverCard;
exports.HoverCardContent = HoverCardContent;
exports.HoverCardTrigger = HoverCardTrigger;
exports.useHoverCard = useHoverCard;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _theme = require("../theme");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const HoverCardContext = /*#__PURE__*/_react.default.createContext(null);
function useHoverCard() {
  const context = _react.default.useContext(HoverCardContext);
  if (!context) {
    throw new Error("useHoverCard must be used within a <HoverCard />");
  }
  return context;
}
function HoverCard({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  openDelay = 10,
  closeDelay = 100,
  triggerMode = "longPress",
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
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(HoverCardContext.Provider, {
    value: {
      open,
      setOpen,
      triggerLayout,
      setTriggerLayout,
      openDelay,
      closeDelay,
      triggerMode,
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
function HoverCardTrigger({
  children,
  disabled = false,
  style
}) {
  const {
    open,
    setOpen,
    setTriggerLayout,
    openDelay,
    closeDelay,
    triggerMode
  } = useHoverCard();
  const triggerRef = _react.default.useRef(null);
  const openTimer = _react.default.useRef(null);
  const closeTimer = _react.default.useRef(null);
  _react.default.useEffect(() => {
    return () => {
      if (openTimer.current) clearTimeout(openTimer.current);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);
  const measureAndSetOpen = _react.default.useCallback(nextOpen => {
    if (disabled || triggerMode === "manual") return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      if (width > 0 && height > 0) {
        setTriggerLayout({
          pageX: x,
          pageY: y,
          width,
          height
        });
        if (openTimer.current) clearTimeout(openTimer.current);
        openTimer.current = setTimeout(() => setOpen(nextOpen), openDelay);
      }
    });
  }, [disabled, openDelay, setOpen, setTriggerLayout, triggerMode]);
  const close = _react.default.useCallback(() => {
    if (triggerMode === "manual") return;
    if (openTimer.current) clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), closeDelay);
  }, [closeDelay, setOpen, triggerMode]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
    ref: triggerRef,
    accessibilityRole: "button",
    accessibilityState: {
      expanded: open,
      disabled
    },
    disabled: disabled,
    onPress: triggerMode === "press" ? () => measureAndSetOpen(!open) : undefined,
    onLongPress: triggerMode === "longPress" ? () => measureAndSetOpen(true) : undefined,
    onPressOut: triggerMode === "longPress" ? close : undefined,
    delayLongPress: 420,
    style: style,
    children: children
  });
}
function HoverCardContent({
  children,
  align = "center",
  width = 256,
  maxHeight = 320,
  sideOffset = 4,
  style,
  overlayStyle,
  modalProps
}) {
  const {
    open,
    setOpen,
    triggerLayout,
    colors
  } = useHoverCard();
  const {
    components,
    radii,
    spacing
  } = (0, _theme.useTheme)();
  const progress = (0, _reactNativeReanimated.useSharedValue)(0);
  _react.default.useEffect(() => {
    progress.value = (0, _reactNativeReanimated.withTiming)(open ? 1 : 0, {
      duration: 100
    });
  }, [open, progress]);
  const {
    height: screenHeight,
    width: screenWidth
  } = _reactNative.Dimensions.get("window");
  const resolvedWidth = Math.min(width, screenWidth - spacing.lg * 2);
  const spaceBelow = screenHeight - (triggerLayout.pageY + triggerLayout.height);
  const renderAbove = spaceBelow < maxHeight + spacing.xl;
  const centerX = triggerLayout.pageX + triggerLayout.width / 2;
  const rawLeft = align === "start" ? triggerLayout.pageX : align === "end" ? triggerLayout.pageX + triggerLayout.width - resolvedWidth : centerX - resolvedWidth / 2;
  const left = Math.min(Math.max(spacing.lg, rawLeft), screenWidth - resolvedWidth - spacing.lg);
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
        scale: 0.95 + progress.value * 0.05
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
        width: resolvedWidth,
        maxHeight,
        borderRadius: radii.lg,
        backgroundColor: colors.surface,
        borderWidth: components.borderWidth.strong,
        borderColor: colors.border,
        padding: spacing.md,
        overflow: "hidden"
      }, positionStyle, animatedStyle, style],
      children: children
    })]
  });
}
//# sourceMappingURL=HoverCard.js.map