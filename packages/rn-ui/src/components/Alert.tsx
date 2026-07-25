import React from "react";
import {
  Pressable,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "../theme";
import { renderIcon, type RenderIcon } from "./types";
import { Text } from "./Text";

export type AlertTone =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "secondary";
export type AlertVariant = "soft" | "outline" | "solid";

export interface AlertAction {
  label: string;
  onPress: () => void;
  icon?: RenderIcon;
}

export interface AlertProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
  tone?: AlertTone;
  variant?: AlertVariant;
  icon?: RenderIcon;
  action?: AlertAction;
  dismissible?: boolean;
  animated?: boolean;
  animationDuration?: number;
  onClose?: () => void;
  closeIcon?: RenderIcon;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  textStyle?: StyleProp<TextStyle>;
}

function getToneColors(
  tone: AlertTone,
  colors: ReturnType<typeof useTheme>["colors"],
) {
  if (tone === "primary")
    return {
      base: colors.primary,
      soft: colors.primarySoft,
      on: colors.onPrimary,
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
  if (tone === "info")
    return { base: colors.info, soft: colors.infoSoft, on: colors.onInfo };
  return {
    base: colors.secondary,
    soft: colors.secondarySoft,
    on: colors.onSecondary,
  };
}

function renderTextContent(
  content: React.ReactNode,
  fallbackStyle: StyleProp<TextStyle>,
) {
  if (typeof content === "string") {
    return <Text style={fallbackStyle}>{content}</Text>;
  }

  return content;
}

export function Alert({
  title,
  children,
  tone = "info",
  variant = "soft",
  icon,
  action,
  dismissible = false,
  animated = true,
  animationDuration = 180,
  onClose,
  closeIcon,
  style,
  contentStyle,
  titleStyle,
  textStyle,
}: AlertProps) {
  const { colors, components, radii, spacing } = useTheme();
  const [visible, setVisible] = React.useState(true);
  const progress = useSharedValue(1);
  const toneColors = getToneColors(tone, colors);
  const isSolid = variant === "solid";
  const backgroundColor =
    variant === "solid"
      ? toneColors.base
      : variant === "soft"
        ? toneColors.soft
        : colors.surface;
  const foregroundColor = isSolid ? toneColors.on : toneColors.base;
  const bodyColor = isSolid ? toneColors.on : colors.textMuted;
  const borderColor = variant === "outline" ? toneColors.base : toneColors.base;

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.98 + progress.value * 0.02 }],
  }));

  const handleClose = () => {
    if (dismissible && animated) {
      progress.value = withTiming(
        0,
        { duration: animationDuration },
        (finished) => {
          if (finished) {
            runOnJS(setVisible)(false);
          }
        },
      );
    } else if (dismissible) {
      setVisible(false);
    }

    onClose?.();
  };

  const container = (
    <View
      accessibilityRole="alert"
      style={[
        {
          backgroundColor,
          borderColor,
          borderWidth: components.borderWidth.strong,
          borderRadius: radii.xl,
          padding: spacing.lg,
          flexDirection: "row",
          gap: spacing.md,
        },
        style,
      ]}
    >
      {renderIcon(icon, foregroundColor, 20)}

      <View style={[{ flex: 1, gap: spacing.xs }, contentStyle]}>
        {title
          ? renderTextContent(title, [
              { color: isSolid ? toneColors.on : colors.text },
              titleStyle,
            ])
          : null}

        {children
          ? renderTextContent(children, [{ color: bodyColor }, textStyle])
          : null}

        {action ? (
          <Pressable
            accessibilityRole="button"
            onPress={action.onPress}
            style={({ pressed }) => ({
              alignSelf: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.xs,
              marginTop: spacing.xs,
              opacity: pressed ? 0.72 : 1,
            })}
          >
            {renderIcon(action.icon, foregroundColor, 14)}
            <Text variant="labelSmall" style={{ color: foregroundColor }}>
              {action.label}
            </Text>
          </Pressable>
        ) : null}
      </View>

      {dismissible || onClose ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close alert"
          onPress={handleClose}
          style={({ pressed }) => ({
            width: 28,
            height: 28,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed ? 0.72 : 1,
          })}
        >
          {closeIcon ? (
            renderIcon(closeIcon, foregroundColor, 16)
          ) : (
            <Text variant="label" style={{ color: foregroundColor }}>
              x
            </Text>
          )}
        </Pressable>
      ) : null}
    </View>
  );

  if (!visible) {
    return null;
  }

  if (animated) {
    return <Animated.View style={animatedStyle}>{container}</Animated.View>;
  }

  return container;
}
