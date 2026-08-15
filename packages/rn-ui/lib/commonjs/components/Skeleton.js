"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Skeleton = Skeleton;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _theme = require("../theme");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function Skeleton({
  animated = true,
  radius = "md",
  style,
  ...props
}) {
  const {
    colors,
    radii
  } = (0, _theme.useTheme)();
  const opacity = (0, _reactNativeReanimated.useSharedValue)(animated ? 0.55 : 1);
  _react.default.useEffect(() => {
    if (!animated) {
      (0, _reactNativeReanimated.cancelAnimation)(opacity);
      opacity.value = 1;
      return;
    }
    opacity.value = (0, _reactNativeReanimated.withRepeat)((0, _reactNativeReanimated.withSequence)((0, _reactNativeReanimated.withTiming)(1, {
      duration: 700
    }), (0, _reactNativeReanimated.withTiming)(0.55, {
      duration: 700
    })), -1, true);
    return () => (0, _reactNativeReanimated.cancelAnimation)(opacity);
  }, [animated, opacity]);
  const animatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    opacity: opacity.value
  }));
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.View, {
    style: animatedStyle,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: [{
        backgroundColor: colors.backgroundSubtle,
        borderRadius: radii[radius]
      }, style],
      ...props
    })
  });
}
//# sourceMappingURL=Skeleton.js.map