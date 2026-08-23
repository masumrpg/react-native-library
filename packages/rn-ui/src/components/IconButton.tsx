import React from "react";
import {
  ActivityIndicator,
  Pressable,
  View,
  type PressableProps,
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
  type ThemeColorName,
  type ToneProps,
  type VariantProps,
  type SizeProps,
  type BaseGlassProps,
  type BaseHapticProps,
  type BaseAnimatedProps,
  type ComponentTone,
} from "./types";

export type IconButtonVariant = "filled" | "outline" | "ghost" | "soft";
export type IconButtonSize = "sm" | "md" | "lg";
export type IconButtonTone = ComponentTone;

export interface IconButtonProps
  extends Omit<PressableProps, "children" | "style">,
    VariantProps<IconButtonVariant>,
    ToneProps<IconButtonTone>,
    SizeProps<IconButtonSize>,
    BaseGlassProps,
    BaseHapticProps,
    BaseAnimatedProps {
  icon: RenderIcon;
  color?: ThemeColorName | string;
  loading?: boolean;
  badge?: number;
  style?: StyleProp<ViewStyle>;
}

function getToneColor(
  tone: IconButtonTone,
  colors: ReturnType<typeof useTheme>["colors"],
) {
  if (tone === "primary") return colors.primary;
  if (tone === "secondary") return colors.secondary;
  if (tone === "accent") return colors.accent;
  if (tone === "success") return colors.success;
  if (tone === "warning") return colors.warning;
  if (tone === "danger") return colors.danger;
  return colors.info;
}

function resolveColor(
  color: ThemeColorName | string | undefined,
  colors: ReturnType<typeof useTheme>["colors"],
) {
  if (!color) return undefined;
  return color in colors ? colors[color as ThemeColorName] : color;
}

export function IconButton({
  icon,
  variant = "ghost",
  size = "md",
  tone = "primary",
  color,
  loading,
  glass = false,
  haptic = true,
  animated = true,
  disabled,
  badge,
  onPress,
  style,
  ...props
}: IconButtonProps) {
  const { colors, components, isDark } = useTheme();
  const base = resolveColor(color, colors) ?? getToneColor(tone, colors);
  const isDisabled = disabled || loading;
  const containerSize = components.iconButton.size[size];
  const iconSize = components.iconButton.iconSize[size];
  const badgeTokens = components.iconButton.badge;

  const glassBg = isDark
    ? "rgba(15, 27, 45, 0.65)"
    : "rgba(255, 255, 255, 0.78)";

  const backgroundColor = isDisabled
    ? colors.disabled
    : glass
      ? glassBg
      : variant === "filled"
        ? base
        : variant === "soft"
          ? withAlpha(base, 0.12)
          : variant === "outline"
            ? colors.surface
            : colors.transparent;

  const iconColor = isDisabled
    ? colors.disabledText
    : glass
      ? base
      : variant === "filled"
        ? colors.onPrimary
        : variant === "ghost"
          ? colors.text
          : base;

  const handlePress = (e: any) => {
    if (isDisabled) return;
    if (haptic) triggerHaptic("light");
    onPress?.(e);
  };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={handlePress}
      style={({ pressed }) => [
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2,
          backgroundColor,
          borderColor:
            glass || variant === "outline" ? colors.border : colors.transparent,
          borderWidth:
            glass || variant === "outline"
              ? components.borderWidth.strong
              : 0,
          alignItems: "center",
          justifyContent: "center",
          opacity: pressed && !isDisabled ? 0.76 : 1,
          transform: [{ scale: pressed && animated && !isDisabled ? 0.96 : 1 }],
        },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={iconColor} />
      ) : (
        renderIcon(icon, iconColor, iconSize)
      )}
      {!!badge && badge > 0 && (
        <View
          style={{
            position: "absolute",
            top: badgeTokens.offset,
            right: badgeTokens.offset,
            minWidth: badgeTokens.minWidth,
            height: badgeTokens.size,
            paddingHorizontal: badgeTokens.paddingX,
            borderRadius: badgeTokens.size / 2,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.danger,
            borderWidth: badgeTokens.borderWidth,
            borderColor: colors.surface,
          }}
        >
          <Text
            variant="caption"
            color="onDanger"
            weight="700"
            style={{
              fontSize: badgeTokens.fontSize,
              lineHeight: badgeTokens.lineHeight,
            }}
          >
            {badge > 99 ? "99+" : String(badge)}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
