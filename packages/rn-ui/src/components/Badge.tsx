import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '../theme';
import { renderIcon, type RenderIcon } from './types';
import { Text } from './Text';

export type BadgeTone = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeVariant = 'solid' | 'soft' | 'outline';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  children: string;
  tone?: BadgeTone;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: RenderIcon;
  style?: StyleProp<ViewStyle>;
}

function getBadgeColors(tone: BadgeTone, colors: ReturnType<typeof useTheme>['colors']) {
  const map = {
    primary: { solid: colors.primary, soft: colors.primarySoft, on: colors.onPrimary },
    secondary: { solid: colors.secondary, soft: colors.secondarySoft, on: colors.onSecondary },
    accent: { solid: colors.accent, soft: colors.accentSoft, on: colors.onAccent },
    success: { solid: colors.success, soft: colors.successSoft, on: colors.onSuccess },
    warning: { solid: colors.warning, soft: colors.warningSoft, on: colors.onWarning },
    danger: { solid: colors.danger, soft: colors.dangerSoft, on: colors.onDanger },
    info: { solid: colors.info, soft: colors.infoSoft, on: colors.onInfo },
  };

  return map[tone];
}

export function Badge({
  children,
  tone = 'primary',
  variant = 'soft',
  size = 'md',
  icon,
  style,
}: BadgeProps) {
  const { colors, radii, spacing } = useTheme();
  const toneColors = getBadgeColors(tone, colors);
  const isSolid = variant === 'solid';
  const iconSize = size === 'lg' ? 14 : size === 'sm' ? 10 : 12;

  return (
    <View
      style={[
        {
          alignSelf: 'flex-start',
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.xs,
          paddingHorizontal: size === 'lg' ? spacing.md : spacing.sm,
          paddingVertical: size === 'lg' ? spacing.xs : spacing.xxs,
          borderRadius: radii.full,
          backgroundColor: isSolid ? toneColors.solid : variant === 'soft' ? toneColors.soft : colors.transparent,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: variant === 'outline' ? colors.border : colors.transparent,
        },
        style,
      ]}
    >
      {renderIcon(icon, isSolid ? toneColors.on : toneColors.solid, iconSize)}
      <Text
        variant="labelSmall"
        color={isSolid ? 'textInverse' : 'text'}
        style={{ color: isSolid ? toneColors.on : toneColors.solid }}
      >
        {children}
      </Text>
    </View>
  );
}
