import React from 'react';
import {
  Pressable,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextProps,
  type TextStyle,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '../theme';

export type ItemVariant = 'default' | 'outline' | 'muted';
export type ItemSize = 'default' | 'sm' | 'xs';
export type ItemMediaVariant = 'default' | 'icon' | 'image';

export interface ItemGroupProps extends ViewProps {
  size?: ItemSize;
  style?: StyleProp<ViewStyle>;
}

export function ItemGroup({ size = 'default', style, ...props }: ItemGroupProps) {
  const { spacing } = useTheme();
  const gap = size === 'xs' ? spacing.sm : size === 'sm' ? spacing.md : spacing.lg;

  return (
    <View
      accessibilityRole="list"
      style={[
        {
          width: '100%',
          gap,
        },
        style,
      ]}
      {...props}
    />
  );
}

export interface ItemSeparatorProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export function ItemSeparator({ style, ...props }: ItemSeparatorProps) {
  const { colors, spacing } = useTheme();

  return (
    <View
      style={[
        {
          height: 1,
          width: '100%',
          marginVertical: spacing.sm,
          backgroundColor: colors.divider,
        },
        style,
      ]}
      {...props}
    />
  );
}

export interface ItemProps extends Omit<PressableProps, 'style'> {
  variant?: ItemVariant;
  size?: ItemSize;
  style?: StyleProp<ViewStyle> | ((state: { pressed: boolean }) => StyleProp<ViewStyle>);
}

export function Item({
  variant = 'default',
  size = 'default',
  disabled,
  style,
  ...props
}: ItemProps) {
  const { colors, radii, spacing } = useTheme();

  const paddingX = size === 'xs' ? spacing.md : spacing.lg;
  const paddingY = size === 'xs' ? spacing.sm : spacing.md;
  const gap = size === 'xs' ? spacing.sm : spacing.md;
  const isDisabled = Boolean(disabled);

  return (
    <Pressable
      accessibilityRole={props.onPress ? 'button' : undefined}
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      style={({ pressed }) => [
        {
          width: '100%',
          minHeight: size === 'xs' ? 40 : 48,
          paddingHorizontal: paddingX,
          paddingVertical: paddingY,
          borderRadius: radii.lg,
          borderWidth: variant === 'outline' ? 1.25 : 1.25,
          borderColor: variant === 'outline' ? colors.border : colors.transparent,
          backgroundColor: variant === 'muted' ? colors.surfaceMuted : colors.transparent,
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap,
          opacity: isDisabled ? 0.5 : pressed ? 0.78 : 1,
        },
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
      {...props}
    />
  );
}

export interface ItemMediaProps extends ViewProps {
  variant?: ItemMediaVariant;
  size?: ItemSize;
  style?: StyleProp<ViewStyle>;
}

export function ItemMedia({
  variant = 'default',
  size = 'default',
  style,
  ...props
}: ItemMediaProps) {
  const { colors, radii } = useTheme();
  const imageSize = size === 'xs' ? 24 : size === 'sm' ? 32 : 40;

  return (
    <View
      style={[
        {
          width: variant === 'image' ? imageSize : undefined,
          height: variant === 'image' ? imageSize : undefined,
          flexShrink: 0,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: variant === 'image' ? 'hidden' : undefined,
          borderRadius: variant === 'image' ? radii.sm : undefined,
          backgroundColor: variant === 'image' ? colors.backgroundMuted : colors.transparent,
        },
        style,
      ]}
      {...props}
    />
  );
}

export interface ItemContentProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export function ItemContent({ style, ...props }: ItemContentProps) {
  const { spacing } = useTheme();

  return (
    <View
      style={[
        {
          flex: 1,
          minWidth: 0,
          gap: spacing.xs,
        },
        style,
      ]}
      {...props}
    />
  );
}

export interface ItemTitleProps extends TextProps {
  style?: StyleProp<TextStyle>;
}

export function ItemTitle({ style, ...props }: ItemTitleProps) {
  const { colors, typography } = useTheme();

  return (
    <Text
      numberOfLines={1}
      style={[
        typography.label,
        {
          color: colors.text,
        },
        style,
      ]}
      {...props}
    />
  );
}

export interface ItemDescriptionProps extends TextProps {
  style?: StyleProp<TextStyle>;
}

export function ItemDescription({ style, ...props }: ItemDescriptionProps) {
  const { colors, typography } = useTheme();

  return (
    <Text
      numberOfLines={2}
      style={[
        typography.bodySmall,
        {
          color: colors.textMuted,
        },
        style,
      ]}
      {...props}
    />
  );
}

export interface ItemActionsProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export function ItemActions({ style, ...props }: ItemActionsProps) {
  const { spacing } = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
        },
        style,
      ]}
      {...props}
    />
  );
}

export interface ItemHeaderProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export function ItemHeader({ style, ...props }: ItemHeaderProps) {
  const { spacing } = useTheme();

  return (
    <View
      style={[
        {
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.sm,
        },
        style,
      ]}
      {...props}
    />
  );
}

export interface ItemFooterProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export function ItemFooter({ style, ...props }: ItemFooterProps) {
  const { spacing } = useTheme();

  return (
    <View
      style={[
        {
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.sm,
        },
        style,
      ]}
      {...props}
    />
  );
}
