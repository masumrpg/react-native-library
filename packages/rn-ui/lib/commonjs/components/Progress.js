"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Progress = Progress;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _theme = require("../theme");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function Progress({
  value = 0,
  max = 100,
  animated = true,
  style,
  indicatorStyle,
  ...props
}) {
  const {
    colors,
    radii
  } = (0, _theme.useTheme)();
  const progress = Math.max(0, Math.min(1, max <= 0 ? 0 : value / max));
  const width = (0, _reactNativeReanimated.useSharedValue)(progress);
  _react.default.useEffect(() => {
    if (!animated) {
      width.value = progress;
      return;
    }
    width.value = (0, _reactNativeReanimated.withTiming)(progress, {
      duration: 180
    });
  }, [animated, progress, width]);
  const indicatorAnimatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    width: `${width.value * 100}%`
  }));
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    accessibilityRole: "progressbar",
    accessibilityValue: {
      min: 0,
      max,
      now: value
    },
    style: [{
      width: "100%",
      height: 10,
      borderRadius: radii.full,
      overflow: "hidden",
      backgroundColor: colors.backgroundSubtle
    }, style],
    ...props,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.View, {
      style: [{
        height: "100%",
        borderRadius: radii.full,
        backgroundColor: colors.primary
      }, indicatorAnimatedStyle, indicatorStyle]
    })
  });
}
//# sourceMappingURL=Progress.js.map