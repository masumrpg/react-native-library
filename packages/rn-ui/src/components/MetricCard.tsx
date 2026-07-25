import React from 'react';
import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { useTheme } from '../theme';
import { Text } from './Text';
import { renderIcon, type RenderIcon } from './types';

export interface MetricCardProps extends ViewProps {
  label: React.ReactNode;
  value: React.ReactNode;
  delta?: React.ReactNode;
  icon?: RenderIcon;
  style?: StyleProp<ViewStyle>;
}

export function MetricCard({ label, value, delta, icon, style, ...props }: MetricCardProps) {
  const { colors, radii, spacing } = useTheme();
  return (
    <View style={[{ borderWidth: 1.25, borderColor: colors.border, borderRadius: radii.xl, backgroundColor: colors.surface, padding: spacing.lg, gap: spacing.md }, style]} {...props}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }}>
        {typeof label === 'string' ? <Text variant="bodySmall" color="textMuted">{label}</Text> : label}
        {renderIcon(icon, colors.primary, 20)}
      </View>
      {typeof value === 'string' || typeof value === 'number' ? <Text variant="h3">{value}</Text> : value}
      {delta ? (typeof delta === 'string' ? <Text variant="caption" color="success">{delta}</Text> : delta) : null}
    </View>
  );
}
