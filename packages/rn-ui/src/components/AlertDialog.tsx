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
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "../theme";
import { renderIcon, type RenderIcon, type ToneProps } from "./types";
import { Button } from "./Button";
import { Text } from "./Text";

export type AlertDialogTone =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "secondary";

export interface AlertDialogProps extends ToneProps<AlertDialogTone> {
  visible: boolean;
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

function renderDialogText(
  content: React.ReactNode,
  variant: React.ComponentProps<typeof Text>["variant"],
  color: React.ComponentProps<typeof Text>["color"],
  style?: StyleProp<TextStyle>,
) {
  if (typeof content === "string") {
    return (
      <Text variant={variant} color={color} style={style}>
        {content}
      </Text>
    );
  }

  return content;
}

export function AlertDialog({
  visible,
  title,
  description,
  children,
  tone = "primary",
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
  animationDuration = 180,
  modalProps,
  overlayStyle,
  style,
  contentStyle,
  titleStyle,
  descriptionStyle,
}: AlertDialogProps) {
  const { colors, components, radii, spacing } = useTheme();
  const [mounted, setMounted] = useState(visible);
  const progress = useSharedValue(visible ? 1 : 0);
  const toneColor = getToneColor(tone, colors);

  useEffect(() => {
    if (visible) {
      setMounted(true);
    }

    if (!animated) {
      if (!visible) {
        setMounted(false);
      }
      return;
    }

    progress.value = withTiming(
      visible ? 1 : 0,
      { duration: animationDuration },
      (finished) => {
        if (finished && !visible) {
          runOnJS(setMounted)(false);
        }
      },
    );
  }, [animated, animationDuration, progress, visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { scale: 0.96 + progress.value * 0.04 },
      { translateY: 12 * (1 - progress.value) },
    ],
  }));

  if (!mounted) {
    return null;
  }

  const requestClose = () => {
    onClose?.();
  };

  const handleBackdropPress = () => {
    if (dismissOnBackdropPress) {
      requestClose();
    }
  };

  const dialog = (
    <View
      style={[
        {
          width: "100%",
          maxWidth: 420,
          backgroundColor: colors.surface,
          borderRadius: radii.xxl,
          borderWidth: components.borderWidth.strong,
          borderColor: colors.border,
          padding: spacing.lg,
          gap: spacing.lg,
        },
        style,
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          gap: spacing.md,
          alignItems: "flex-start",
        }}
      >
        {icon ? (
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: radii.lg,
              backgroundColor: colors.backgroundMuted,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {renderIcon(icon, toneColor, 22)}
          </View>
        ) : null}

        <View style={[{ flex: 1, gap: spacing.xs }, contentStyle]}>
          {title ? renderDialogText(title, "title", "text", titleStyle) : null}
          {description
            ? renderDialogText(
                description,
                "bodySmall",
                "textMuted",
                descriptionStyle,
              )
            : null}
        </View>

        {onClose ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close dialog"
            onPress={requestClose}
            style={({ pressed }) => ({
              width: 32,
              height: 32,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.72 : 1,
            })}
          >
            {closeIcon ? (
              renderIcon(closeIcon, colors.textMuted, 18)
            ) : (
              <Text variant="label" color="textMuted">
                x
              </Text>
            )}
          </Pressable>
        ) : null}
      </View>

      {children ? <View>{children}</View> : null}

      {onCancel || onConfirm ? (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: spacing.sm,
          }}
        >
          {onCancel ? (
            <Button
              variant="outline"
              tone="secondary"
              size="sm"
              disabled={cancelDisabled}
              onPress={onCancel}
            >
              {cancelText}
            </Button>
          ) : null}

          {onConfirm ? (
            <Button
              variant="filled"
              tone={tone}
              size="sm"
              loading={confirmLoading}
              disabled={confirmDisabled}
              onPress={onConfirm}
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
      <View
        style={[
          {
            flex: 1,
            backgroundColor: colors.overlay,
            padding: spacing.xl,
            alignItems: "center",
            justifyContent: "center",
          },
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
                maxWidth: 420,
              },
              animatedStyle,
            ]}
          >
            {dialog}
          </Animated.View>
        ) : (
          dialog
        )}
      </View>
    </Modal>
  );
}
