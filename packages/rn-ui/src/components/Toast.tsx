import React, { useEffect } from "react";
import {
  PanResponder,
  Platform,
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
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../theme";
import { triggerHaptic } from "../utils/haptics";
import { Button } from "./Button";
import { Text } from "./Text";
import { renderIcon, type RenderIcon } from "./types";

export type ToastTone = "default" | "success" | "warning" | "danger" | "info";
export type ToastVariant = "outlined" | "flat" | "subtle";
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

export interface ToastProviderProps {
  children: React.ReactNode;
  placement?: ToastPlacement;
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
  placement = "bottom",
  offset,
  duration = 3500,
  maxToasts = 3,
  swipeToDismiss = true,
  renderToast,
  viewportStyle,
}: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastRecord[]>([]);
  const timers = React.useRef(new Map<string, ReturnType<typeof setTimeout>>());

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
        variant: options.variant ?? "outlined",
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
    [duration, maxToasts, placement, scheduleDismiss],
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
          {toasts.map((toast) =>
            renderToast ? (
              <React.Fragment key={toast.id}>
                {renderToast(toast, controls)}
              </React.Fragment>
            ) : (
              <Toast
                key={toast.id}
                toast={toast}
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
  placement = "bottom",
  offset,
  style,
  ...props
}: ToastViewportProps) {
  const { spacing } = useTheme();
  const insets = useSafeAreaInsets();

  const resolvedOffset =
    offset ??
    (placement === "top"
      ? Platform.OS === "android"
        ? (StatusBar.currentHeight ?? 0) + spacing.md
        : insets.top + spacing.md
      : insets.bottom + spacing.md);

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
          gap: spacing.sm,
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

function DefaultToastToneIcon({ tone, color }: { tone: ToastTone; color: string }) {
  if (tone === "success") {
    return (
      <View
        style={{
          width: 18,
          height: 18,
          borderRadius: 9,
          borderWidth: 2,
          borderColor: color,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: 7,
            height: 4,
            borderLeftWidth: 2,
            borderBottomWidth: 2,
            borderColor: color,
            transform: [{ rotate: "-45deg" }],
            marginBottom: 1,
          }}
        />
      </View>
    );
  }

  if (tone === "danger" || tone === "warning") {
    return (
      <View
        style={{
          width: 18,
          height: 18,
          borderRadius: 9,
          borderWidth: 2,
          borderColor: color,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color, fontSize: 11, fontWeight: "900", lineHeight: 13 }}>!</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: color,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color, fontSize: 11, fontWeight: "900", lineHeight: 13 }}>i</Text>
    </View>
  );
}

export function Toast({
  toast,
  placement = "bottom",
  swipeToDismiss = true,
  onDismiss,
  onCloseComplete,
  style,
  ...props
}: ToastProps) {
  const { colors, components, radii, spacing, isDark } = useTheme();
  const progress = useSharedValue(0);
  const translateX = useSharedValue(0);
  const rotateValue = useSharedValue(0);

  const tone = getToastTone(toast.tone, colors);
  const isAsyncLoading = toast.duration === 0;

  useEffect(() => {
    progress.value = withTiming(
      toast.open ? 1 : 0,
      { duration: 220, easing: Easing.out(Easing.quad) },
      (finished) => {
        if (finished && !toast.open) {
          if (onCloseComplete) {
            runOnJS(onCloseComplete)();
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
        ) =>
          swipeToDismiss &&
          Math.abs(gesture.dx) > 8 &&
          Math.abs(gesture.dx) > Math.abs(gesture.dy),
        onPanResponderMove: (_event, gesture) => {
          translateX.value = gesture.dx;
        },
        onPanResponderRelease: (_event, gesture) => {
          if (Math.abs(gesture.dx) > 72) {
            translateX.value = withTiming(
              gesture.dx > 0 ? 420 : -420,
              { duration: 160, easing: Easing.out(Easing.quad) },
              (finished) => {
                if (finished && onDismiss) {
                  runOnJS(onDismiss)();
                }
              },
            );
            return;
          }

          translateX.value = withTiming(0, {
            duration: 180,
            easing: Easing.out(Easing.quad),
          });
        },
      }),
    [onDismiss, swipeToDismiss, translateX],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: (placement === "top" ? -16 : 16) * (1 - progress.value) },
      { translateX: translateX.value },
    ],
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateValue.value}deg` }],
  }));

  const isFlat = toast.variant === "flat";
  const isSubtle = toast.variant === "subtle";

  const containerBg = isFlat
    ? tone.soft
    : isSubtle
      ? tone.soft
      : isDark
        ? "#0A1C26"
        : colors.surface;

  const borderColor = isFlat
    ? "transparent"
    : isSubtle
      ? colors.border
      : tone.base;

  const borderWidth = isFlat ? 0 : components.borderWidth.strong;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={animatedStyle}
      {...(swipeToDismiss ? panResponder.panHandlers : {})}
    >
      <View
        accessibilityRole="alert"
        style={[
          {
            width: "100%",
            borderRadius: radii.xl,
            borderWidth,
            borderColor,
            backgroundColor: containerBg,
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.lg,
            flexDirection: "row",
            gap: spacing.md,
            alignItems: "center",
            elevation: 0,
          },
          style,
        ]}
        {...props}
      >
        <Animated.View
          style={[
            {
              width: 34,
              height: 34,
              borderRadius: radii.lg,
              backgroundColor: isFlat
                ? isDark
                  ? "rgba(0,0,0,0.2)"
                  : "rgba(255,255,255,0.7)"
                : tone.soft,
              alignItems: "center",
              justifyContent: "center",
            },
            isAsyncLoading ? animatedIconStyle : undefined,
          ]}
        >
          {toast.icon ? (
            renderIcon(toast.icon, tone.base, 18)
          ) : (
            <DefaultToastToneIcon tone={toast.tone} color={tone.base} />
          )}
        </Animated.View>

        <ToastContent>
          {toast.title ? <ToastTitle>{toast.title}</ToastTitle> : null}
          {toast.description ? (
            <ToastDescription>{toast.description}</ToastDescription>
          ) : null}
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
      </View>
    </Animated.View>
  );
}

export interface ToastContentProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export function ToastContent({ style, ...props }: ToastContentProps) {
  const { spacing } = useTheme();

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
  if (typeof children !== "string") return <>{children}</>;

  return (
    <Text variant="label" weight="700" color="text" style={style}>
      {children}
    </Text>
  );
}

export interface ToastDescriptionProps {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export function ToastDescription({ children, style }: ToastDescriptionProps) {
  if (typeof children !== "string") return <>{children}</>;

  return (
    <Text variant="bodySmall" color="textMuted" style={[{ lineHeight: 18 }, style]}>
      {children}
    </Text>
  );
}

export interface ToastActionProps {
  label: string;
  onPress?: () => void;
}

export function ToastAction({ label, onPress }: ToastActionProps) {
  return (
    <Button size="xs" variant="outline" tone="primary" onPress={onPress}>
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

  const handleClose = () => {
    triggerHaptic("selection");
    onPress?.();
  };

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
        backgroundColor: pressed ? colors.backgroundMuted : "transparent",
        opacity: pressed ? 0.72 : 0.8,
      })}
    >
      {icon ? (
        renderIcon(icon, colors.textMuted, 16)
      ) : (
        <Text style={{ color: colors.textMuted, fontSize: 14, fontWeight: "600" }}>
          ✕
        </Text>
      )}
    </Pressable>
  );
}
