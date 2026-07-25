import React from "react";
import {
  Animated,
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

import { useTheme } from "../theme";

export interface InputOTPSlotState {
  char: string;
  hasFakeCaret: boolean;
  isActive: boolean;
}

export interface InputOTPContextValue {
  slots: InputOTPSlotState[];
  disabled: boolean;
  invalid: boolean;
  focused: boolean;
  focus: () => void;
}

export const InputOTPContext = React.createContext<InputOTPContextValue | null>(
  null,
);

export interface InputOTPProps extends Omit<
  PressableProps,
  "children" | "style"
> {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onChangeText?: (value: string) => void;
  maxLength?: number;
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
  disabled = false,
  invalid = false,
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
      disabled,
      invalid,
      focused,
      focus,
    }),
    [disabled, focused, invalid, slots],
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
          borderRadius: radii.lg,
          gap: spacing.xs,
        },
        style,
      ]}
      {...props}
    />
  );
}

export interface InputOTPSlotProps extends ViewProps {
  index: number;
  style?: StyleProp<ViewStyle>;
}

export function InputOTPSlot({ index, style, ...props }: InputOTPSlotProps) {
  const { colors, components, typography, radii } = useTheme();
  const context = React.useContext(InputOTPContext);
  const slot = context?.slots[index];

  return (
    <View
      accessibilityState={{ selected: slot?.isActive }}
      style={[
        {
          position: "relative",
          width: 38,
          height: 42,
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
              : colors.border,
          borderRadius: radii.lg,
          backgroundColor: colors.input,
        },
        style,
      ]}
      {...props}
    >
      <Text
        style={[
          typography.label,
          {
            color: context?.disabled ? colors.disabledText : colors.text,
            fontVariant: ["tabular-nums"],
          },
        ]}
      >
        {slot?.char}
      </Text>
      {slot?.hasFakeCaret ? <InputOTPCaret /> : null}
    </View>
  );
}

function InputOTPCaret() {
  const { colors } = useTheme();
  const opacity = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        width: 1.25,
        height: 18,
        borderRadius: 1,
        backgroundColor: colors.text,
        opacity,
      }}
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
            height: 1.5,
            borderRadius: 1,
            backgroundColor: colors.textMuted,
          }}
        />
      )}
    </View>
  );
}
