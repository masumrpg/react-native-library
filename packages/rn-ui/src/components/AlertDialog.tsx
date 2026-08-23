import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  View,
  type ModalProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "../theme";
import { withAlpha } from "../utils";
import { triggerHaptic } from "../utils/haptics";
import { Button } from "./Button";
import { Text } from "./Text";
import {
  renderIcon,
  type RenderIcon,
  type BaseGlassProps,
  type BaseHapticProps,
  type ToneProps,
} from "./types";

export type AlertDialogTone =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "secondary";

export type AlertDialogAlign = "center" | "left";

export interface AlertDialogProps
  extends ToneProps<AlertDialogTone>,
    BaseGlassProps,
    BaseHapticProps {
  visible: boolean;
  align?: AlertDialogAlign;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  icon?: RenderIcon;
  closeIcon?: RenderIcon;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  confirmLoading?: boolean;
  confirmDisabled?: boolean;
  cancelDisabled?: boolean;
  dismissOnBackdropPress?: boolean;
  animated?: boolean;
  animationDuration?: number;
  modalProps?: Omit<
    ModalProps,
    "visible" | "transparent" | "animationType" | "onRequestClose"
  >;
  overlayStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
}

function getToneColor(
  tone: AlertDialogTone,
  colors: ReturnType<typeof useTheme>["colors"],
) {
  if (tone === "primary") return colors.primary;
  if (tone === "success") return colors.success;
  if (tone === "warning") return colors.warning;
  if (tone === "danger") return colors.danger;
  if (tone === "info") return colors.info;
  return colors.secondary;
}

export function AlertDialog({
  visible,
  align = "center",
  title,
  description,
  children,
  tone = "primary",
  glass = false,
  haptic = true,
  icon,
  closeIcon,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  onClose,
  confirmLoading = false,
  confirmDisabled = false,
  cancelDisabled = false,
  dismissOnBackdropPress = true,
  animated = true,
  animationDuration = 220,
  modalProps,
  overlayStyle,
  style,
  contentStyle,
  titleStyle,
  descriptionStyle,
}: AlertDialogProps) {
  const { colors, components, radii, spacing, isDark } = useTheme();
  const [mounted, setMounted] = useState(visible);
  const progress = useSharedValue(visible ? 1 : 0);
  const toneColor = getToneColor(tone, colors);

  useEffect(() => {
    if (visible) {
      if (haptic) triggerHaptic("medium");
      setMounted(true);
      if (animated) {
        progress.value = withTiming(1, {
          duration: animationDuration,
          easing: Easing.out(Easing.cubic),
        });
      } else {
        progress.value = 1;
      }
    } else {
      if (animated) {
        progress.value = withTiming(
          0,
          {
            duration: Math.max(120, animationDuration - 40),
            easing: Easing.in(Easing.quad),
          },
          (finished) => {
            if (finished) {
              runOnJS(setMounted)(false);
            }
          },
        );
      } else {
        progress.value = 0;
        setMounted(false);
      }
    }
  }, [animated, animationDuration, haptic, progress, visible]);

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { scale: 0.94 + progress.value * 0.06 },
      { translateY: 10 * (1 - progress.value) },
    ],
  }));

  if (!mounted) return null;

  const requestClose = () => {
    if (haptic) triggerHaptic("selection");
    onClose?.();
  };

  const handleBackdropPress = () => {
    if (dismissOnBackdropPress) {
      requestClose();
    }
  };

  const handleConfirm = () => {
    if (haptic) triggerHaptic("light");
    onConfirm?.();
  };

  const handleCancel = () => {
    if (haptic) triggerHaptic("selection");
    onCancel?.();
  };

  const glassBg = isDark
    ? "rgba(15, 27, 45, 0.92)"
    : "rgba(255, 255, 255, 0.96)";

  const dialogBg = glass ? glassBg : colors.surface;
  const borderColor = withAlpha(toneColor, isDark ? 0.35 : 0.25);
  const isCentered = align === "center";

  const dialog = (
    <View
      style={[
        {
          width: "100%",
          maxWidth: 400,
          backgroundColor: dialogBg,
          borderRadius: radii.xxl,
          borderWidth: components.borderWidth.strong,
          borderColor,
          padding: spacing.xl,
          gap: spacing.lg,
          alignItems: isCentered ? "center" : "stretch",
          position: "relative",
          elevation: 0,
        },
        style,
      ]}
    >
      {/* Top Close Button (✕) */}
      {onClose ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close dialog"
          onPress={requestClose}
          hitSlop={12}
          style={({ pressed }) => ({
            position: "absolute",
            top: spacing.md,
            right: spacing.md,
            width: 32,
            height: 32,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: pressed ? colors.backgroundMuted : "transparent",
            zIndex: 10,
            opacity: pressed ? 0.8 : 0.7,
          })}
        >
          {closeIcon ? (
            renderIcon(closeIcon, colors.textMuted, 16)
          ) : (
            <Text style={{ color: colors.textMuted, fontSize: 16, fontWeight: "600" }}>
              ✕
            </Text>
          )}
        </Pressable>
      ) : null}

      {/* Icon Badge */}
      {icon ? (
        <View
          style={{
            width: isCentered ? 56 : 44,
            height: isCentered ? 56 : 44,
            borderRadius: isCentered ? 28 : radii.lg,
            backgroundColor: withAlpha(toneColor, 0.14),
            borderWidth: 1.5,
            borderColor: withAlpha(toneColor, 0.28),
            alignItems: "center",
            justifyContent: "center",
            alignSelf: isCentered ? "center" : "flex-start",
          }}
        >
          {renderIcon(icon, toneColor, isCentered ? 26 : 22)}
        </View>
      ) : null}

      {/* Title & Description */}
      <View
        style={[
          {
            width: "100%",
            gap: spacing.xs,
            alignItems: isCentered ? "center" : "flex-start",
          },
          contentStyle,
        ]}
      >
        {title ? (
          typeof title === "string" ? (
            <Text
              variant="h3"
              weight="700"
              style={[
                {
                  textAlign: isCentered ? "center" : "left",
                  color: colors.text,
                },
                titleStyle,
              ]}
            >
              {title}
            </Text>
          ) : (
            title
          )
        ) : null}

        {description ? (
          typeof description === "string" ? (
            <Text
              variant="bodySmall"
              color="textMuted"
              style={[
                {
                  textAlign: isCentered ? "center" : "left",
                  lineHeight: 22,
                },
                descriptionStyle,
              ]}
            >
              {description}
            </Text>
          ) : (
            description
          )
        ) : null}
      </View>

      {children ? <View style={{ width: "100%" }}>{children}</View> : null}

      {/* Action Buttons */}
      {onCancel || onConfirm ? (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: isCentered ? "center" : "flex-end",
            gap: spacing.sm,
            marginTop: spacing.xs,
          }}
        >
          {onCancel ? (
            <Button
              variant="outline"
              tone="secondary"
              size="md"
              style={{ flex: isCentered ? 1 : undefined }}
              disabled={cancelDisabled}
              onPress={handleCancel}
            >
              {cancelText}
            </Button>
          ) : null}

          {onConfirm ? (
            <Button
              variant="filled"
              tone={tone}
              size="md"
              style={{ flex: isCentered ? 1 : undefined }}
              loading={confirmLoading}
              disabled={confirmDisabled}
              onPress={handleConfirm}
            >
              {confirmText}
            </Button>
          ) : null}
        </View>
      ) : null}
    </View>
  );

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      hardwareAccelerated
      onRequestClose={requestClose}
      {...modalProps}
    >
      <Animated.View
        style={[
          {
            flex: 1,
            backgroundColor: isDark ? "rgba(0, 0, 0, 0.78)" : "rgba(15, 23, 42, 0.65)",
            padding: spacing.xl,
            alignItems: "center",
            justifyContent: "center",
          },
          backdropAnimatedStyle,
          overlayStyle,
        ]}
      >
        <Pressable
          accessibilityRole="button"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
          onPress={handleBackdropPress}
        />

        {animated ? (
          <Animated.View
            style={[
              {
                width: "100%",
                maxWidth: 400,
                alignItems: "center",
              },
              cardAnimatedStyle,
            ]}
          >
            {dialog}
          </Animated.View>
        ) : (
          dialog
        )}
      </Animated.View>
    </Modal>
  );
}
