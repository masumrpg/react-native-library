"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InputOTP = InputOTP;
exports.InputOTPContext = void 0;
exports.InputOTPGroup = InputOTPGroup;
exports.InputOTPSeparator = InputOTPSeparator;
exports.InputOTPSlot = InputOTPSlot;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _theme = require("../theme");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const InputOTPContext = exports.InputOTPContext = /*#__PURE__*/_react.default.createContext(null);
function normalizeValue(value, maxLength) {
  return value.replace(/\s/g, "").slice(0, maxLength);
}
function InputOTP({
  children,
  value,
  defaultValue = "",
  onChangeText,
  maxLength = 6,
  disabled = false,
  invalid = false,
  autoFocus,
  textInputProps,
  style,
  onPress,
  ...props
}) {
  const {
    colors
  } = (0, _theme.useTheme)();
  const inputRef = _react.default.useRef(null);
  const [focused, setFocused] = _react.default.useState(false);
  const [internalValue, setInternalValue] = _react.default.useState(() => normalizeValue(defaultValue, maxLength));
  const currentValue = normalizeValue(value ?? internalValue, maxLength);
  const activeIndex = Math.min(currentValue.length, maxLength - 1);
  const handleChangeText = nextValue => {
    const normalized = normalizeValue(nextValue, maxLength);
    if (value === undefined) {
      setInternalValue(normalized);
    }
    onChangeText?.(normalized);
  };
  const focus = () => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  };
  const slots = _react.default.useMemo(() => Array.from({
    length: maxLength
  }, (_, index) => {
    const char = currentValue[index] ?? "";
    const isActive = focused && index === activeIndex;
    return {
      char,
      isActive,
      hasFakeCaret: isActive && !char
    };
  }), [activeIndex, currentValue, focused, maxLength]);
  const context = _react.default.useMemo(() => ({
    slots,
    disabled,
    invalid,
    focused,
    focus
  }), [disabled, focused, invalid, slots]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(InputOTPContext.Provider, {
    value: context,
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Pressable, {
      accessibilityRole: "text",
      accessibilityState: {
        disabled
      },
      disabled: disabled,
      onPress: event => {
        focus();
        onPress?.(event);
      },
      style: [{
        opacity: disabled ? 0.5 : 1
      }, style],
      ...props,
      children: [children, /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.TextInput, {
        ref: inputRef,
        value: currentValue,
        maxLength: maxLength,
        editable: !disabled,
        autoFocus: autoFocus,
        keyboardType: "number-pad",
        textContentType: "oneTimeCode",
        autoComplete: "one-time-code",
        caretHidden: true,
        spellCheck: false,
        onChangeText: handleChangeText,
        onFocus: event => {
          setFocused(true);
          textInputProps?.onFocus?.(event);
        },
        onBlur: event => {
          setFocused(false);
          textInputProps?.onBlur?.(event);
        },
        style: [{
          position: "absolute",
          width: 1,
          height: 1,
          opacity: 0,
          color: colors.transparent
        }, textInputProps?.style],
        ...textInputProps
      })]
    })
  });
}
function InputOTPGroup({
  style,
  ...props
}) {
  const {
    radii,
    spacing
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      flexDirection: "row",
      alignItems: "center",
      borderRadius: radii.lg,
      gap: spacing.xs
    }, style],
    ...props
  });
}
function InputOTPSlot({
  index,
  style,
  ...props
}) {
  const {
    colors,
    components,
    typography,
    radii
  } = (0, _theme.useTheme)();
  const context = _react.default.useContext(InputOTPContext);
  const slot = context?.slots[index];
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
    accessibilityState: {
      selected: slot?.isActive
    },
    style: [{
      position: "relative",
      width: 38,
      height: 42,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: slot?.isActive || context?.invalid ? components.borderWidth.focus : components.borderWidth.strong,
      borderColor: context?.invalid ? colors.danger : slot?.isActive ? colors.primary : colors.border,
      borderRadius: radii.lg,
      backgroundColor: colors.input
    }, style],
    ...props,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
      style: [typography.label, {
        color: context?.disabled ? colors.disabledText : colors.text,
        fontVariant: ["tabular-nums"]
      }],
      children: slot?.char
    }), slot?.hasFakeCaret ? /*#__PURE__*/(0, _jsxRuntime.jsx)(InputOTPCaret, {}) : null]
  });
}
function InputOTPCaret() {
  const {
    colors
  } = (0, _theme.useTheme)();
  const opacity = (0, _reactNativeReanimated.useSharedValue)(1);
  _react.default.useEffect(() => {
    opacity.value = (0, _reactNativeReanimated.withRepeat)((0, _reactNativeReanimated.withSequence)((0, _reactNativeReanimated.withTiming)(0, {
      duration: 500
    }), (0, _reactNativeReanimated.withTiming)(1, {
      duration: 500
    })), -1, true);
    return () => (0, _reactNativeReanimated.cancelAnimation)(opacity);
  }, [opacity]);
  const caretStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    opacity: opacity.value
  }));
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.View, {
    pointerEvents: "none",
    style: [{
      position: "absolute",
      width: 1.25,
      height: 18,
      borderRadius: 1,
      backgroundColor: colors.text
    }, caretStyle]
  });
}
function InputOTPSeparator({
  style,
  children,
  ...props
}) {
  const {
    colors
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    accessibilityRole: "none",
    style: [{
      width: 14,
      alignItems: "center",
      justifyContent: "center"
    }, style],
    ...props,
    children: children ?? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: {
        width: 10,
        height: 1.5,
        borderRadius: 1,
        backgroundColor: colors.textMuted
      }
    })
  });
}
//# sourceMappingURL=InputOTP.js.map