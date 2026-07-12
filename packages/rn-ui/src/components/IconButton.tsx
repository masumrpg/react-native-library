import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '../theme';
import { withAlpha } from '../utils';
import { renderIcon, type RenderIcon } from './types';
import { Text } from './Text';

export type IconButtonVariant = 'filled' | 'outline' | 'ghost' | 'soft';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  icon: RenderIcon;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  color?: string;
  loading?: boolean;
  badge?: number;
  style?: StyleProp<ViewStyle>;
}

export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  color,
  loading,
  disabled,
  badge,
  style,
  ...props
}: IconButtonProps) {
  const { colors, components } = useTheme();
  const base = color ?? colors.primary;
  const isDisabled = disabled || loading;
  const containerSize = components.iconButton.size[size];
  const iconSize = components.iconButton.iconSize[size];

  const backgroundColor =
    isDisabled ? colors.disabled :
    variant === 'filled' ? base :
    variant === 'soft' ? withAlpha(base, 0.12) :
    variant === 'outline' ? colors.surface :
    colors.transparent;

  const iconColor =
    isDisabled ? colors.disabledText :
    variant === 'filled' ? colors.onPrimary :
    variant === 'ghost' ? colors.text :
    base;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }) => [
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2,
          backgroundColor,
          borderColor: variant === 'outline' ? colors.border : colors.transparent,
          borderWidth: variant === 'outline' ? 1.25 : 0,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed && !isDisabled ? 0.72 : 1,
        },
        style,
      ]}
      {...props}
    >
      {loading ? <ActivityIndicator color={iconColor} /> : renderIcon(icon, iconColor, iconSize)}
      {!!badge && badge > 0 && (
        <View
          style={{
            position: 'absolute',
            top: -2,
            right: -2,
            minWidth: 16,
            height: 16,
            paddingHorizontal: 4,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.danger,
            borderWidth: 1.5,
            borderColor: colors.surface,
          }}
        >
          <Text variant="caption" color="onDanger" weight="700" style={{ fontSize: 8, lineHeight: 10 }}>
            {badge > 99 ? '99+' : String(badge)}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
