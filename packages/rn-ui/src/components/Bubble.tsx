import React, { createContext, useContext } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '../theme';
import { Text } from './Text';

export type BubbleVariant =
  | 'default'
  | 'secondary'
  | 'muted'
  | 'tinted'
  | 'outline'
  | 'ghost'
  | 'destructive';

export type BubbleAlign = 'start' | 'end';

interface BubbleContextType {
  variant: BubbleVariant;
  align: BubbleAlign;
}

const BubbleContext = createContext<BubbleContextType | null>(null);

function useBubbleContext() {
  const context = useContext(BubbleContext);
  if (!context) {
    throw new Error('Bubble components must be rendered within a Bubble provider');
  }
  return context;
}

export interface BubbleGroupProps extends React.ComponentPropsWithoutRef<typeof View> {
  style?: StyleProp<ViewStyle>;
}

export function BubbleGroup({ style, children, ...props }: BubbleGroupProps) {
  const { spacing } = useTheme();

  const groupStyle: ViewStyle = {
    flexDirection: 'column',
    gap: spacing.sm, // 8px (gap-2)
    width: '100%',
  };

  return (
    <View style={[groupStyle, style]} {...props}>
      {children}
    </View>
  );
}

export interface BubbleProps extends React.ComponentPropsWithoutRef<typeof View> {
  variant?: BubbleVariant;
  align?: BubbleAlign;
  style?: StyleProp<ViewStyle>;
}

export function Bubble({
  variant = 'default',
  align = 'start',
  style,
  children,
  ...props
}: BubbleProps) {
  const bubbleStyle: ViewStyle = {
    alignSelf: align === 'end' ? 'flex-end' : 'flex-start',
    maxWidth: variant === 'ghost' ? '100%' : '80%',
    position: 'relative',
    flexDirection: 'column',
    gap: 4, // gap-1
  };

  return (
    <BubbleContext.Provider value={{ variant, align }}>
      <View style={[bubbleStyle, style]} {...props}>
        {children}
      </View>
    </BubbleContext.Provider>
  );
}

export interface BubbleContentProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  children?: React.ReactNode;
}

export function BubbleContent({
  style,
  textStyle,
  onPress,
  children,
  ...props
}: BubbleContentProps) {
  const { variant, align } = useBubbleContext();
  const { colors, radii, spacing } = useTheme();

  // Get themed color mapping for variant
  const colorsMap = getVariantColors(variant, colors);

  const containerStyle: ViewStyle = {
    paddingHorizontal: spacing.md, // px-3 (12px)
    paddingVertical: spacing.sm + 2, // py-2.5 (10px)
    borderRadius: radii.xl + 4, // rounded-3xl (~20-24px)
    borderWidth: variant === 'outline' ? 1 : 0,
    borderColor: colorsMap.border,
    backgroundColor: colorsMap.bg,
    alignSelf: align === 'end' ? 'flex-end' : 'flex-start',
  };

  const isGhost = variant === 'ghost';
  const finalContainerStyle: ViewStyle = isGhost
    ? {
        borderWidth: 0,
        backgroundColor: 'transparent',
        borderRadius: 0,
        paddingHorizontal: 0,
        paddingVertical: 0,
      }
    : containerStyle;

  const Comp = onPress ? Pressable : View;

  return (
    <Comp
      onPress={onPress}
      style={
        onPress
          ? ({ pressed }: any) => [
              finalContainerStyle,
              { opacity: pressed ? 0.8 : 1 },
              style,
            ]
          : [finalContainerStyle, style]
      }
      {...props}
    >
      {typeof children === 'string' ? (
        <Text style={[{ color: colorsMap.text, fontSize: 14, lineHeight: 20 }, textStyle]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Comp>
  );
}

export interface BubbleReactionsProps extends React.ComponentPropsWithoutRef<typeof View> {
  side?: 'top' | 'bottom';
  align?: 'start' | 'end';
  style?: StyleProp<ViewStyle>;
}

export function BubbleReactions({
  side = 'bottom',
  align = 'end',
  style,
  children,
  ...props
}: BubbleReactionsProps) {
  const { colors, radii, spacing } = useTheme();

  const reactionStyle: ViewStyle = {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    backgroundColor: colors.backgroundMuted,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.surface, // ring-card
    paddingHorizontal: spacing.xs + 2, // px-1.5
    paddingVertical: spacing.xxs + 1, // py-0.5
    zIndex: 10,
    ...(side === 'top' ? { top: -12 } : { bottom: -12 }),
    ...(align === 'start' ? { left: 12 } : { right: 12 }),
  };

  return (
    <View style={[reactionStyle, style]} {...props}>
      {children}
    </View>
  );
}

// Helper to resolve themed background, text, and border colors based on Bubble variant
function getVariantColors(variant: BubbleVariant, colors: ReturnType<typeof useTheme>['colors']) {
  switch (variant) {
    case 'secondary':
      return {
        bg: colors.secondarySoft,
        text: colors.text,
        border: 'transparent',
      };
    case 'muted':
      return {
        bg: colors.backgroundMuted,
        text: colors.textMuted,
        border: 'transparent',
      };
    case 'tinted':
      return {
        bg: colors.primarySoft,
        text: colors.primary,
        border: 'transparent',
      };
    case 'outline':
      return {
        bg: colors.background,
        text: colors.text,
        border: colors.border,
      };
    case 'ghost':
      return {
        bg: 'transparent',
        text: colors.text,
        border: 'transparent',
      };
    case 'destructive':
      return {
        bg: colors.dangerSoft,
        text: colors.danger,
        border: 'transparent',
      };
    case 'default':
    default:
      return {
        bg: colors.primary,
        text: colors.onPrimary,
        border: 'transparent',
      };
  }
}
