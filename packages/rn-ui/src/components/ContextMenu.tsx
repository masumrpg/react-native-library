import React from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type ModalProps,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useTheme, type ThemeColors } from "../theme";
import { Text } from "./Text";
import { renderIcon, type RenderIcon } from "./types";

export interface ContextMenuProps {
  children?: React.ReactNode;
}

export interface ContextMenuContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerLayout: {
    pageX: number;
    pageY: number;
    width: number;
    height: number;
  };
  setTriggerLayout: (layout: any) => void;
  colors: ThemeColors;
}

const ContextMenuContext = React.createContext<ContextMenuContextProps | null>(
  null,
);

export function useContextMenu() {
  const context = React.useContext(ContextMenuContext);
  if (!context) {
    throw new Error("useContextMenu must be used within a <ContextMenu />");
  }
  return context;
}

export function ContextMenu({ children }: ContextMenuProps) {
  const { colors } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [triggerLayout, setTriggerLayout] = React.useState({
    pageX: 0,
    pageY: 0,
    width: 0,
    height: 0,
  });

  return (
    <ContextMenuContext.Provider
      value={{
        open,
        setOpen,
        triggerLayout,
        setTriggerLayout,
        colors,
      }}
    >
      <View style={{ width: "100%" }}>{children}</View>
    </ContextMenuContext.Provider>
  );
}

export interface ContextMenuTriggerProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export function ContextMenuTrigger({
  children,
  style,
  disabled = false,
}: ContextMenuTriggerProps) {
  const { setOpen, setTriggerLayout } = useContextMenu();
  const triggerRef = React.useRef<any>(null);

  const handleLongPress = () => {
    if (!disabled) {
      triggerRef.current?.measureInWindow(
        (x: number, y: number, width: number, height: number) => {
          if (width > 0 && height > 0) {
            setTriggerLayout({ pageX: x, pageY: y, width, height });
            setOpen(true);
          }
        },
      );
    }
  };

  return (
    <Pressable
      ref={triggerRef}
      onLongPress={handleLongPress}
      delayLongPress={500} // Standard Android/iOS long press timing
      style={style}
    >
      {children}
    </Pressable>
  );
}

export interface ContextMenuContentProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  overlayStyle?: StyleProp<ViewStyle>;
  modalProps?: Omit<
    ModalProps,
    "visible" | "transparent" | "animationType" | "onRequestClose"
  >;
  width?: number;
}

export function ContextMenuContent({
  children,
  style,
  overlayStyle,
  modalProps,
  width = 180,
}: ContextMenuContentProps) {
  const { open, setOpen, triggerLayout, colors } = useContextMenu();
  const { components, radii, spacing } = useTheme();
  const progress = useSharedValue(open ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(open ? 1 : 0, { duration: 150 });
  }, [open, progress]);

  const { height: SCREEN_HEIGHT } = Dimensions.get("window");
  const dropdownMaxHeight = 280;
  const spaceBelow =
    SCREEN_HEIGHT - (triggerLayout.pageY + triggerLayout.height);
  const renderAbove = spaceBelow < dropdownMaxHeight + 40;

  const positionStyle = renderAbove
    ? { bottom: SCREEN_HEIGHT - triggerLayout.pageY + 6 }
    : { top: triggerLayout.pageY + triggerLayout.height + 6 };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (renderAbove ? 8 : -8) * (1 - progress.value) }],
  }));

  if (!open) return null;

  return (
    <Modal
      transparent
      visible={open}
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      hardwareAccelerated
      onRequestClose={() => setOpen(false)}
      {...modalProps}
    >
      <Pressable
        style={[StyleSheet.absoluteFill, overlayStyle]}
        onPress={() => setOpen(false)}
      />

      <Animated.View
        style={[
          {
            position: "absolute",
            left: Math.max(spacing.sm, triggerLayout.pageX),
            width,
            backgroundColor: colors.surface,
            borderWidth: components.borderWidth.strong,
            borderColor: colors.border,
            borderRadius: radii.lg,
            padding: spacing.xs,
            maxHeight: dropdownMaxHeight,
            overflow: "hidden",
          },
          animatedStyle,
          positionStyle,
          style,
        ]}
      >
        <ScrollView keyboardShouldPersistTaps="handled">{children}</ScrollView>
      </Animated.View>
    </Modal>
  );
}

export interface ContextMenuItemProps {
  onPress?: () => void;
  children?: React.ReactNode;
  variant?: "default" | "destructive";
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function ContextMenuItem({
  onPress,
  children,
  variant = "default",
  disabled = false,
  style,
}: ContextMenuItemProps) {
  const { setOpen, colors } = useContextMenu();
  const { radii, spacing, typography } = useTheme();

  const handlePress = () => {
    if (!disabled) {
      if (onPress) onPress();
      setOpen(false);
    }
  };

  const isDestructive = variant === "destructive";
  const textColor = disabled
    ? colors.textMuted
    : isDestructive
      ? colors.danger
      : colors.text;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          borderRadius: radii.md,
          backgroundColor: pressed
            ? isDestructive
              ? colors.dangerSoft
              : colors.surfaceMuted
            : colors.transparent,
          opacity: disabled ? 0.5 : 1,
          justifyContent: "space-between",
        },
        style,
      ]}
    >
      {typeof children === "string" ? (
        <Text style={{ ...typography.bodySmall, color: textColor }}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

export interface ContextMenuSeparatorProps {
  style?: StyleProp<ViewStyle>;
}

export function ContextMenuSeparator({ style }: ContextMenuSeparatorProps) {
  const { colors } = useContextMenu();
  const { spacing } = useTheme();
  return (
    <View
      style={[
        {
          height: 1,
          backgroundColor: colors.border,
          marginVertical: spacing.xs,
        },
        style,
      ]}
    />
  );
}

export interface ContextMenuLabelProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ContextMenuLabel({ children, style }: ContextMenuLabelProps) {
  const { colors } = useContextMenu();
  const { spacing, typography } = useTheme();
  return (
    <View
      style={[
        { paddingVertical: spacing.xs + 2, paddingHorizontal: spacing.md },
        style,
      ]}
    >
      {typeof children === "string" ? (
        <Text style={{ ...typography.labelSmall, color: colors.textMuted }}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

export interface ContextMenuCheckboxItemProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  checkIcon?: RenderIcon;
}

// Chevron checkmark for checkbox items
function CheckIcon({ color }: { color: string }) {
  return (
    <View
      style={{
        width: 8,
        height: 5,
        borderLeftWidth: 1.75,
        borderBottomWidth: 1.75,
        borderColor: color,
        transform: [{ rotate: "-45deg" }],
        marginRight: 2,
      }}
    />
  );
}

export function ContextMenuCheckboxItem({
  checked = false,
  onCheckedChange,
  children,
  disabled = false,
  style,
  checkIcon,
}: ContextMenuCheckboxItemProps) {
  const { setOpen, colors } = useContextMenu();
  const { radii, spacing, typography } = useTheme();

  const handlePress = () => {
    if (!disabled) {
      if (onCheckedChange) onCheckedChange(!checked);
      setOpen(false);
    }
  };

  const textColor = disabled ? colors.textMuted : colors.text;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          borderRadius: radii.md,
          backgroundColor: pressed ? colors.surfaceMuted : colors.transparent,
          opacity: disabled ? 0.5 : 1,
          justifyContent: "space-between",
        },
        style,
      ]}
    >
      <Text style={{ ...typography.bodySmall, color: textColor, flex: 1 }}>
        {children}
      </Text>
      {checked &&
        (checkIcon ? (
          renderIcon(checkIcon, colors.primary, 14)
        ) : (
          <CheckIcon color={colors.primary} />
        ))}
    </Pressable>
  );
}

export interface ContextMenuShortcutProps {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export function ContextMenuShortcut({
  children,
  style,
}: ContextMenuShortcutProps) {
  const { colors } = useContextMenu();
  const { spacing, typography } = useTheme();
  return (
    <Text
      style={[
        {
          ...typography.caption,
          color: colors.textMuted,
          marginLeft: spacing.sm,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
