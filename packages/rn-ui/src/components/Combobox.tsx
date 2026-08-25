import React from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  type ModalProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useTheme, type ThemeColors } from "../theme";
import { withAlpha } from "../utils";
import { triggerHaptic } from "../utils/haptics";
import { Text } from "./Text";
import {
  renderIcon,
  type RenderIcon,
  type BaseGlassProps,
  type BaseHapticProps,
  type SizeProps,
  type VariantProps,
} from "./types";

export type ComboboxVariant = "outline" | "filled" | "soft";
export type ComboboxSize = "sm" | "md" | "lg";

export interface ComboboxProps extends BaseGlassProps, BaseHapticProps {
  value?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export interface ComboboxContextProps {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  inputValue: string;
  setInputValue: (val: string) => void;
  triggerRef: React.RefObject<View | null>;
  triggerLayout: {
    pageX: number;
    pageY: number;
    width: number;
    height: number;
  };
  measureTrigger: (callback?: () => void) => void;
  glass: boolean;
  haptic: boolean;
  colors: ThemeColors;
}

const ComboboxContext = React.createContext<ComboboxContextProps | null>(null);

export function useCombobox() {
  const context = React.useContext(ComboboxContext);
  if (!context) {
    throw new Error("useCombobox must be used within a <Combobox />");
  }
  return context;
}

export function Combobox({
  value: controlledValue,
  onValueChange,
  open: controlledOpen,
  onOpenChange,
  glass = false,
  haptic = true,
  children,
}: ComboboxProps) {
  const { colors } = useTheme();

  const [uncontrolledValue, setUncontrolledValue] = React.useState("");
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [triggerLayout, setTriggerLayout] = React.useState({
    pageX: 0,
    pageY: 0,
    width: 0,
    height: 0,
  });

  const triggerRef = React.useRef<View | null>(null);

  const value =
    controlledValue !== undefined ? controlledValue : uncontrolledValue;
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (controlledOpen === undefined) {
        setUncontrolledOpen(nextOpen);
      }
      if (onOpenChange) {
        onOpenChange(nextOpen);
      }
    },
    [controlledOpen, onOpenChange],
  );

  const handleValueChange = React.useCallback(
    (nextVal: string) => {
      if (controlledValue === undefined) {
        setUncontrolledValue(nextVal);
      }
      if (onValueChange) {
        onValueChange(nextVal);
      }
    },
    [controlledValue, onValueChange],
  );

  const measureTrigger = React.useCallback((callback?: () => void) => {
    triggerRef.current?.measureInWindow(
      (x: number, y: number, width: number, height: number) => {
        if (width > 0 && height > 0) {
          setTriggerLayout({ pageX: x, pageY: y, width, height });
          callback?.();
        }
      },
    );
  }, []);

  return (
    <ComboboxContext.Provider
      value={{
        value,
        onValueChange: handleValueChange,
        open,
        setOpen,
        inputValue,
        setInputValue,
        triggerRef,
        triggerLayout,
        measureTrigger,
        glass,
        haptic,
        colors,
      }}
    >
      <View style={{ width: "100%" }}>{children}</View>
    </ComboboxContext.Provider>
  );
}

function ChevronDownIcon({ color }: { color: string }) {
  return (
    <View
      style={{
        width: 8,
        height: 8,
        borderRightWidth: 1.5,
        borderBottomWidth: 1.5,
        borderColor: color,
        transform: [{ rotate: "45deg" }],
        marginTop: -3,
      }}
    />
  );
}

function ClearIcon({ color }: { color: string }) {
  return (
    <Text style={{ color, fontSize: 14, fontWeight: "600", lineHeight: 14 }}>
      ✕
    </Text>
  );
}

export interface ComboboxInputProps
  extends BaseGlassProps,
    BaseHapticProps,
    VariantProps<ComboboxVariant>,
    SizeProps<ComboboxSize> {
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  chevronIcon?: RenderIcon;
  searchIcon?: RenderIcon;
}

const comboboxHeights: Record<ComboboxSize, number> = {
  sm: 36,
  md: 44,
  lg: 52,
};

export function ComboboxInput({
  placeholder = "Select option...",
  size = "md",
  variant = "outline",
  glass = false,
  haptic = true,
  style,
  inputStyle,
  disabled = false,
  chevronIcon,
  searchIcon,
}: ComboboxInputProps) {
  const {
    inputValue,
    setInputValue,
    open,
    setOpen,
    triggerRef,
    measureTrigger,
    colors,
  } = useCombobox();
  const { components, radii, spacing, typography, isDark } = useTheme();

  const handleFocus = () => {
    if (!disabled) {
      if (haptic) triggerHaptic("light");
      measureTrigger(() => setOpen(true));
    }
  };

  const handlePress = () => {
    if (!disabled) {
      if (haptic) triggerHaptic("light");
      measureTrigger(() => setOpen(!open));
    }
  };

  const handleClear = () => {
    if (haptic) triggerHaptic("light");
    setInputValue("");
  };

  const glassBg = isDark
    ? "rgba(15, 27, 45, 0.70)"
    : "rgba(255, 255, 255, 0.85)";

  const triggerBg = disabled
    ? withAlpha(colors.input, 0.55)
    : glass
      ? glassBg
      : variant === "filled"
        ? colors.surface
        : variant === "soft"
          ? withAlpha(colors.primary, 0.08)
          : colors.input;

  const borderColor = disabled
    ? colors.border
    : open
      ? colors.primary
      : glass
        ? isDark
          ? "rgba(248, 250, 252, 0.20)"
          : "rgba(15, 23, 42, 0.14)"
        : colors.border;

  const containerHeight = comboboxHeights[size];

  return (
    <Pressable
      ref={triggerRef}
      onPress={handlePress}
      disabled={disabled}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          height: containerHeight,
          borderWidth: open
            ? components.borderWidth.focus
            : components.borderWidth.strong,
          borderColor,
          borderRadius: radii.lg,
          backgroundColor: triggerBg,
          paddingHorizontal: spacing.md,
          width: "100%",
          gap: spacing.sm,
          opacity: disabled ? 0.56 : 1,
        },
        style,
      ]}
    >
      {searchIcon ? renderIcon(searchIcon, colors.textMuted, 16) : null}

      <TextInput
        editable={!disabled}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        value={inputValue}
        onChangeText={(val) => {
          setInputValue(val);
          if (!open) setOpen(true);
        }}
        onFocus={handleFocus}
        pointerEvents={disabled ? "none" : "auto"}
        style={[
          {
            flex: 1,
            ...typography.body,
            fontSize: size === "sm" ? 13 : 15,
            color: colors.text,
            padding: 0,
            height: "100%",
          },
          inputStyle,
        ]}
      />

      {!!inputValue && (
        <Pressable onPress={handleClear} hitSlop={8}>
          <ClearIcon color={colors.textMuted} />
        </Pressable>
      )}

      {chevronIcon ? (
        renderIcon(chevronIcon, colors.textMuted, 16)
      ) : (
        <ChevronDownIcon color={colors.textMuted} />
      )}
    </Pressable>
  );
}

export interface ComboboxContentProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  overlayStyle?: StyleProp<ViewStyle>;
  modalProps?: Omit<
    ModalProps,
    "visible" | "transparent" | "animationType" | "onRequestClose"
  >;
}

export function ComboboxContent({
  children,
  style,
  overlayStyle,
  modalProps,
}: ComboboxContentProps) {
  const { open, setOpen, triggerLayout, colors, glass } = useCombobox();
  const { components, radii, spacing, isDark } = useTheme();
  const progress = useSharedValue(open ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(open ? 1 : 0, { duration: 150 });
  }, [open, progress]);

  const { height: SCREEN_HEIGHT } = Dimensions.get("window");
  const spaceBelow =
    SCREEN_HEIGHT - (triggerLayout.pageY + triggerLayout.height);
  const dropdownMaxHeight = 240;
  const renderAbove = spaceBelow < dropdownMaxHeight + 40;

  const positionStyle = renderAbove
    ? { bottom: SCREEN_HEIGHT - triggerLayout.pageY + 6 }
    : { top: triggerLayout.pageY + triggerLayout.height + 4 };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (renderAbove ? 6 : -6) * (1 - progress.value) }],
  }));

  const glassBg = isDark
    ? "rgba(15, 27, 45, 0.70)"
    : "rgba(255, 255, 255, 0.85)";

  if (!open || triggerLayout.width === 0) return null;

  return (
    <Modal
      transparent
      visible={open}
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      hardwareAccelerated
      onRequestClose={() => setOpen(false)}
      {...modalProps}
    >
      <Pressable
        style={[StyleSheet.absoluteFill, overlayStyle]}
        onPress={() => setOpen(false)}
      />

      <Animated.View
        style={[
          {
            position: "absolute",
            left: triggerLayout.pageX,
            width: triggerLayout.width,
            backgroundColor: glass ? glassBg : colors.surface,
            borderWidth: components.borderWidth.strong,
            borderColor: glass
              ? isDark
                ? "rgba(248, 250, 252, 0.20)"
                : "rgba(15, 23, 42, 0.14)"
              : colors.border,
            borderRadius: radii.xl,
            maxHeight: dropdownMaxHeight,
            padding: spacing.xs,
            overflow: "hidden",
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 12,
          },
          animatedStyle,
          positionStyle,
          style,
        ]}
      >
        {children}
      </Animated.View>
    </Modal>
  );
}

export interface ComboboxListProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ComboboxList({ children, style }: ComboboxListProps) {
  return (
    <ScrollView
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
      style={[{ flex: 1 }, style]}
    >
      <View style={{ gap: 2 }}>{children}</View>
    </ScrollView>
  );
}

export interface ComboboxItemProps {
  value: string;
  label: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  checkIcon?: RenderIcon;
}

function CheckIcon({ color }: { color: string }) {
  return (
    <View
      style={{
        width: 8,
        height: 5,
        borderLeftWidth: 1.75,
        borderBottomWidth: 1.75,
        borderColor: color,
        transform: [{ rotate: "-45deg" }],
        marginRight: 4,
      }}
    />
  );
}

export function ComboboxItem({
  value,
  label,
  children,
  style,
  checkIcon,
}: ComboboxItemProps) {
  const {
    value: selectedValue,
    onValueChange,
    setOpen,
    inputValue,
    setInputValue,
    haptic,
    colors,
  } = useCombobox();
  const { radii, spacing, typography } = useTheme();

  if (inputValue && !label.toLowerCase().includes(inputValue.toLowerCase())) {
    return null;
  }

  const isSelected = selectedValue === value;

  const handlePress = () => {
    if (haptic) triggerHaptic("selection");
    onValueChange(value);
    setInputValue(label);
    setOpen(false);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        {
          minHeight: 40,
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.md,
          borderRadius: radii.lg,
          backgroundColor: isSelected
            ? colors.primarySoft
            : pressed
              ? colors.backgroundMuted
              : colors.transparent,
          justifyContent: "space-between",
        },
        style,
      ]}
    >
      <Text
        style={{
          ...typography.body,
          color: isSelected ? colors.primary : colors.text,
          fontWeight: isSelected ? "600" : "400",
        }}
      >
        {children || label}
      </Text>
      {isSelected &&
        (checkIcon ? (
          renderIcon(checkIcon, colors.primary, 16)
        ) : (
          <CheckIcon color={colors.primary} />
        ))}
    </Pressable>
  );
}

export interface ComboboxEmptyProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ComboboxEmpty({
  children = "No results found.",
  style,
}: ComboboxEmptyProps) {
  const { colors } = useCombobox();
  const { spacing, typography } = useTheme();

  return (
    <View style={[{ padding: spacing.md, alignItems: "center" }, style]}>
      <Text style={{ ...typography.caption, color: colors.textMuted }}>
        {children}
      </Text>
    </View>
  );
}
