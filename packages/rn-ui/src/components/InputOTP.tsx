import React from "react";
import {
  Pressable,
  Text,
  TextInput,
  View,
  type PressableProps,
  type StyleProp,
  type TextInputProps,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "../theme";
import type { BaseGlassProps } from "./types";

export type InputOTPSize = "sm" | "md" | "lg";

export interface InputOTPSlotState {
  char: string;
  hasFakeCaret: boolean;
  isActive: boolean;
}

export interface InputOTPContextValue {
  slots: InputOTPSlotState[];
  size: InputOTPSize;
  disabled: boolean;
  invalid: boolean;
  focused: boolean;
  focus: () => void;
}

export const InputOTPContext = React.createContext<InputOTPContextValue | null>(
  null,
);

export interface InputOTPProps
  extends Omit<PressableProps, "children" | "style">,
    BaseGlassProps {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onChangeText?: (value: string) => void;
  maxLength?: number;
  size?: InputOTPSize;
  disabled?: boolean;
  invalid?: boolean;
  autoFocus?: boolean;
  textInputProps?: Omit<
    TextInputProps,
    "value" | "defaultValue" | "onChangeText" | "maxLength" | "editable"
  >;
  style?: StyleProp<ViewStyle>;
}

function normalizeValue(value: string, maxLength: number) {
  return value.replace(/\s/g, "").slice(0, maxLength);
}

export function InputOTP({
  children,
  value,
  defaultValue = "",
  onChangeText,
  maxLength = 6,
  size = "md",
  disabled = false,
  invalid = false,
  glass = false,
  autoFocus,
  textInputProps,
  style,
  onPress,
  ...props
}: InputOTPProps) {
  const { colors } = useTheme();
  const inputRef = React.useRef<TextInput>(null);
  const [focused, setFocused] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(() =>
    normalizeValue(defaultValue, maxLength),
  );
  const currentValue = normalizeValue(value ?? internalValue, maxLength);
  const activeIndex = Math.min(currentValue.length, maxLength - 1);

  const handleChangeText = (nextValue: string) => {
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

  const slots = React.useMemo<InputOTPSlotState[]>(
    () =>
      Array.from({ length: maxLength }, (_, index) => {
        const char = currentValue[index] ?? "";
        const isActive = focused && index === activeIndex;

        return {
          char,
          isActive,
          hasFakeCaret: isActive && !char,
        };
      }),
    [activeIndex, currentValue, focused, maxLength],
  );

  const context = React.useMemo<InputOTPContextValue>(
    () => ({
      slots,
      size,
      disabled,
      invalid,
      focused,
      focus,
    }),
    [disabled, focused, invalid, size, slots],
  );

  return (
    <InputOTPContext.Provider value={context}>
      <Pressable
        accessibilityRole="text"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={(event) => {
          focus();
          onPress?.(event);
        }}
        style={[
          {
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
            opacity: disabled ? 0.5 : 1,
          },
          style,
        ]}
        {...props}
      >
        {children}
        <TextInput
          ref={inputRef}
          value={currentValue}
          maxLength={maxLength}
          editable={!disabled}
          autoFocus={autoFocus}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
          caretHidden
          spellCheck={false}
          onChangeText={handleChangeText}
          onFocus={(event) => {
            setFocused(true);
            textInputProps?.onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            textInputProps?.onBlur?.(event);
          }}
          style={[
            {
              position: "absolute",
              width: 1,
              height: 1,
              opacity: 0,
              color: colors.transparent,
            },
            textInputProps?.style,
          ]}
          {...textInputProps}
        />
      </Pressable>
    </InputOTPContext.Provider>
  );
}

export interface InputOTPGroupProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export function InputOTPGroup({ style, ...props }: InputOTPGroupProps) {
  const { radii, spacing } = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: radii.lg,
          gap: spacing.sm,
        },
        style,
      ]}
      {...props}
    />
  );
}

export interface InputOTPSlotProps extends ViewProps, BaseGlassProps {
  index: number;
  size?: InputOTPSize;
  style?: StyleProp<ViewStyle>;
}

const slotDimensions: Record<
  InputOTPSize,
  { width: number; height: number; fontSize: number }
> = {
  sm: { width: 38, height: 44, fontSize: 16 },
  md: { width: 48, height: 54, fontSize: 20 },
  lg: { width: 56, height: 64, fontSize: 24 },
};

export function InputOTPSlot({
  index,
  size,
  glass = false,
  style,
  ...props
}: InputOTPSlotProps) {
  const { colors, components, radii, isDark } = useTheme();
  const context = React.useContext(InputOTPContext);
  const slot = context?.slots[index];
  const effectiveSize = size ?? context?.size ?? "md";
  const dims = slotDimensions[effectiveSize];

  const glassBg = isDark
    ? "rgba(15, 27, 45, 0.60)"
    : "rgba(255, 255, 255, 0.75)";

  return (
    <View
      accessibilityState={{ selected: slot?.isActive }}
      style={[
        {
          position: "relative",
          width: dims.width,
          height: dims.height,
          alignItems: "center",
          justifyContent: "center",
          borderWidth:
            slot?.isActive || context?.invalid
              ? components.borderWidth.focus
              : components.borderWidth.strong,
          borderColor: context?.invalid
            ? colors.danger
            : slot?.isActive
              ? colors.primary
              : glass
                ? isDark
                  ? "rgba(248, 250, 252, 0.20)"
                  : "rgba(15, 23, 42, 0.14)"
                : colors.border,
          borderRadius: radii.xl,
          backgroundColor: glass ? glassBg : colors.input,
        },
        style,
      ]}
      {...props}
    >
      <Text
        style={{
          fontSize: dims.fontSize,
          fontWeight: "700",
          color: context?.disabled ? colors.disabledText : colors.text,
          fontVariant: ["tabular-nums"],
        }}
      >
        {slot?.char}
      </Text>
      {slot?.hasFakeCaret ? <InputOTPCaret /> : null}
    </View>
  );
}

function InputOTPCaret() {
  const { colors } = useTheme();
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 500 }),
        withTiming(1, { duration: 500 }),
      ),
      -1,
      true,
    );
    return () => cancelAnimation(opacity);
  }, [opacity]);

  const caretStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          width: 2,
          height: 22,
          borderRadius: 1,
          backgroundColor: colors.primary,
        },
        caretStyle,
      ]}
    />
  );
}

export interface InputOTPSeparatorProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export function InputOTPSeparator({
  style,
  children,
  ...props
}: InputOTPSeparatorProps) {
  const { colors } = useTheme();

  return (
    <View
      accessibilityRole="none"
      style={[
        {
          width: 14,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
      {...props}
    >
      {children ?? (
        <View
          style={{
            width: 10,
            height: 2,
            borderRadius: 1,
            backgroundColor: colors.textMuted,
          }}
        />
      )}
    </View>
  );
}
