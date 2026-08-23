import React from "react";
import {
  Modal,
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../theme";
import { triggerHaptic } from "../utils/haptics";

export interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

export function Popover({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const currentOpen = open ?? internalOpen;

  const setOpen = (next: boolean) => {
    if (open === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <PopoverContext.Provider value={{ open: currentOpen, setOpen }}>
      {children}
    </PopoverContext.Provider>
  );
}

export interface PopoverTriggerProps extends PressableProps {
  triggerMode?: "press" | "longPress";
}

export function PopoverTrigger({
  children,
  triggerMode = "press",
  onPress,
  onLongPress,
  style,
  ...props
}: PopoverTriggerProps) {
  const context = React.useContext(PopoverContext);

  const handlePress = (event: any) => {
    triggerHaptic("selection");
    context?.setOpen(!context.open);
    onPress?.(event);
  };

  const handleLongPress = (event: any) => {
    triggerHaptic("selection");
    context?.setOpen(!context.open);
    onLongPress?.(event);
  };

  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: (e: any) => {
        handlePress(e);
        (children.props as any)?.onPress?.(e);
      },
      onLongPress: (e: any) => {
        handleLongPress(e);
        (children.props as any)?.onLongPress?.(e);
      },
    });
  }

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      style={style}
      {...props}
    >
      {children}
    </Pressable>
  );
}

export interface PopoverContentProps {
  children?: React.ReactNode;
  width?: number;
  style?: StyleProp<ViewStyle>;
}

export function PopoverContent({
  children,
  width = 300,
  style,
}: PopoverContentProps) {
  const context = React.useContext(PopoverContext);
  const { colors, components, radii, spacing, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const progress = useSharedValue(0);

  React.useEffect(() => {
    if (context?.open) {
      triggerHaptic("medium");
      progress.value = withTiming(1, { duration: 180, easing: Easing.out(Easing.quad) });
    } else {
      progress.value = withTiming(0, { duration: 140, easing: Easing.in(Easing.quad) });
    }
  }, [context?.open, progress]);

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const animatedCardStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.92 + 0.08 * progress.value }],
  }));

  if (!context?.open) return null;

  return (
    <Modal
      visible={context.open}
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      hardwareAccelerated
      onRequestClose={() => context.setOpen(false)}
    >
      <Animated.View
        style={[
          {
            flex: 1,
            backgroundColor: isDark ? "rgba(0,0,0,0.72)" : "rgba(15,23,42,0.55)",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: spacing.xl,
            paddingBottom: insets.bottom,
          },
          animatedOverlayStyle,
        ]}
      >
        <Pressable
          accessibilityRole="button"
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
          onPress={() => {
            triggerHaptic("selection");
            context.setOpen(false);
          }}
        />

        <Animated.View
          style={[
            {
              width,
              maxWidth: "100%",
              borderRadius: radii.xl,
              borderWidth: components.borderWidth.strong,
              borderColor: colors.border,
              backgroundColor: colors.surface,
              padding: spacing.xl,
              elevation: 0,
            },
            animatedCardStyle,
            style,
          ]}
        >
          {children}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
