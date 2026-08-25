import React, { useEffect } from "react";
import {
  PanResponder,
  Pressable,
  StatusBar,
  View,
  type GestureResponderEvent,
  type PanResponderGestureState,
  type StyleProp,
  type TextStyle,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";

import { useTheme } from "../theme";
import { triggerHaptic } from "../utils/haptics";
import { Button } from "./Button";
import { Progress } from "./Progress";
import { Text } from "./Text";
import { renderIcon, type RenderIcon, type ComponentTone } from "./types";

export type ToastTone = "default" | "success" | "warning" | "danger" | "info";
export type ToastVariant = "solid" | "outlined" | "flat" | "subtle";
export type ToastPlacement = "top" | "bottom";

export interface ToastAction {
  label: string;
  onPress: () => void;
}

export interface ToastOptions {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  tone?: ToastTone;
  variant?: ToastVariant;
  icon?: RenderIcon;
  media?: React.ReactNode;
  banner?: React.ReactNode;
  progress?: number;
  content?: React.ReactNode;
  closeIcon?: RenderIcon;
  action?: ToastAction;
  duration?: number;
}

export interface ToastRecord extends Required<Pick<ToastOptions, "id">> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  tone: ToastTone;
  variant: ToastVariant;
  icon?: RenderIcon;
  media?: React.ReactNode;
  banner?: React.ReactNode;
  progress?: number;
  content?: React.ReactNode;
  closeIcon?: RenderIcon;
  action?: ToastAction;
  duration: number;
  open: boolean;
}

export interface ToastContextValue {
  show: (options: ToastOptions) => string;
  dismiss: (id?: string) => void;
  update: (id: string, options: Omit<ToastOptions, "id">) => void;
}

export const ToastContext = React.createContext<ToastContextValue | null>(null);

interface ToastItemContextValue {
  isSolid: boolean;
  tone: { base: string; soft: string };
}

const ToastItemContext = React.createContext<ToastItemContextValue>({
  isSolid: true,
  tone: { base: "#6366F1", soft: "rgba(99, 102, 241, 0.15)" },
});

export interface ToastProviderProps {
  children: React.ReactNode;
  placement?: ToastPlacement;
  variant?: ToastVariant;
  offset?: number;
  duration?: number;
  maxToasts?: number;
  swipeToDismiss?: boolean;
  renderToast?: (
    toast: ToastRecord,
    controls: ToastContextValue,
  ) => React.ReactNode;
  viewportStyle?: StyleProp<ViewStyle>;
}

function createToastId() {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function ToastProvider({
  children,
  placement = "top",
  variant: defaultVariant = "subtle",
  offset,
  duration = 3500,
  maxToasts = 7,
  swipeToDismiss = true,
  renderToast,
  viewportStyle,
}: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastRecord[]>([]);
  const [expanded, setExpanded] = React.useState(false);
  const timers = React.useRef(new Map<string, ReturnType<typeof setTimeout>>());

  // Auto-collapse when only 1 or 0 toasts remain
  React.useEffect(() => {
    if (toasts.length <= 1) {
      setExpanded(false);
    }
  }, [toasts.length]);

  const handleToggleExpand = React.useCallback(() => {
    triggerHaptic("selection");
    setExpanded((prev) => !prev);
  }, []);

  const clearTimer = React.useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const remove = React.useCallback(
    (id: string) => {
      clearTimer(id);
      setToasts((current) => current.filter((toast) => toast.id !== id));
    },
    [clearTimer],
  );

  const dismiss = React.useCallback(
    (id?: string) => {
      setToasts((current) =>
        current.map((toast) => {
          if (id && toast.id !== id) return toast;
          clearTimer(toast.id);
          return { ...toast, open: false };
        }),
      );
    },
    [clearTimer],
  );

  const scheduleDismiss = React.useCallback(
    (toast: ToastRecord) => {
      clearTimer(toast.id);
      if (toast.duration <= 0) return;

      const timer = setTimeout(() => dismiss(toast.id), toast.duration);
      timers.current.set(toast.id, timer);
    },
    [clearTimer, dismiss],
  );

  const show = React.useCallback(
    (options: ToastOptions) => {
      triggerHaptic("medium");
      const id = options.id ?? createToastId();
      const nextToast: ToastRecord = {
        ...options,
        id,
        tone: options.tone ?? "default",
        variant: options.variant ?? defaultVariant,
        duration: options.duration ?? duration,
        open: true,
      };

      setToasts((current) => {
        const withoutDuplicate = current.filter((toast) => toast.id !== id);
        const next =
          placement === "top"
            ? [nextToast, ...withoutDuplicate]
            : [...withoutDuplicate, nextToast];

        return placement === "top"
          ? next.slice(0, maxToasts)
          : next.slice(-maxToasts);
      });
      scheduleDismiss(nextToast);

      return id;
    },
    [defaultVariant, duration, maxToasts, placement, scheduleDismiss],
  );

  const update = React.useCallback(
    (id: string, options: Omit<ToastOptions, "id">) => {
      triggerHaptic("selection");
      setToasts((current) =>
        current.map((toast) => {
          if (toast.id !== id) return toast;
          const nextToast = {
            ...toast,
            ...options,
            duration: options.duration ?? toast.duration,
            open: true,
          };
          scheduleDismiss(nextToast);
          return nextToast;
        }),
      );
    },
    [scheduleDismiss],
  );

  React.useEffect(
    () => () => {
      timers.current.forEach((timer) => clearTimeout(timer));
      timers.current.clear();
    },
    [],
  );

  const controls = React.useMemo<ToastContextValue>(
    () => ({ show, dismiss, update }),
    [dismiss, show, update],
  );

  return (
    <ToastContext.Provider value={controls}>
      <View style={{ flex: 1 }}>
        {children}
        <ToastViewport
          placement={placement}
          offset={offset}
          style={viewportStyle}
        >
          {toasts.map((toast, index) =>
            renderToast ? (
              <React.Fragment key={toast.id}>
                {renderToast(toast, controls)}
              </React.Fragment>
            ) : (
              <Toast
                key={toast.id}
                toast={toast}
                index={index}
                totalToasts={toasts.length}
                expanded={expanded}
                onToggleExpand={toasts.length > 1 ? handleToggleExpand : undefined}
                placement={placement}
                swipeToDismiss={swipeToDismiss}
                onDismiss={() => dismiss(toast.id)}
                onCloseComplete={() => remove(toast.id)}
              />
            ),
          )}
        </ToastViewport>
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

export interface ToastViewportProps extends ViewProps {
  placement?: ToastPlacement;
  offset?: number;
  style?: StyleProp<ViewStyle>;
}

export function ToastViewport({
  placement = "top",
  offset,
  style,
  ...props
}: ToastViewportProps) {
  const { spacing } = useTheme();
  const insets = useSafeAreaInsets();

  const resolvedOffset =
    offset ??
    (placement === "top"
      ? Math.max(insets.top, StatusBar.currentHeight ?? 0) + spacing.md
      : Math.max(insets.bottom, 0) + spacing.md);

  return (
    <View
      pointerEvents="box-none"
      style={[
        {
          position: "absolute",
          left: spacing.lg,
          right: spacing.lg,
          top: placement === "top" ? resolvedOffset : undefined,
          bottom: placement === "bottom" ? resolvedOffset : undefined,
          zIndex: 9999,
        },
        style,
      ]}
      {...props}
    />
  );
}

export interface ToastProps extends ViewProps {
  toast: ToastRecord;
  index?: number;
  totalToasts?: number;
  expanded?: boolean;
  onToggleExpand?: () => void;
  placement?: ToastPlacement;
  swipeToDismiss?: boolean;
  onDismiss?: () => void;
  onCloseComplete?: () => void;
  style?: StyleProp<ViewStyle>;
}

function getToastTone(
  tone: ToastTone,
  colors: ReturnType<typeof useTheme>["colors"],
) {
  if (tone === "success")
    return { base: colors.success, soft: colors.successSoft };
  if (tone === "warning")
    return { base: colors.warning, soft: colors.warningSoft };
  if (tone === "danger")
    return { base: colors.danger, soft: colors.dangerSoft };
  if (tone === "info") return { base: colors.info, soft: colors.infoSoft };
  return { base: colors.primary, soft: colors.surfaceMuted };
}

function DefaultToastToneIcon({
  tone,
  color,
  isSolid,
}: {
  tone: ToastTone;
  color: string;
  isSolid?: boolean;
}) {
  const iconColor = isSolid ? "#FFFFFF" : color;

  if (tone === "success") {
    return (
      <Svg
        width={18}
        height={18}
        viewBox="0 0 24 24"
        fill="none"
        stroke={iconColor}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <Path d="M22 4L12 14.01l-3-3" />
      </Svg>
    );
  }

  if (tone === "danger") {
    return (
      <Svg
        width={18}
        height={18}
        viewBox="0 0 24 24"
        fill="none"
        stroke={iconColor}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Circle cx={12} cy={12} r={10} />
        <Path d="M12 8v4" />
        <Path d="M12 16h.01" />
      </Svg>
    );
  }

  if (tone === "warning") {
    return (
      <Svg
        width={18}
        height={18}
        viewBox="0 0 24 24"
        fill="none"
        stroke={iconColor}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <Path d="M12 9v4" />
        <Path d="M12 17h.01" />
      </Svg>
    );
  }

  return (
    <Svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke={iconColor}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Circle cx={12} cy={12} r={10} />
      <Path d="M12 16v-4" />
      <Path d="M12 8h.01" />
    </Svg>
  );
}

export function Toast({
  toast,
  index = 0,
  totalToasts = 1,
  expanded = false,
  onToggleExpand,
  placement = "top",
  swipeToDismiss = true,
  onDismiss,
  onCloseComplete,
  style,
  ...props
}: ToastProps) {
  const { colors, radii, spacing, isDark } = useTheme();
  const progress = useSharedValue(0);
  const translateX = useSharedValue(0);
  const rotateValue = useSharedValue(0);
  const [toastHeight, setToastHeight] = React.useState(76);

  const targetScale = expanded ? 1.0 : Math.max(0.86, 1 - index * 0.05);
  const targetOffset = expanded
    ? index * (toastHeight + spacing.sm) * (placement === "top" ? 1 : -1)
    : index * 10 * (placement === "top" ? 1 : -1);

  const animatedScale = useSharedValue(targetScale);
  const animatedOffset = useSharedValue(targetOffset);

  useEffect(() => {
    animatedScale.value = withTiming(targetScale, {
      duration: 240,
      easing: Easing.out(Easing.quad),
    });
    animatedOffset.value = withTiming(targetOffset, {
      duration: 240,
      easing: Easing.out(Easing.quad),
    });
  }, [animatedOffset, animatedScale, targetOffset, targetScale]);

  const tone = getToastTone(toast.tone, colors);
  const isAsyncLoading = toast.duration === 0;

  useEffect(() => {
    progress.value = withTiming(
      toast.open ? 1 : 0,
      { duration: 220, easing: Easing.out(Easing.quad) },
      (finished) => {
        if (finished && !toast.open) {
          if (onCloseComplete) {
            scheduleOnRN(onCloseComplete);
          }
        }
      },
    );
  }, [onCloseComplete, progress, toast.open]);

  // Smooth continuous icon rotation during async loading
  useEffect(() => {
    if (isAsyncLoading) {
      rotateValue.value = withRepeat(
        withTiming(360, { duration: 900, easing: Easing.linear }),
        -1,
        false,
      );
    } else {
      cancelAnimation(rotateValue);
      rotateValue.value = withTiming(0, { duration: 180 });
    }
  }, [isAsyncLoading, rotateValue]);

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (
          _event: GestureResponderEvent,
          gesture: PanResponderGestureState,
        ) => {
          const isHorizontal =
            Math.abs(gesture.dx) > Math.abs(gesture.dy) &&
            Math.abs(gesture.dx) > 8;
          const isVertical =
            Math.abs(gesture.dy) > Math.abs(gesture.dx) &&
            Math.abs(gesture.dy) > 8;

          return (
            (swipeToDismiss && (!expanded || index === 0) && isHorizontal) ||
            (Boolean(onToggleExpand) && isVertical)
          );
        },
        onPanResponderMove: (_event, gesture) => {
          if (Math.abs(gesture.dx) > Math.abs(gesture.dy)) {
            translateX.value = gesture.dx;
          }
        },
        onPanResponderRelease: (_event, gesture) => {
          // 1. Horizontal swipe to dismiss
          if (
            swipeToDismiss &&
            (!expanded || index === 0) &&
            Math.abs(gesture.dx) > 72 &&
            Math.abs(gesture.dx) > Math.abs(gesture.dy)
          ) {
            translateX.value = withTiming(
              gesture.dx > 0 ? 420 : -420,
              { duration: 160, easing: Easing.out(Easing.quad) },
              (finished) => {
                if (finished && onDismiss) {
                  scheduleOnRN(onDismiss);
                }
              },
            );
            return;
          }

          // Reset horizontal translation
          translateX.value = withTiming(0, {
            duration: 180,
            easing: Easing.out(Easing.quad),
          });

          // 2. Vertical drag to expand / collapse
          if (onToggleExpand && Math.abs(gesture.dy) > 20) {
            const isTop = placement === "top";
            const isSwipeDown = gesture.dy > 20;
            const isSwipeUp = gesture.dy < -20;

            if (!expanded && (isTop ? isSwipeDown : isSwipeUp)) {
              onToggleExpand();
            } else if (expanded && (isTop ? isSwipeUp : isSwipeDown)) {
              onToggleExpand();
            }
          }
        },
      }),
    [expanded, index, onDismiss, onToggleExpand, placement, swipeToDismiss, translateX],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value * (expanded ? 1.0 : Math.max(0.7, 1 - index * 0.12)),
    transform: [
      {
        translateY:
          (placement === "top" ? -24 : 24) * (1 - progress.value) +
          animatedOffset.value,
      },
      { translateX: translateX.value },
      { scale: animatedScale.value },
    ],
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateValue.value}deg` }],
  }));

  const isSolid = toast.variant === "solid";
  const isFlat = toast.variant === "flat";
  const isOutlined = toast.variant === "outlined";

  const surfaceBg = isDark ? colors.surfaceRaised : colors.surface;

  const containerBg = isSolid ? tone.base : surfaceBg;

  const borderColor = isFlat
    ? "transparent"
    : isOutlined
      ? tone.base
      : isSolid
        ? "transparent"
        : colors.border;

  const borderWidth = isFlat || isSolid ? 0 : isOutlined ? 1.5 : 1;

  const itemContextValue = React.useMemo(
    () => ({ isSolid, tone }),
    [isSolid, tone],
  );

  return (
    <ToastItemContext.Provider value={itemContextValue}>
      <Animated.View
        accessibilityRole="alert"
        style={[
          {
            width: "100%",
            position: index === 0 && !expanded ? "relative" : "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100 - index,
            borderRadius: radii.xl,
            borderWidth,
            borderColor,
            backgroundColor: containerBg,
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.lg,
            flexDirection: "row",
            gap: spacing.md,
            alignItems: toast.banner ? "flex-start" : "center",
          },
          animatedStyle,
          style,
        ]}
        onLayout={(event) => {
          const layoutHeight = event.nativeEvent.layout.height;
          if (layoutHeight > 0 && Math.abs(layoutHeight - toastHeight) > 2) {
            setToastHeight(layoutHeight);
          }
        }}
        {...(swipeToDismiss && (!expanded || index === 0) ? panResponder.panHandlers : {})}
        {...props}
      >
        {toast.media ? (
          <View style={{ marginRight: 2 }}>{toast.media}</View>
        ) : (
          <Animated.View
            style={[
              {
                width: 34,
                height: 34,
                borderRadius: radii.lg,
                backgroundColor: isSolid
                  ? "rgba(255, 255, 255, 0.22)"
                  : tone.soft,
                alignItems: "center",
                justifyContent: "center",
              },
              isAsyncLoading ? animatedIconStyle : undefined,
            ]}
          >
            {toast.icon ? (
              renderIcon(toast.icon, isSolid ? "#FFFFFF" : tone.base, 18)
            ) : (
              <DefaultToastToneIcon
                tone={toast.tone}
                color={tone.base}
                isSolid={isSolid}
              />
            )}
          </Animated.View>
        )}

        <ToastContent onPress={onToggleExpand}>
          {toast.title ? <ToastTitle>{toast.title}</ToastTitle> : null}
          {toast.description ? (
            <ToastDescription>{toast.description}</ToastDescription>
          ) : null}
          {toast.banner ? (
            <View style={{ marginTop: spacing.xs, width: "100%" }}>
              {toast.banner}
            </View>
          ) : null}
          {typeof toast.progress === "number" ? (
            <View style={{ marginTop: 6, width: "100%" }}>
              <Progress
                value={Math.min(100, Math.max(0, toast.progress))}
                tone={
                  toast.tone === "default"
                    ? "primary"
                    : (toast.tone as ComponentTone)
                }
                size="xs"
                style={{ height: 4 }}
              />
            </View>
          ) : null}
          {toast.content}
        </ToastContent>

        {toast.action ? (
          <ToastAction
            label={toast.action.label}
            onPress={() => {
              triggerHaptic("selection");
              toast.action?.onPress();
              onDismiss?.();
            }}
          />
        ) : null}

        <ToastClose onPress={onDismiss} icon={toast.closeIcon} />
      </Animated.View>
    </ToastItemContext.Provider>
  );
}

export interface ToastContentProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export function ToastContent({ style, onPress, ...props }: ToastContentProps) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={[
          {
            flex: 1,
            gap: 2,
          },
          style,
        ]}
        {...props}
      />
    );
  }

  return (
    <View
      style={[
        {
          flex: 1,
          gap: 2,
        },
        style,
      ]}
      {...props}
    />
  );
}

export interface ToastTitleProps {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export function ToastTitle({ children, style }: ToastTitleProps) {
  const { colors } = useTheme();
  const { isSolid } = React.useContext(ToastItemContext);
  if (typeof children !== "string") return <>{children}</>;

  return (
    <Text
      variant="label"
      weight="700"
      style={[
        {
          color: isSolid ? colors.onPrimary : colors.text,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export interface ToastDescriptionProps {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export function ToastDescription({ children, style }: ToastDescriptionProps) {
  const { colors } = useTheme();
  const { isSolid } = React.useContext(ToastItemContext);
  if (typeof children !== "string") return <>{children}</>;

  return (
    <Text
      variant="bodySmall"
      style={[
        {
          lineHeight: 18,
          color: isSolid ? "rgba(255, 255, 255, 0.92)" : colors.textMuted,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export interface ToastActionProps {
  label: string;
  onPress?: () => void;
}

export function ToastAction({ label, onPress }: ToastActionProps) {
  const { isSolid } = React.useContext(ToastItemContext);

  return (
    <Button
      size="xs"
      variant={isSolid ? "filled" : "outline"}
      tone="primary"
      onPress={onPress}
      style={isSolid ? { backgroundColor: "rgba(255, 255, 255, 0.25)" } : undefined}
    >
      {label}
    </Button>
  );
}

export interface ToastCloseProps {
  onPress?: () => void;
  icon?: RenderIcon;
}

export function ToastClose({ onPress, icon }: ToastCloseProps) {
  const { colors } = useTheme();
  const { isSolid } = React.useContext(ToastItemContext);

  const handleClose = () => {
    triggerHaptic("selection");
    onPress?.();
  };

  const closeColor = isSolid ? colors.onPrimary : colors.textMuted;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Close toast"
      onPress={handleClose}
      hitSlop={8}
      style={({ pressed }) => ({
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: pressed
          ? isSolid
            ? "rgba(255, 255, 255, 0.2)"
            : colors.backgroundMuted
          : "transparent",
        opacity: pressed ? 0.72 : 0.9,
      })}
    >
      {icon ? (
        renderIcon(icon, closeColor, 16)
      ) : (
        <Text
          style={{
            color: closeColor,
            fontSize: 14,
            fontWeight: "600",
          }}
        >
          ✕
        </Text>
      )}
    </Pressable>
  );
}
