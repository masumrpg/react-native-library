import React from 'react';
import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { useTheme } from '../theme';
import { Text } from './Text';

export function Timeline({ style, ...props }: ViewProps & { style?: StyleProp<ViewStyle> }) {
  const { spacing } = useTheme();
  return <View style={[{ gap: spacing.md }, style]} {...props} />;
}

export function TimelineItem({ active = false, style, children, ...props }: ViewProps & { active?: boolean; style?: StyleProp<ViewStyle> }) {
  const { colors, spacing } = useTheme();
  return (
    <View style={[{ flexDirection: 'row', gap: spacing.md }, style]} {...props}>
      <View style={{ alignItems: 'center' }}>
        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: active ? colors.primary : colors.border }} />
        <View style={{ width: 1.25, flex: 1, minHeight: 32, backgroundColor: colors.borderMuted }} />
      </View>
      <View style={{ flex: 1, gap: spacing.xs }}>{children}</View>
    </View>
  );
}

export function TimelineTitle({ children }: { children?: React.ReactNode }) {
  return typeof children === 'string' ? <Text variant="label">{children}</Text> : <>{children}</>;
}

export function TimelineDescription({ children }: { children?: React.ReactNode }) {
  return typeof children === 'string' ? <Text variant="bodySmall" color="textMuted">{children}</Text> : <>{children}</>;
}
