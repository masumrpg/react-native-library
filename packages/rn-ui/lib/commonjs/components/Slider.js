"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Slider = Slider;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _theme = require("../theme");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function clamp(value, min, max) {
  "worklet";

  return Math.min(max, Math.max(min, value));
}
function snap(value, step, min) {
  "worklet";

  if (step <= 0) return value;
  return Math.round((value - min) / step) * step + min;
}
function getToneColor(colors, tone) {
  return colors[tone];
}
function Slider({
  value,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  tone = "primary",
  onValueChange,
  onSlidingStart,
  onSlidingComplete,
  style,
  trackStyle,
  activeTrackStyle,
  thumbStyle,
  onLayout,
  ...props
}) {
  const {
    colors,
    components,
    radii
  } = (0, _theme.useTheme)();
  const [internalValue, setInternalValue] = _react.default.useState(defaultValue);
  const currentValue = clamp(value ?? internalValue, min, max);
  const range = max - min;
  const initialProgress = range === 0 ? 0 : (currentValue - min) / range;
  const progress = (0, _reactNativeReanimated.useSharedValue)(initialProgress);
  const trackWidth = (0, _reactNativeReanimated.useSharedValue)(0);
  const isPressed = (0, _reactNativeReanimated.useSharedValue)(0);
  const lastEmittedValue = (0, _reactNativeReanimated.useSharedValue)(currentValue);
  const isInteractingRef = _react.default.useRef(false);
  const isControlled = value !== undefined;
  const activeColor = getToneColor(colors, tone);
  const thumbSize = components.slider.thumbSize;
  const activeThumbSize = components.slider.activeThumbSize;
  const thumbTravelInset = activeThumbSize / 2;
  _react.default.useEffect(() => {
    if (isInteractingRef.current) return;
    const nextProgress = range === 0 ? 0 : (currentValue - min) / range;
    lastEmittedValue.value = currentValue;
    progress.value = (0, _reactNativeReanimated.withSpring)(clamp(nextProgress, 0, 1), {
      damping: 18,
      stiffness: 260,
      mass: 0.85
    });
  }, [currentValue, lastEmittedValue, min, progress, range]);
  const setInteractionActive = _react.default.useCallback(active => {
    isInteractingRef.current = active;
  }, []);
  const commitValue = _react.default.useCallback((nextValue, complete, start = false) => {
    const next = clamp(nextValue, min, max);
    if (!isControlled) {
      setInternalValue(next);
    }
    if (start) {
      onSlidingStart?.(next);
    }
    onValueChange?.(next);
    if (complete) {
      onSlidingComplete?.(next);
    }
  }, [isControlled, max, min, onSlidingComplete, onSlidingStart, onValueChange]);
  const handleLayout = _react.default.useCallback(event => {
    trackWidth.value = event.nativeEvent.layout.width;
    onLayout?.(event);
  }, [onLayout, trackWidth]);
  const gesture = _react.default.useMemo(() => _reactNativeGestureHandler.Gesture.Pan().enabled(!disabled).minDistance(0).hitSlop(components.slider.hitSlop).onBegin(event => {
    const width = trackWidth.value;
    if (width <= 0) return;
    const nextProgress = Math.min(1, Math.max(0, event.x / width));
    const rawValue = min + nextProgress * range;
    const nextValue = clamp(snap(rawValue, step, min), min, max);
    lastEmittedValue.value = nextValue;
    progress.value = (0, _reactNativeReanimated.withTiming)(nextProgress, {
      duration: 110
    });
    isPressed.value = (0, _reactNativeReanimated.withSpring)(1, {
      damping: 16,
      stiffness: 260
    });
    (0, _reactNativeReanimated.runOnJS)(setInteractionActive)(true);
    (0, _reactNativeReanimated.runOnJS)(commitValue)(nextValue, false, true);
  }).onUpdate(event => {
    const width = trackWidth.value;
    if (width <= 0) return;
    const nextProgress = Math.min(1, Math.max(0, event.x / width));
    const rawValue = min + nextProgress * range;
    const nextValue = clamp(snap(rawValue, step, min), min, max);
    progress.value = nextProgress;
    if (nextValue !== lastEmittedValue.value) {
      lastEmittedValue.value = nextValue;
      (0, _reactNativeReanimated.runOnJS)(commitValue)(nextValue, false, false);
    }
  }).onFinalize(event => {
    const width = trackWidth.value;
    if (width > 0) {
      const nextProgress = Math.min(1, Math.max(0, event.x / width));
      const rawValue = min + nextProgress * range;
      const nextValue = clamp(snap(rawValue, step, min), min, max);
      const snappedProgress = range === 0 ? 0 : (nextValue - min) / range;
      progress.value = (0, _reactNativeReanimated.withSpring)(snappedProgress, {
        damping: 18,
        stiffness: 260,
        mass: 0.85
      });
      lastEmittedValue.value = nextValue;
      (0, _reactNativeReanimated.runOnJS)(setInteractionActive)(false);
      (0, _reactNativeReanimated.runOnJS)(commitValue)(nextValue, true, false);
    } else {
      (0, _reactNativeReanimated.runOnJS)(setInteractionActive)(false);
    }
    isPressed.value = (0, _reactNativeReanimated.withSpring)(0, {
      damping: 16,
      stiffness: 260
    });
  }), [commitValue, components.slider.hitSlop, disabled, isPressed, lastEmittedValue, max, min, progress, range, setInteractionActive, step, trackWidth]);
  const activeTrackAnimatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    width: Math.max(0, progress.value * trackWidth.value),
    backgroundColor: activeColor
  }));
  const thumbAnimatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    const size = thumbSize + (activeThumbSize - thumbSize) * Math.min(isPressed.value, 1);
    const travel = Math.max(0, trackWidth.value - thumbTravelInset * 2);
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      transform: [{
        translateX: thumbTravelInset + progress.value * travel - size / 2
      }, {
        scale: 1 + isPressed.value * 0.02
      }]
    };
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeGestureHandler.GestureDetector, {
    gesture: gesture,
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNativeReanimated.default.View, {
      accessibilityRole: "adjustable",
      accessibilityValue: {
        min,
        max,
        now: currentValue
      },
      onLayout: handleLayout,
      style: [{
        width: "100%",
        height: components.slider.height,
        justifyContent: "center",
        opacity: disabled ? 0.5 : 1
      }, style],
      ...props,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
        pointerEvents: "none",
        style: [{
          height: components.slider.trackHeight,
          borderRadius: radii.full,
          borderWidth: components.borderWidth.strong,
          borderColor: colors.border,
          backgroundColor: colors.backgroundSubtle,
          overflow: "hidden"
        }, trackStyle],
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.View, {
          style: [{
            height: "100%",
            borderRadius: radii.full
          }, activeTrackAnimatedStyle, activeTrackStyle]
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.View, {
        pointerEvents: "none",
        style: [{
          position: "absolute",
          borderWidth: components.borderWidth.ring,
          borderColor: activeColor,
          backgroundColor: colors.surface
        }, thumbAnimatedStyle, thumbStyle]
      })]
    })
  });
}
//# sourceMappingURL=Slider.js.map