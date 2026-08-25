import React from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { useTheme } from "../theme";
import { Text } from "./Text";
import {
  renderIcon,
  type RenderIcon,
  type ToneProps,
  type VariantProps,
  type SizeProps,
  type BaseGlassProps,
  type ComponentTone,
} from "./types";

export type BadgeTone = ComponentTone;
export type BadgeVariant = "solid" | "soft" | "outline" | "subtle" | "ghost";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps
  extends ToneProps<BadgeTone>,
    VariantProps<BadgeVariant>,
    SizeProps<BadgeSize>,
    BaseGlassProps {
  children: string;
  icon?: RenderIcon;
  style?: StyleProp<ViewStyle>;
}

function getBadgeColors(
  tone: BadgeTone,
  colors: ReturnType<typeof useTheme>["colors"],
) {
  const map = {
    primary: {
      solid: colors.primary,
      soft: colors.primarySoft,
      on: colors.onPrimary,
    },
    secondary: {
      solid: colors.secondary,
      soft: colors.secondarySoft,
      on: colors.onSecondary,
    },
    accent: {
      solid: colors.accent,
      soft: colors.accentSoft,
      on: colors.onAccent,
    },
    success: {
      solid: colors.success,
      soft: colors.successSoft,
      on: colors.onSuccess,
    },
    warning: {
      solid: colors.warning,
      soft: colors.warningSoft,
      on: colors.onWarning,
    },
    danger: {
      solid: colors.danger,
      soft: colors.dangerSoft,
      on: colors.onDanger,
    },
    info: { solid: colors.info, soft: colors.infoSoft, on: colors.onInfo },
    default: { solid: colors.primary, soft: colors.primarySoft, on: colors.onPrimary },
  };

  return map[tone] ?? map.primary;
}

export function Badge({
  children,
  tone = "primary",
  variant = "soft",
  size = "md",
  glass = false,
  icon,
  style,
}: BadgeProps) {
  const { colors, components, radii, spacing, isDark } = useTheme();
  const toneColors = getBadgeColors(tone, colors);
  const isSolid = variant === "solid";
  const isSoft = variant === "soft";
  const isSubtle = variant === "subtle";
  const isOutline = variant === "outline";
  const iconSize = size === "lg" ? 14 : size === "sm" ? 10 : 12;

  const glassBg = isDark
    ? "rgba(15, 27, 45, 0.60)"
    : "rgba(255, 255, 255, 0.75)";

  const backgroundColor = glass
    ? glassBg
    : isSolid
    ? toneColors.solid
    : isSoft || isSubtle
    ? toneColors.soft
    : colors.transparent;

  const borderWidth =
    glass || isOutline || isSubtle ? components.borderWidth.default : 0;

  const borderColor = glass
    ? isDark
      ? "rgba(248, 250, 252, 0.20)"
      : "rgba(15, 23, 42, 0.14)"
    : isOutline
    ? colors.border
    : isSubtle
    ? toneColors.solid
    : colors.transparent;

  const textColor = isSolid && !glass ? toneColors.on : toneColors.solid;

  return (
    <View
      style={[
        {
          alignSelf: "flex-start",
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.xs,
          paddingHorizontal: size === "lg" ? spacing.md : spacing.sm,
          paddingVertical: size === "lg" ? spacing.xs : spacing.xxs,
          borderRadius: radii.full,
          backgroundColor,
          borderWidth,
          borderColor,
        },
        style,
      ]}
    >
      {renderIcon(icon, textColor, iconSize)}
      <Text
        variant="labelSmall"
        color={isSolid && !glass ? "textInverse" : "text"}
        style={{ color: textColor }}
      >
        {children}
      </Text>
    </View>
  );
}
