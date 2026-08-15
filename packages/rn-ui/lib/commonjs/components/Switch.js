"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Switch = Switch;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _theme = require("../theme");
var _types = require("./types");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function Switch({
  value,
  defaultValue = false,
  onValueChange,
  disabled = false,
  invalid = false,
  size = "md",
  tone = "primary",
  style,
  trackStyle,
  thumbStyle,
  activeIcon,
  inactiveIcon,
  thumbContent,
  activeThumbContent,
  inactiveThumbContent,
  renderThumb,
  onPress,
  onPressIn,
  onPressOut,
  accessibilityLabel,
  ...props
}) {
  const {
    colors,
    components,
    radii
  } = (0, _theme.useTheme)();
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = _react.default.useState(defaultValue);
  const checked = isControlled ? value : uncontrolledValue;
  const progress = (0, _reactNativeReanimated.useSharedValue)(checked ? 1 : 0);
  const pressed = (0, _reactNativeReanimated.useSharedValue)(0);
  _react.default.useEffect(() => {
    progress.value = (0, _reactNativeReanimated.withSpring)(checked ? 1 : 0, {
      damping: 16,
      stiffness: 240,
      mass: 0.8
    });
  }, [checked, progress]);
  const activeColor = invalid ? colors.danger : colors[tone];
  const activeSoftColor = invalid ? colors.dangerSoft : tone === "primary" ? colors.primarySoft : tone === "secondary" ? colors.secondarySoft : tone === "accent" ? colors.accentSoft : tone === "success" ? colors.successSoft : tone === "warning" ? colors.warningSoft : tone === "danger" ? colors.dangerSoft : colors.infoSoft;
  const thumbIcon = checked ? activeIcon : inactiveIcon;
  const selectedThumbContent = (checked ? activeThumbContent : inactiveThumbContent) ?? thumbContent;
  const width = components.switch.width[size];
  const height = components.switch.height[size];
  const thumbSize = components.switch.thumbSize[size];
  const iconSize = components.switch.iconSize[size];
  const borderWidth = components.borderWidth.focus;
  const inset = (height - thumbSize) / 2;
  const travel = width - thumbSize - (inset + borderWidth) * 2;
  const thumbColor = disabled ? colors.disabledText : colors.surface;
  const inactiveTrackColor = disabled ? colors.disabled : colors.backgroundMuted;
  const inactiveBorderColor = invalid ? colors.danger : colors.border;
  const handlePress = event => {
    onPress?.(event);
    if (disabled) return;
    const nextValue = !checked;
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }
    onValueChange?.(nextValue);
  };
  const handlePressIn = event => {
    onPressIn?.(event);
    pressed.value = (0, _reactNativeReanimated.withTiming)(1, {
      duration: 120
    });
  };
  const handlePressOut = event => {
    onPressOut?.(event);
    pressed.value = (0, _reactNativeReanimated.withTiming)(0, {
      duration: 140
    });
  };
  const trackAnimatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    backgroundColor: (0, _reactNativeReanimated.interpolateColor)(progress.value, [0, 1], [inactiveTrackColor, activeSoftColor]),
    borderColor: (0, _reactNativeReanimated.interpolateColor)(progress.value, [0, 1], [inactiveBorderColor, activeColor])
  }));
  const thumbAnimatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    transform: [{
      translateX: progress.value * travel
    }, {
      scale: 1 + pressed.value * 0.06
    }],
    backgroundColor: (0, _reactNativeReanimated.interpolateColor)(progress.value, [0, 1], [thumbColor, activeColor])
  }));
  const iconColor = checked ? invalid ? colors.onDanger : tone === "primary" ? colors.onPrimary : tone === "secondary" ? colors.onSecondary : tone === "accent" ? colors.onAccent : tone === "success" ? colors.onSuccess : tone === "warning" ? colors.onWarning : tone === "danger" ? colors.onDanger : colors.onInfo : colors.textSubtle;
  const thumbContentParams = {
    checked,
    disabled,
    invalid,
    color: iconColor,
    size: iconSize
  };
  const renderedThumbContent = typeof selectedThumbContent === "function" ? selectedThumbContent(thumbContentParams) : selectedThumbContent;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
    accessibilityRole: "switch",
    accessibilityLabel: accessibilityLabel,
    accessibilityState: {
      checked,
      disabled
    },
    disabled: disabled,
    onPress: handlePress,
    onPressIn: handlePressIn,
    onPressOut: handlePressOut,
    style: ({
      pressed: isPressed
    }) => [{
      opacity: disabled ? 0.56 : isPressed ? 0.9 : 1,
      alignSelf: "flex-start"
    }, style],
    ...props,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.View, {
      style: [{
        width,
        height,
        borderRadius: radii.full,
        borderWidth,
        padding: inset,
        justifyContent: "center"
      }, trackAnimatedStyle, trackStyle],
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.View, {
        style: [{
          width: thumbSize,
          height: thumbSize,
          borderRadius: radii.full,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: components.borderWidth.default,
          borderColor: checked ? activeColor : colors.borderMuted
        }, thumbAnimatedStyle, thumbStyle],
        children: renderThumb ? renderThumb(thumbContentParams) : renderedThumbContent ? renderedThumbContent : thumbIcon ? (0, _types.renderIcon)(thumbIcon, iconColor, iconSize) : null
      })
    })
  });
}
//# sourceMappingURL=Switch.js.map