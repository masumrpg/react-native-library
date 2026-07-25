import React from 'react';
import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { useTheme } from '../theme';
import { Text } from './Text';

export function DataList({ style, ...props }: ViewProps & { style?: StyleProp<ViewStyle> }) {
  const { spacing } = useTheme();
  return <View style={[{ width: '100%', gap: spacing.sm }, style]} {...props} />;
}

export function DataListItem({ style, ...props }: ViewProps & { style?: StyleProp<ViewStyle> }) {
  const { colors, spacing } = useTheme();
  return <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.borderMuted }, style]} {...props} />;
}

export function DataListLabel({ children }: { children?: React.ReactNode }) {
  return typeof children === 'string' ? <Text variant="bodySmall" color="textMuted">{children}</Text> : <>{children}</>;
}

export function DataListValue({ children }: { children?: React.ReactNode }) {
  return typeof children === 'string' ? <Text variant="label" color="text" align="right">{children}</Text> : <>{children}</>;
}
