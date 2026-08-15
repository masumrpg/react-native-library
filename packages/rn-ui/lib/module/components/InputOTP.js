"use strict";

import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { useTheme } from "../theme/index.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const InputOTPContext = /*#__PURE__*/React.createContext(null);
function normalizeValue(value, maxLength) {
  return value.replace(/\s/g, "").slice(0, maxLength);
}
export function InputOTP({
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
  } = useTheme();
  const inputRef = React.useRef(null);
  const [focused, setFocused] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(() => normalizeValue(defaultValue, maxLength));
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
  const slots = React.useMemo(() => Array.from({
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
  const context = React.useMemo(() => ({
    slots,
    disabled,
    invalid,
    focused,
    focus
  }), [disabled, focused, invalid, slots]);
  return /*#__PURE__*/_jsx(InputOTPContext.Provider, {
    value: context,
    children: /*#__PURE__*/_jsxs(Pressable, {
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
      children: [children, /*#__PURE__*/_jsx(TextInput, {
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
export function InputOTPGroup({
  style,
  ...props
}) {
  const {
    radii,
    spacing
  } = useTheme();
  return /*#__PURE__*/_jsx(View, {
    style: [{
      flexDirection: "row",
      alignItems: "center",
      borderRadius: radii.lg,
      gap: spacing.xs
    }, style],
    ...props
  });
}
export function InputOTPSlot({
  index,
  style,
  ...props
}) {
  const {
    colors,
    components,
    typography,
    radii
  } = useTheme();
  const context = React.useContext(InputOTPContext);
  const slot = context?.slots[index];
  return /*#__PURE__*/_jsxs(View, {
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
    children: [/*#__PURE__*/_jsx(Text, {
      style: [typography.label, {
        color: context?.disabled ? colors.disabledText : colors.text,
        fontVariant: ["tabular-nums"]
      }],
      children: slot?.char
    }), slot?.hasFakeCaret ? /*#__PURE__*/_jsx(InputOTPCaret, {}) : null]
  });
}
function InputOTPCaret() {
  const {
    colors
  } = useTheme();
  const opacity = useSharedValue(1);
  React.useEffect(() => {
    opacity.value = withRepeat(withSequence(withTiming(0, {
      duration: 500
    }), withTiming(1, {
      duration: 500
    })), -1, true);
    return () => cancelAnimation(opacity);
  }, [opacity]);
  const caretStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }));
  return /*#__PURE__*/_jsx(Animated.View, {
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
export function InputOTPSeparator({
  style,
  children,
  ...props
}) {
  const {
    colors
  } = useTheme();
  return /*#__PURE__*/_jsx(View, {
    accessibilityRole: "none",
    style: [{
      width: 14,
      alignItems: "center",
      justifyContent: "center"
    }, style],
    ...props,
    children: children ?? /*#__PURE__*/_jsx(View, {
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