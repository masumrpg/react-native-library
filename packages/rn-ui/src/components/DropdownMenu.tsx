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
  type TextStyle,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useTheme, type ThemeColors } from "../theme";
import { Text } from "./Text";
import { renderIcon, type RenderIcon } from "./types";

export type DropdownMenuAlign = "start" | "end";
export type DropdownMenuItemVariant = "default" | "destructive";

interface DropdownMenuTriggerLayout {
  pageX: number;
  pageY: number;
  width: number;
  height: number;
}

export interface DropdownMenuContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerLayout: DropdownMenuTriggerLayout;
  setTriggerLayout: (layout: DropdownMenuTriggerLayout) => void;
  colors: ThemeColors;
}

const DropdownMenuContext =
  React.createContext<DropdownMenuContextProps | null>(null);

export function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("useDropdownMenu must be used within a <DropdownMenu />");
  }
  return context;
}

export interface DropdownMenuProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export function DropdownMenu({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: DropdownMenuProps) {
  const { colors } = useTheme();
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const [triggerLayout, setTriggerLayout] =
    React.useState<DropdownMenuTriggerLayout>({
      pageX: 0,
      pageY: 0,
      width: 0,
      height: 0,
    });

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  return (
    <DropdownMenuContext.Provider
      value={{
        open,
        setOpen,
        triggerLayout,
        setTriggerLayout,
        colors,
      }}
    >
      <View style={{ alignSelf: "flex-start" }}>{children}</View>
    </DropdownMenuContext.Provider>
  );
}

export interface DropdownMenuTriggerProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export function DropdownMenuTrigger({
  children,
  style,
  disabled = false,
}: DropdownMenuTriggerProps) {
  const { open, setOpen, setTriggerLayout } = useDropdownMenu();
  const triggerRef = React.useRef<View>(null);

  const handlePress = () => {
    if (disabled) return;

    triggerRef.current?.measureInWindow((x, y, width, height) => {
      if (width > 0 && height > 0) {
        setTriggerLayout({ pageX: x, pageY: y, width, height });
        setOpen(!open);
      }
    });
  };

  return (
    <Pressable
      ref={triggerRef}
      accessibilityRole="button"
      accessibilityState={{ expanded: open, disabled }}
      disabled={disabled}
      onPress={handlePress}
      style={style}
    >
      {children}
    </Pressable>
  );
}

export interface DropdownMenuContentProps {
  children?: React.ReactNode;
  align?: DropdownMenuAlign;
  width?: number;
  maxHeight?: number;
  sideOffset?: number;
  style?: StyleProp<ViewStyle>;
  overlayStyle?: StyleProp<ViewStyle>;
  modalProps?: Omit<
    ModalProps,
    "visible" | "transparent" | "animationType" | "onRequestClose"
  >;
}

export function DropdownMenuContent({
  children,
  align = "start",
  width = 200,
  maxHeight = 280,
  sideOffset = 6,
  style,
  overlayStyle,
  modalProps,
}: DropdownMenuContentProps) {
  const { open, setOpen, triggerLayout, colors } = useDropdownMenu();
  const { components, radii, spacing } = useTheme();
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withTiming(open ? 1 : 0, { duration: 150 });
  }, [open, progress]);

  const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
  const spaceBelow =
    screenHeight - (triggerLayout.pageY + triggerLayout.height);
  const renderAbove = spaceBelow < maxHeight + 40;
  const rawLeft =
    align === "end"
      ? triggerLayout.pageX + triggerLayout.width - width
      : triggerLayout.pageX;
  const left = Math.min(
    Math.max(spacing.sm, rawLeft),
    screenWidth - width - spacing.sm,
  );
  const positionStyle = renderAbove
    ? { bottom: screenHeight - triggerLayout.pageY + sideOffset }
    : { top: triggerLayout.pageY + triggerLayout.height + sideOffset };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [
        {
          translateY: renderAbove
            ? (1 - progress.value) * 8
            : (1 - progress.value) * -8,
        },
        {
          scale: 0.98 + progress.value * 0.02,
        },
      ],
    };
  });

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
            left,
            width,
            backgroundColor: colors.surface,
            borderWidth: components.borderWidth.strong,
            borderColor: colors.border,
            borderRadius: radii.lg,
            padding: spacing.xs,
            maxHeight,
            overflow: "hidden",
          },
          positionStyle,
          animatedStyle,
          style,
        ]}
      >
        <ScrollView keyboardShouldPersistTaps="handled">{children}</ScrollView>
      </Animated.View>
    </Modal>
  );
}

export interface DropdownMenuItemProps {
  onPress?: () => void;
  children?: React.ReactNode;
  variant?: DropdownMenuItemVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function DropdownMenuItem({
  onPress,
  children,
  variant = "default",
  disabled = false,
  style,
}: DropdownMenuItemProps) {
  const { setOpen, colors } = useDropdownMenu();
  const { radii, spacing, typography } = useTheme();
  const isDestructive = variant === "destructive";
  const textColor = disabled
    ? colors.textMuted
    : isDestructive
      ? colors.danger
      : colors.text;

  const handlePress = () => {
    if (disabled) return;

    onPress?.();
    setOpen(false);
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={handlePress}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          borderRadius: radii.md,
          backgroundColor: pressed
            ? isDestructive
              ? colors.dangerSoft
              : colors.surfaceMuted
            : colors.transparent,
          opacity: disabled ? 0.5 : 1,
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

export interface DropdownMenuCheckboxItemProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  checkIcon?: RenderIcon;
}

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

export function DropdownMenuCheckboxItem({
  checked = false,
  onCheckedChange,
  children,
  disabled = false,
  style,
  checkIcon,
}: DropdownMenuCheckboxItemProps) {
  const { setOpen, colors } = useDropdownMenu();
  const { radii, spacing, typography } = useTheme();

  const handlePress = () => {
    if (disabled) return;

    onCheckedChange?.(!checked);
    setOpen(false);
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={handlePress}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          borderRadius: radii.md,
          backgroundColor: pressed ? colors.surfaceMuted : colors.transparent,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <Text
        style={{
          ...typography.bodySmall,
          color: disabled ? colors.textMuted : colors.text,
          flex: 1,
        }}
      >
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

export interface DropdownMenuSeparatorProps {
  style?: StyleProp<ViewStyle>;
}

export function DropdownMenuSeparator({ style }: DropdownMenuSeparatorProps) {
  const { colors } = useDropdownMenu();
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

export interface DropdownMenuLabelProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function DropdownMenuLabel({ children, style }: DropdownMenuLabelProps) {
  const { colors } = useDropdownMenu();
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

export interface DropdownMenuShortcutProps {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export function DropdownMenuShortcut({
  children,
  style,
}: DropdownMenuShortcutProps) {
  const { colors } = useDropdownMenu();
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
