import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  View,
  type ModalProps,
  type StyleProp,
  type TextStyle,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../theme";
import { triggerHaptic } from "../utils/haptics";
import { Text } from "./Text";
import {
  renderIcon,
  type RenderIcon,
  type BaseGlassProps,
  type BaseHapticProps,
} from "./types";

export interface SheetProps extends BaseGlassProps, BaseHapticProps {
  visible: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  closeIcon?: RenderIcon;
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

export function Sheet({
  visible,
  onClose,
  title,
  description,
  children,
  glass = false,
  haptic = true,
  closeIcon,
  dismissOnBackdropPress = true,
  animated = true,
  animationDuration = 240,
  modalProps,
  overlayStyle,
  style,
  contentStyle,
  titleStyle,
  descriptionStyle,
}: SheetProps) {
  const { colors, components, radii, spacing, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const progress = useSharedValue(0);

  const bottomInset = Math.max(insets.bottom, spacing.md);

  useEffect(() => {
    if (visible) {
      if (haptic) triggerHaptic("medium");
      progress.value = 0; // Guarantee 0 offset on initial mount frame (no flicker/glitch)
      setMounted(true);
      if (animated) {
        progress.value = withTiming(1, {
          duration: animationDuration,
          easing: Easing.out(Easing.quad),
        });
      } else {
        progress.value = 1;
      }
    } else {
      if (animated) {
        progress.value = withTiming(
          0,
          {
            duration: Math.max(140, animationDuration - 60),
            easing: Easing.in(Easing.quad),
          },
          (finished) => {
            if (finished) {
              scheduleOnRN(setMounted, false);
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

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: 500 * (1 - progress.value) }],
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

  const glassBg = isDark
    ? "rgba(15, 27, 45, 0.94)"
    : "rgba(255, 255, 255, 0.96)";

  const sheetBg = glass ? glassBg : colors.surface;
  const borderColor = glass
    ? isDark
      ? "rgba(248, 250, 252, 0.20)"
      : "rgba(15, 23, 42, 0.14)"
    : colors.border;

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
            backgroundColor: isDark
              ? "rgba(0, 0, 0, 0.78)"
              : "rgba(15, 23, 42, 0.65)",
            justifyContent: "flex-end",
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

        <Animated.View style={[{ width: "100%" }, animated ? sheetAnimatedStyle : undefined]}>
          <View
            style={[
              {
                width: "100%",
                backgroundColor: sheetBg,
                borderTopLeftRadius: radii.xxl,
                borderTopRightRadius: radii.xxl,
                borderWidth: components.borderWidth.strong,
                borderBottomWidth: 0,
                borderColor,
                paddingHorizontal: spacing.xl,
                paddingTop: spacing.sm,
                paddingBottom: spacing.lg + bottomInset,
                gap: spacing.lg,
                elevation: 0,
              },
              style,
            ]}
          >
            {/* Top Handle Drag Bar */}
            <View style={{ alignItems: "center", width: "100%", paddingVertical: spacing.xs }}>
              <View
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: radii.full,
                  backgroundColor: colors.border,
                }}
              />
            </View>

            {/* Header with Title & Close Button */}
            {title || description || onClose ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: spacing.md,
                }}
              >
                <View style={[{ flex: 1, gap: spacing.xxs }, contentStyle]}>
                  {title ? (
                    typeof title === "string" ? (
                      <Text variant="h3" weight="700" style={titleStyle}>
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
                        style={[{ lineHeight: 20 }, descriptionStyle]}
                      >
                        {description}
                      </Text>
                    ) : (
                      description
                    )
                  ) : null}
                </View>

                {onClose ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Close sheet"
                    onPress={requestClose}
                    hitSlop={12}
                    style={({ pressed }) => ({
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: pressed ? colors.backgroundMuted : "transparent",
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
              </View>
            ) : null}

            {/* Main Sheet Body */}
            {children ? <View style={{ width: "100%" }}>{children}</View> : null}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

export const SheetContent = View;

export interface SheetHeaderProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export function SheetHeader({ style, children }: SheetHeaderProps) {
  const { spacing } = useTheme();
  return <View style={[{ gap: spacing.xs }, style]}>{children}</View>;
}

export interface SheetTitleProps {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export function SheetTitle({ children, style }: SheetTitleProps) {
  return (
    <Text variant="h3" weight="700" color="text" style={style}>
      {children}
    </Text>
  );
}

export interface SheetDescriptionProps {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export function SheetDescription({ children, style }: SheetDescriptionProps) {
  return (
    <Text variant="bodySmall" color="textMuted" style={style}>
      {children}
    </Text>
  );
}

export interface SheetFooterProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export function SheetFooter({ style, children }: SheetFooterProps) {
  const { spacing } = useTheme();
  return (
    <View
      style={[
        {
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: spacing.sm,
          marginTop: spacing.md,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
