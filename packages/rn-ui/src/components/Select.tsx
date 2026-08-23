import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../theme";
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

export type SelectVariant = "outline" | "filled" | "soft";
export type SelectSize = "sm" | "md" | "lg";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SelectProps
  extends BaseGlassProps,
    BaseHapticProps,
    VariantProps<SelectVariant>,
    SizeProps<SelectSize> {
  value?: string;
  defaultValue?: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  chevronIcon?: RenderIcon;
  checkIcon?: RenderIcon;
  style?: StyleProp<ViewStyle>;
}

const selectHeights: Record<SelectSize, number> = {
  sm: 36,
  md: 44,
  lg: 52,
};

const selectPaddingX: Record<SelectSize, number> = {
  sm: 10,
  md: 12,
  lg: 14,
};

import { useFormField } from "./FormField";

export function Select({
  value,
  defaultValue,
  options,
  placeholder = "Select option",
  variant = "outline",
  size = "md",
  disabled = false,
  glass = false,
  haptic = true,
  onValueChange,
  chevronIcon,
  checkIcon,
  style,
}: SelectProps) {
  const { colors, components, radii, spacing, isDark } = useTheme();
  const field = useFormField();
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const triggerRef = React.useRef<View>(null);
  const [coords, setCoords] = React.useState({ x: 0, y: 0, width: 0 });

  const isInvalid = Boolean(field?.invalid);
  const isDisabled = disabled || Boolean(field?.disabled);

  const currentValue = value ?? internalValue;
  const selected = options.find((option) => option.value === currentValue);

  const choose = (next: string) => {
    if (haptic) triggerHaptic("selection");
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
    setOpen(false);
  };

  const handleOpen = () => {
    if (isDisabled) return;
    if (haptic) triggerHaptic("light");

    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setCoords({
        x,
        y: y + height + 4,
        width,
      });
      setOpen(false);
      setOpen(true);
    });
  };

  const glassBg = isDark
    ? "rgba(15, 27, 45, 0.70)"
    : "rgba(255, 255, 255, 0.85)";

  const triggerBg = isDisabled
    ? withAlpha(colors.input, 0.55)
    : glass
      ? glassBg
      : variant === "filled"
        ? colors.surface
        : variant === "soft"
          ? withAlpha(colors.primary, 0.08)
          : colors.input;

  const borderColor = isInvalid
    ? colors.danger
    : isDisabled
      ? colors.border
      : invalidOrOpenBorder(open, glass, isDark, colors);

  const containerHeight = selectHeights[size];
  const paddingX = selectPaddingX[size];

  return (
    <View ref={triggerRef} style={{ width: "100%" }}>
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={handleOpen}
        style={({ pressed }) => [
          {
            minHeight: containerHeight,
            height: containerHeight,
            width: "100%",
            borderWidth: open
              ? components.borderWidth.focus
              : components.borderWidth.strong,
            borderColor,
            borderRadius: radii.lg,
            backgroundColor: triggerBg,
            paddingHorizontal: paddingX,
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
            opacity: disabled ? 0.56 : pressed ? 0.82 : 1,
          },
          style,
        ]}
      >
        <Text
          variant={size === "sm" ? "bodySmall" : "body"}
          color={selected ? "text" : "placeholder"}
          style={{ flex: 1 }}
        >
          {selected?.label ?? placeholder}
        </Text>
        {renderIcon(chevronIcon, colors.textMuted, size === "sm" ? 14 : 18) ?? (
          <Text color="textMuted" style={{ fontSize: size === "sm" ? 12 : 14 }}>
            ⌄
          </Text>
        )}
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setOpen(false)}
        >
          <View
            style={[
              {
                position: "absolute",
                top: coords.y,
                left: coords.x,
                width: coords.width,
                maxHeight: 260,
                backgroundColor: glass ? glassBg : colors.surface,
                borderRadius: radii.xl,
                borderWidth: components.borderWidth.strong,
                borderColor: glass
                  ? isDark
                    ? "rgba(248, 250, 252, 0.20)"
                    : "rgba(15, 23, 42, 0.14)"
                  : colors.border,
                padding: spacing.xs,
                elevation: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.18,
                shadowRadius: 12,
              },
            ]}
          >
            <ScrollView
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
            >
              <View style={{ gap: 2 }}>
                {options.map((option) => {
                  const active = option.value === currentValue;
                  return (
                    <Pressable
                      key={option.value}
                      disabled={option.disabled}
                      onPress={() => choose(option.value)}
                      style={({ pressed }) => ({
                        minHeight: 40,
                        borderRadius: radii.lg,
                        backgroundColor: active
                          ? colors.primarySoft
                          : pressed
                            ? colors.backgroundMuted
                            : colors.transparent,
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.xs,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacing.sm,
                        opacity: option.disabled ? 0.5 : 1,
                      })}
                    >
                      <View style={{ flex: 1, gap: 2 }}>
                        <Text
                          variant="body"
                          color={active ? "primary" : "text"}
                          weight={active ? "600" : "400"}
                        >
                          {option.label}
                        </Text>
                        {option.description ? (
                          <Text variant="caption" color="textMuted">
                            {option.description}
                          </Text>
                        ) : null}
                      </View>
                      {active
                        ? (renderIcon(checkIcon, colors.primary, 16) ?? (
                            <Text color="primary" weight="700">
                              ✓
                            </Text>
                          ))
                        : null}
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

function invalidOrOpenBorder(
  open: boolean,
  glass: boolean,
  isDark: boolean,
  colors: ReturnType<typeof useTheme>["colors"],
) {
  if (open) return colors.primary;
  if (glass)
    return isDark ? "rgba(248, 250, 252, 0.20)" : "rgba(15, 23, 42, 0.14)";
  return colors.border;
}
