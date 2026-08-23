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
  type ComponentTone,
} from "./types";

export type BadgeTone = ComponentTone;
export type BadgeVariant = "solid" | "soft" | "outline";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps
  extends ToneProps<BadgeTone>,
    VariantProps<BadgeVariant>,
    SizeProps<BadgeSize> {
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
  icon,
  style,
}: BadgeProps) {
  const { colors, components, radii, spacing } = useTheme();
  const toneColors = getBadgeColors(tone, colors);
  const isSolid = variant === "solid";
  const iconSize = size === "lg" ? 14 : size === "sm" ? 10 : 12;

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
          backgroundColor: isSolid
            ? toneColors.solid
            : variant === "soft"
              ? toneColors.soft
              : colors.transparent,
          borderWidth:
            variant === "outline" ? components.borderWidth.default : 0,
          borderColor:
            variant === "outline" ? colors.border : colors.transparent,
        },
        style,
      ]}
    >
      {renderIcon(icon, isSolid ? toneColors.on : toneColors.solid, iconSize)}
      <Text
        variant="labelSmall"
        color={isSolid ? "textInverse" : "text"}
        style={{ color: isSolid ? toneColors.on : toneColors.solid }}
      >
        {children}
      </Text>
    </View>
  );
}
