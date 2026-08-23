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
import { withAlpha } from "../utils";
import { Text } from "./Text";
import { renderIcon, type RenderIcon, type BaseGlassProps } from "./types";

export type AlertTone =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "secondary";

export type AlertVariant = "soft" | "outline" | "solid" | "glass" | "accent";

export interface AlertAction {
  label: string;
  onPress: () => void;
  icon?: RenderIcon;
}

export interface AlertProps extends BaseGlassProps {
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

// Built-in default icons when icon prop is omitted
function DefaultInfoIcon({ color }: { color: string }) {
  return (
    <View
      style={{
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 1.8,
        borderColor: color,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color, fontSize: 11, fontWeight: "700", lineHeight: 12 }}>
        i
      </Text>
    </View>
  );
}

function DefaultSuccessIcon({ color }: { color: string }) {
  return (
    <View
      style={{
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: color,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: 8,
          height: 4,
          borderLeftWidth: 1.8,
          borderBottomWidth: 1.8,
          borderColor: "#FFFFFF",
          transform: [{ rotate: "-45deg" }],
          marginTop: -1,
        }}
      />
    </View>
  );
}

function DefaultWarningIcon({ color }: { color: string }) {
  return (
    <Text style={{ color, fontSize: 16, fontWeight: "700", lineHeight: 18 }}>
      ⚠️
    </Text>
  );
}

function DefaultDangerIcon({ color }: { color: string }) {
  return (
    <View
      style={{
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: color,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "700", lineHeight: 12 }}>
        ✕
      </Text>
    </View>
  );
}

function renderDefaultIcon(tone: AlertTone, color: string) {
  if (tone === "success") return <DefaultSuccessIcon color={color} />;
  if (tone === "warning") return <DefaultWarningIcon color={color} />;
  if (tone === "danger") return <DefaultDangerIcon color={color} />;
  return <DefaultInfoIcon color={color} />;
}

export function Alert({
  title,
  children,
  tone = "info",
  variant = "soft",
  glass = false,
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
  const { colors, components, radii, spacing, isDark } = useTheme();
  const [visible, setVisible] = React.useState(true);
  const progress = useSharedValue(1);

  // Deep rich solid colors for dark mode & light mode
  const solidColors: Record<AlertTone, { bg: string; text: string }> = {
    primary: { bg: isDark ? "#3730A3" : colors.primary, text: "#FFFFFF" },
    success: { bg: isDark ? "#065F46" : "#059669", text: "#FFFFFF" },
    warning: { bg: isDark ? "#92400E" : "#D97706", text: "#FFFFFF" },
    danger: { bg: isDark ? "#991B1B" : "#DC2626", text: "#FFFFFF" },
    info: { bg: isDark ? "#075985" : "#0284C7", text: "#FFFFFF" },
    secondary: { bg: isDark ? "#334155" : colors.secondary, text: "#FFFFFF" },
  };

  const toneBaseColor: Record<AlertTone, string> = {
    primary: colors.primary,
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
    info: colors.info,
    secondary: colors.secondary,
  };

  const currentToneColor = toneBaseColor[tone];
  const effectiveVariant = glass ? "glass" : variant;

  const glassBg = isDark
    ? "rgba(15, 27, 45, 0.70)"
    : "rgba(255, 255, 255, 0.85)";

  let backgroundColor = colors.surface;
  let borderColor = colors.border;
  let titleTextColor = colors.text;
  let bodyTextColor = colors.textMuted;
  let iconColor = currentToneColor;

  if (effectiveVariant === "solid") {
    backgroundColor = solidColors[tone].bg;
    borderColor = solidColors[tone].bg;
    titleTextColor = solidColors[tone].text;
    bodyTextColor = withAlpha(solidColors[tone].text, 0.88);
    iconColor = solidColors[tone].text;
  } else if (effectiveVariant === "soft") {
    backgroundColor = isDark
      ? withAlpha(currentToneColor, 0.12)
      : withAlpha(currentToneColor, 0.08);
    borderColor = isDark
      ? withAlpha(currentToneColor, 0.28)
      : withAlpha(currentToneColor, 0.22);
    titleTextColor = isDark ? colors.text : colors.text;
    bodyTextColor = colors.textMuted;
    iconColor = currentToneColor;
  } else if (effectiveVariant === "accent") {
    backgroundColor = colors.surface;
    borderColor = colors.border;
    titleTextColor = colors.text;
    bodyTextColor = colors.textMuted;
    iconColor = currentToneColor;
  } else if (effectiveVariant === "glass") {
    backgroundColor = glassBg;
    borderColor = withAlpha(currentToneColor, 0.35);
    titleTextColor = colors.text;
    bodyTextColor = colors.textMuted;
    iconColor = currentToneColor;
  } else if (effectiveVariant === "outline") {
    backgroundColor = colors.transparent;
    borderColor = currentToneColor;
    titleTextColor = colors.text;
    bodyTextColor = colors.textMuted;
    iconColor = currentToneColor;
  }

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.98 + progress.value * 0.02 }],
  }));

  const handleClose = () => {
    if ((dismissible || onClose) && animated) {
      progress.value = withTiming(
        0,
        { duration: animationDuration },
        (finished) => {
          if (finished) {
            runOnJS(setVisible)(false);
          }
        },
      );
    } else {
      setVisible(false);
    }

    onClose?.();
  };

  if (!visible) return null;

  const content = (
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
          alignItems: "flex-start",
          gap: spacing.md,
          position: "relative",
          overflow: "hidden",
        },
        effectiveVariant === "accent" && {
          borderLeftWidth: 4,
          borderLeftColor: currentToneColor,
        },
        style,
      ]}
    >
      {/* Icon */}
      <View style={{ marginTop: 2 }}>
        {icon ? renderIcon(icon, iconColor, 20) : renderDefaultIcon(tone, iconColor)}
      </View>

      {/* Main Content */}
      <View style={[{ flex: 1, gap: 4 }, contentStyle]}>
        {title ? (
          typeof title === "string" ? (
            <Text
              variant="label"
              weight="600"
              style={[{ color: titleTextColor }, titleStyle]}
            >
              {title}
            </Text>
          ) : (
            title
          )
        ) : null}

        {children ? (
          typeof children === "string" ? (
            <Text
              variant="bodySmall"
              style={[{ color: bodyTextColor, lineHeight: 20 }, textStyle]}
            >
              {children}
            </Text>
          ) : (
            children
          )
        ) : null}

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
            {renderIcon(action.icon, iconColor, 14)}
            <Text variant="labelSmall" weight="600" style={{ color: iconColor }}>
              {action.label}
            </Text>
          </Pressable>
        ) : null}
      </View>

      {/* Close Button */}
      {dismissible || onClose ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close alert"
          onPress={handleClose}
          hitSlop={8}
          style={({ pressed }) => ({
            width: 24,
            height: 24,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: pressed ? withAlpha(iconColor, 0.15) : "transparent",
            opacity: pressed ? 0.8 : 0.7,
          })}
        >
          {closeIcon ? (
            renderIcon(closeIcon, iconColor, 16)
          ) : (
            <Text style={{ color: iconColor, fontSize: 14, fontWeight: "600" }}>
              ✕
            </Text>
          )}
        </Pressable>
      ) : null}
    </View>
  );

  if (animated) {
    return <Animated.View style={animatedStyle}>{content}</Animated.View>;
  }

  return content;
}
