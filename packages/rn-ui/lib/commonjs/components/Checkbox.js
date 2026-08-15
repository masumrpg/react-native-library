"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Checkbox = Checkbox;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _theme = require("../theme");
var _types = require("./types");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Pure SVG/Vector checkmark to avoid external dependencies
function CheckIcon({
  color
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: {
      width: 10,
      height: 6,
      borderLeftWidth: 1.8,
      borderBottomWidth: 1.8,
      borderColor: color,
      transform: [{
        rotate: "-45deg"
      }],
      marginTop: -2
    }
  });
}
function Checkbox({
  checked = false,
  onCheckedChange,
  disabled = false,
  invalid = false,
  style,
  icon,
  ...props
}) {
  const {
    colors,
    components
  } = (0, _theme.useTheme)();
  const progress = (0, _reactNativeReanimated.useSharedValue)(checked ? 1 : 0);
  _react.default.useEffect(() => {
    progress.value = (0, _reactNativeReanimated.withSpring)(checked ? 1 : 0, {
      damping: 14,
      stiffness: 220
    });
  }, [checked, progress]);
  const handlePress = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };
  const borderColor = invalid ? colors.danger : checked ? colors.primary : colors.border;
  const overlayStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    opacity: progress.value,
    transform: [{
      scale: 0.65 + progress.value * 0.35
    }]
  }));
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
    accessibilityRole: "checkbox",
    accessibilityState: {
      checked,
      disabled
    },
    onPress: handlePress,
    disabled: disabled,
    style: ({
      pressed
    }) => [{
      width: 18,
      height: 18,
      borderRadius: 4,
      borderWidth: components.borderWidth.focus,
      borderColor,
      backgroundColor: colors.transparent,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      opacity: disabled ? 0.5 : pressed ? 0.82 : 1
    }, style],
    ...props,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.View, {
      style: [{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: invalid ? colors.danger : colors.primary,
        justifyContent: "center",
        alignItems: "center"
      }, overlayStyle],
      children: icon ? (0, _types.renderIcon)(icon, colors.onPrimary, 12) : /*#__PURE__*/(0, _jsxRuntime.jsx)(CheckIcon, {
        color: colors.onPrimary
      })
    })
  });
}
//# sourceMappingURL=Checkbox.js.map