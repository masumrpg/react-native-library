import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../theme";
import { withAlpha } from "../utils";
import {
  renderIcon,
  type ToneProps,
  type VariantProps,
  type SizeProps,
  type ShapeProps,
  type IconSlotsProps,
  type ComponentTone,
  type ComponentSize,
  type ComponentShape,
} from "./types";

export type ButtonVariant = "filled" | "outline" | "ghost" | "soft" | "danger";
export type ButtonSize = ComponentSize;
export type ButtonTone = ComponentTone;
export type ButtonShape = ComponentShape;

export interface ButtonProps
  extends Omit<PressableProps, "children" | "style">,
    VariantProps<ButtonVariant>,
    ToneProps<ButtonTone>,
    SizeProps<ButtonSize>,
    ShapeProps<ButtonShape>,
    IconSlotsProps {
  children: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

function getToneColors(
  tone: ButtonTone,
  colors: ReturnType<typeof useTheme>["colors"],
) {
  if (tone === "primary")
    return {
      base: colors.primary,
      soft: colors.primarySoft,
      on: colors.onPrimary,
    };
  if (tone === "secondary")
    return {
      base: colors.secondary,
      soft: colors.secondarySoft,
      on: colors.onSecondary,
    };
  if (tone === "accent")
    return {
      base: colors.accent,
      soft: colors.accentSoft,
      on: colors.onAccent,
    };
  if (tone === "success")
    return {
      base: colors.success,
      soft: colors.successSoft,
      on: colors.onSuccess,
    };
  if (tone === "warning")
    return {
      base: colors.warning,
      soft: colors.warningSoft,
      on: colors.onWarning,
    };
  if (tone === "danger")
    return {
      base: colors.danger,
      soft: colors.dangerSoft,
      on: colors.onDanger,
    };
  return { base: colors.info, soft: colors.infoSoft, on: colors.onInfo };
}

export function Button({
  children,
  variant = "filled",
  size = "md",
  tone = "primary",
  shape = "rounded",
  leftIcon,
  rightIcon,
  loading = false,
  fullWidth,
  disabled,
  style,
  textStyle,
  ...props
}: ButtonProps) {
  const { colors, typography, radii, components, spacing } = useTheme();
  const isDisabled = disabled || loading;
  const visualVariant = variant === "danger" ? "filled" : variant;
  const resolvedTone = variant === "danger" ? "danger" : tone;
  const toneColors = getToneColors(resolvedTone, colors);

  const backgroundColor = isDisabled
    ? colors.disabled
    : visualVariant === "filled"
      ? toneColors.base
      : visualVariant === "soft"
        ? toneColors.soft
        : colors.transparent;

  const foregroundColor = isDisabled
    ? colors.disabledText
    : visualVariant === "filled"
      ? toneColors.on
      : toneColors.base;

  const borderColor = isDisabled
    ? colors.disabled
    : visualVariant === "outline"
      ? withAlpha(toneColors.base, 0.42)
      : colors.transparent;

  const height = components.button.height[size];
  const iconSize = components.button.iconSize[size];
  const borderRadius =
    shape === "pill" ? radii.full : shape === "square" ? radii.sm : radii.lg;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }) => [
        {
          minHeight: height,
          paddingHorizontal: components.button.paddingX[size],
          borderRadius,
          backgroundColor,
          borderColor,
          borderWidth:
            visualVariant === "outline" ? components.borderWidth.strong : 0,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: spacing.sm,
          opacity: pressed && !isDisabled ? 0.78 : 1,
          width: fullWidth ? "100%" : undefined,
        },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={foregroundColor} />
      ) : (
        <>
          {renderIcon(leftIcon, foregroundColor, iconSize)}
          {typeof children === "string" ? (
            <Text
              style={[
                typography.label,
                {
                  color: foregroundColor,
                  textAlign: "center",
                },
                textStyle,
              ]}
            >
              {children}
            </Text>
          ) : (
            children
          )}
          {renderIcon(rightIcon, foregroundColor, iconSize)}
        </>
      )}
    </Pressable>
  );
}
