import React from "react";
import {
  Animated,
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

import { useTheme } from "../theme";
import { Button } from "./Button";
import { Text } from "./Text";
import { renderIcon, type RenderIcon } from "./types";

export type ToastTone = "default" | "success" | "warning" | "danger" | "info";
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
  icon?: RenderIcon;
  closeIcon?: RenderIcon;
  action?: ToastAction;
  duration?: number;
}

export interface ToastRecord extends Required<Pick<ToastOptions, "id">> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  tone: ToastTone;
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
  placement = "top",
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
      const id = options.id ?? createToastId();
      const nextToast: ToastRecord = {
        ...options,
        id,
        tone: options.tone ?? "default",
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
  placement = "top",
  offset,
  style,
  ...props
}: ToastViewportProps) {
  const { spacing } = useTheme();
  const defaultOffset =
    Platform.OS === "android"
      ? placement === "top"
        ? (StatusBar.currentHeight ?? 0) + spacing.lg
        : spacing.xxxl + spacing.lg
      : spacing.xxl;
  const resolvedOffset = offset ?? defaultOffset;

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
          zIndex: 1000,
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
  return { base: colors.primary, soft: colors.surface };
}

export function Toast({
  toast,
  placement = "top",
  swipeToDismiss = true,
  onDismiss,
  onCloseComplete,
  style,
  ...props
}: ToastProps) {
  const { colors, components, radii, spacing } = useTheme();
  const progress = React.useRef(new Animated.Value(0)).current;
  const translateX = React.useRef(new Animated.Value(0)).current;
  const tone = getToastTone(toast.tone, colors);

  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: toast.open ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !toast.open) {
        onCloseComplete?.();
      }
    });
  }, [onCloseComplete, progress, toast.open]);

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
        onPanResponderMove: Animated.event([null, { dx: translateX }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (_event, gesture) => {
          if (Math.abs(gesture.dx) > 72) {
            Animated.timing(translateX, {
              toValue: gesture.dx > 0 ? 420 : -420,
              duration: 160,
              useNativeDriver: true,
            }).start(() => onDismiss?.());
            return;
          }

          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 180,
            friction: 16,
          }).start();
        },
      }),
    [onDismiss, swipeToDismiss, translateX],
  );

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [placement === "top" ? -14 : 14, 0],
  });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{
        opacity: progress,
        transform: [{ translateY }, { translateX }],
      }}
      {...(swipeToDismiss ? panResponder.panHandlers : {})}
    >
      <View
        accessibilityRole="alert"
        style={[
          {
            width: "100%",
            borderRadius: radii.xl,
            borderWidth: components.borderWidth.strong,
            borderColor: tone.base,
            backgroundColor: colors.surface,
            padding: spacing.md,
            flexDirection: "row",
            gap: spacing.md,
            alignItems: "flex-start",
          },
          style,
        ]}
        {...props}
      >
        {toast.icon ? (
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: radii.lg,
              backgroundColor: tone.soft,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {renderIcon(toast.icon, tone.base, 18)}
          </View>
        ) : null}

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
          gap: spacing.xs,
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
    <Text variant="label" color="text" style={style}>
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
    <Text variant="bodySmall" color="textMuted" style={style}>
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
    <Button size="xs" variant="outline" tone="secondary" onPress={onPress}>
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

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Close toast"
      onPress={onPress}
      style={({ pressed }) => ({
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        opacity: pressed ? 0.72 : 1,
      })}
    >
      {icon ? (
        renderIcon(icon, colors.textMuted, 16)
      ) : (
        <Text variant="label" color="textMuted">
          x
        </Text>
      )}
    </Pressable>
  );
}
