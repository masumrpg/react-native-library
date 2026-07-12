import React from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';

import { useTheme } from '../theme';
import { Text } from './Text';

export interface ContextMenuProps {
  children?: React.ReactNode;
}

export interface ContextMenuContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerLayout: { pageX: number; pageY: number; width: number; height: number };
  setTriggerLayout: (layout: any) => void;
  colors: any;
}

const ContextMenuContext = React.createContext<ContextMenuContextProps | null>(null);

export function useContextMenu() {
  const context = React.useContext(ContextMenuContext);
  if (!context) {
    throw new Error('useContextMenu must be used within a <ContextMenu />');
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
      <View style={{ width: '100%' }}>{children}</View>
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
      triggerRef.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
        if (width > 0 && height > 0) {
          setTriggerLayout({ pageX: x, pageY: y, width, height });
          setOpen(true);
        }
      });
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
  width?: number;
}

export function ContextMenuContent({
  children,
  style,
  width = 180,
}: ContextMenuContentProps) {
  const { open, setOpen, triggerLayout, colors } = useContextMenu();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (open) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [open]);

  if (!open) return null;

  const { height: SCREEN_HEIGHT } = Dimensions.get('window');
  const dropdownMaxHeight = 280;
  const spaceBelow = SCREEN_HEIGHT - (triggerLayout.pageY + triggerLayout.height);
  const renderAbove = spaceBelow < dropdownMaxHeight + 40;

  const positionStyle = renderAbove
    ? { bottom: SCREEN_HEIGHT - triggerLayout.pageY + 6 }
    : { top: triggerLayout.pageY + triggerLayout.height + 6 };

  const translateY = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: renderAbove ? [8, 0] : [-8, 0],
  });

  return (
    <Modal
      transparent
      visible={open}
      animationType="none"
      onRequestClose={() => setOpen(false)}
    >
      {/* Tap-away overlay backdrop */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => setOpen(false)}
      />

      {/* Floating Card Popup */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: Math.max(8, triggerLayout.pageX), // Avoid clipping at left edge
            width,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            padding: 4,
            maxHeight: dropdownMaxHeight,
            opacity: fadeAnim,
            transform: [{ translateY }],
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 3,
            elevation: 3,
            overflow: 'hidden',
          },
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
  variant?: 'default' | 'destructive';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function ContextMenuItem({
  onPress,
  children,
  variant = 'default',
  disabled = false,
  style,
}: ContextMenuItemProps) {
  const { setOpen, colors } = useContextMenu();

  const handlePress = () => {
    if (!disabled) {
      if (onPress) onPress();
      setOpen(false);
    }
  };

  const isDestructive = variant === 'destructive';
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
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 8,
          paddingHorizontal: 10,
          borderRadius: 6,
          backgroundColor: pressed
            ? isDestructive
              ? colors.dangerSoft || '#fee2e2'
              : colors.surfaceMuted
            : colors.transparent,
          opacity: disabled ? 0.5 : 1,
          justifyContent: 'space-between',
        },
        style,
      ]}
    >
      {typeof children === 'string' ? (
        <Text style={{ fontSize: 14, color: textColor }}>{children}</Text>
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
  return (
    <View
      style={[
        {
          height: 1,
          backgroundColor: colors.border,
          marginVertical: 4,
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
  return (
    <View style={[{ paddingVertical: 6, paddingHorizontal: 10 }, style]}>
      {typeof children === 'string' ? (
        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textMuted }}>
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
        transform: [{ rotate: '-45deg' }],
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
}: ContextMenuCheckboxItemProps) {
  const { setOpen, colors } = useContextMenu();

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
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 8,
          paddingHorizontal: 10,
          borderRadius: 6,
          backgroundColor: pressed ? colors.surfaceMuted : colors.transparent,
          opacity: disabled ? 0.5 : 1,
          justifyContent: 'space-between',
        },
        style,
      ]}
    >
      <Text style={{ fontSize: 14, color: textColor, flex: 1 }}>{children}</Text>
      {checked && <CheckIcon color={colors.primary} />}
    </Pressable>
  );
}

export interface ContextMenuShortcutProps {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export function ContextMenuShortcut({ children, style }: ContextMenuShortcutProps) {
  const { colors } = useContextMenu();
  return (
    <Text
      style={[
        {
          fontSize: 12,
          color: colors.textMuted,
          marginLeft: 8,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
