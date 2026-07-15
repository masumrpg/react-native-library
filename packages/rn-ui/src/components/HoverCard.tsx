import React from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  View,
  type ModalProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useTheme, type ThemeColors } from '../theme';

export type HoverCardAlign = 'start' | 'center' | 'end';
export type HoverCardTriggerMode = 'longPress' | 'press' | 'manual';

interface HoverCardTriggerLayout {
  pageX: number;
  pageY: number;
  width: number;
  height: number;
}

export interface HoverCardContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerLayout: HoverCardTriggerLayout;
  setTriggerLayout: (layout: HoverCardTriggerLayout) => void;
  openDelay: number;
  closeDelay: number;
  triggerMode: HoverCardTriggerMode;
  colors: ThemeColors;
}

const HoverCardContext = React.createContext<HoverCardContextProps | null>(null);

export function useHoverCard() {
  const context = React.useContext(HoverCardContext);
  if (!context) {
    throw new Error('useHoverCard must be used within a <HoverCard />');
  }
  return context;
}

export interface HoverCardProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
  triggerMode?: HoverCardTriggerMode;
  children?: React.ReactNode;
}

export function HoverCard({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  openDelay = 10,
  closeDelay = 100,
  triggerMode = 'longPress',
  children,
}: HoverCardProps) {
  const { colors } = useTheme();
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const [triggerLayout, setTriggerLayout] = React.useState<HoverCardTriggerLayout>({
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
    <HoverCardContext.Provider
      value={{
        open,
        setOpen,
        triggerLayout,
        setTriggerLayout,
        openDelay,
        closeDelay,
        triggerMode,
        colors,
      }}
    >
      <View style={{ alignSelf: 'flex-start' }}>{children}</View>
    </HoverCardContext.Provider>
  );
}

export interface HoverCardTriggerProps {
  children?: React.ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function HoverCardTrigger({
  children,
  disabled = false,
  style,
}: HoverCardTriggerProps) {
  const {
    open,
    setOpen,
    setTriggerLayout,
    openDelay,
    closeDelay,
    triggerMode,
  } = useHoverCard();
  const triggerRef = React.useRef<View>(null);
  const openTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (openTimer.current) clearTimeout(openTimer.current);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const measureAndSetOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (disabled || triggerMode === 'manual') return;

      if (closeTimer.current) clearTimeout(closeTimer.current);
      triggerRef.current?.measureInWindow((x, y, width, height) => {
        if (width > 0 && height > 0) {
          setTriggerLayout({ pageX: x, pageY: y, width, height });
          if (openTimer.current) clearTimeout(openTimer.current);
          openTimer.current = setTimeout(() => setOpen(nextOpen), openDelay);
        }
      });
    },
    [disabled, openDelay, setOpen, setTriggerLayout, triggerMode],
  );

  const close = React.useCallback(() => {
    if (triggerMode === 'manual') return;

    if (openTimer.current) clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), closeDelay);
  }, [closeDelay, setOpen, triggerMode]);

  return (
    <Pressable
      ref={triggerRef}
      accessibilityRole="button"
      accessibilityState={{ expanded: open, disabled }}
      disabled={disabled}
      onPress={triggerMode === 'press' ? () => measureAndSetOpen(!open) : undefined}
      onLongPress={triggerMode === 'longPress' ? () => measureAndSetOpen(true) : undefined}
      onPressOut={triggerMode === 'longPress' ? close : undefined}
      delayLongPress={420}
      style={style}
    >
      {children}
    </Pressable>
  );
}

export interface HoverCardContentProps {
  children?: React.ReactNode;
  align?: HoverCardAlign;
  width?: number;
  maxHeight?: number;
  sideOffset?: number;
  style?: StyleProp<ViewStyle>;
  overlayStyle?: StyleProp<ViewStyle>;
  modalProps?: Omit<ModalProps, 'visible' | 'transparent' | 'animationType' | 'onRequestClose'>;
}

export function HoverCardContent({
  children,
  align = 'center',
  width = 256,
  maxHeight = 320,
  sideOffset = 4,
  style,
  overlayStyle,
  modalProps,
}: HoverCardContentProps) {
  const { open, setOpen, triggerLayout, colors } = useHoverCard();
  const { radii, spacing } = useTheme();
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withTiming(open ? 1 : 0, { duration: 100 });
  }, [open, progress]);

  const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
  const resolvedWidth = Math.min(width, screenWidth - spacing.lg * 2);
  const spaceBelow = screenHeight - (triggerLayout.pageY + triggerLayout.height);
  const renderAbove = spaceBelow < maxHeight + spacing.xl;
  const centerX = triggerLayout.pageX + triggerLayout.width / 2;
  const rawLeft =
    align === 'start'
      ? triggerLayout.pageX
      : align === 'end'
        ? triggerLayout.pageX + triggerLayout.width - resolvedWidth
        : centerX - resolvedWidth / 2;
  const left = Math.min(
    Math.max(spacing.lg, rawLeft),
    screenWidth - resolvedWidth - spacing.lg,
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
          scale: 0.95 + progress.value * 0.05,
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
            position: 'absolute',
            left,
            width: resolvedWidth,
            maxHeight,
            borderRadius: radii.lg,
            backgroundColor: colors.surface,
            borderWidth: 1.25,
            borderColor: colors.border,
            padding: spacing.md,
            overflow: 'hidden',
          },
          positionStyle,
          animatedStyle,
          style,
        ]}
      >
        {children}
      </Animated.View>
    </Modal>
  );
}
