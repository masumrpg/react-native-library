"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Collapsible = Collapsible;
exports.CollapsibleContent = CollapsibleContent;
exports.CollapsibleTrigger = CollapsibleTrigger;
exports.useCollapsible = useCollapsible;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const CollapsibleContext = /*#__PURE__*/_react.default.createContext(null);
function useCollapsible() {
  const context = _react.default.useContext(CollapsibleContext);
  if (!context) {
    throw new Error("useCollapsible must be used within a <Collapsible />");
  }
  return context;
}
function Collapsible({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
  style,
  ...props
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = _react.default.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const toggle = _react.default.useCallback(() => {
    const nextOpen = !open;
    if (!isControlled) {
      setUncontrolledOpen(nextOpen);
    }
    if (onOpenChange) {
      onOpenChange(nextOpen);
    }
  }, [open, isControlled, onOpenChange]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(CollapsibleContext.Provider, {
    value: {
      open,
      toggle
    },
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: style,
      ...props,
      children: children
    })
  });
}
function CollapsibleTrigger({
  children,
  style,
  ...props
}) {
  const {
    toggle
  } = useCollapsible();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
    onPress: toggle,
    style: style,
    ...props,
    children: children
  });
}
function CollapsibleContent({
  children,
  style,
  ...props
}) {
  const {
    open
  } = useCollapsible();
  const [measuredHeight, setMeasuredHeight] = _react.default.useState(0);
  const heightAnim = (0, _reactNativeReanimated.useSharedValue)(open ? measuredHeight : 0);

  // Track if we have completed our first height layout measurement
  const hasMeasured = measuredHeight > 0;
  _react.default.useEffect(() => {
    if (hasMeasured) {
      heightAnim.value = (0, _reactNativeReanimated.withTiming)(open ? measuredHeight : 0, {
        duration: 220
      });
    } else {
      // Set initial value immediately without animating during initial layout
      heightAnim.value = open ? measuredHeight : 0;
    }
  }, [open, measuredHeight, hasMeasured, heightAnim]);
  const handleLayout = e => {
    const {
      height
    } = e.nativeEvent.layout;
    if (height > 0 && height !== measuredHeight) {
      setMeasuredHeight(height);
    }
  };
  const animatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    height: hasMeasured ? heightAnim.value : open ? undefined : 0,
    opacity: hasMeasured ? Math.min(1, heightAnim.value / Math.max(1, measuredHeight)) : open ? 1 : 0
  }));
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.View, {
    pointerEvents: open ? "auto" : "none",
    style: [{
      overflow: "hidden"
    }, animatedStyle, style],
    ...props,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      onLayout: handleLayout,
      style: {
        width: "100%"
      },
      children: children
    })
  });
}
//# sourceMappingURL=Collapsible.js.map