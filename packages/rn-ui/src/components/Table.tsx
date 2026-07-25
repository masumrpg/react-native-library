import React from 'react';
import { ScrollView, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { useTheme } from '../theme';
import { Text } from './Text';

export interface TableProps extends ViewProps {
  horizontal?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Table({ horizontal = true, style, children, ...props }: TableProps) {
  const { colors, radii } = useTheme();
  const table = (
    <View style={[{ borderWidth: 1.25, borderColor: colors.border, borderRadius: radii.lg, overflow: 'hidden' }, style]} {...props}>
      {children}
    </View>
  );
  return horizontal ? <ScrollView horizontal showsHorizontalScrollIndicator={false}>{table}</ScrollView> : table;
}

export function TableRow({ style, ...props }: ViewProps & { style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flexDirection: 'row' }, style]} {...props} />;
}

export function TableHead({ children, style }: { children?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const { colors, spacing } = useTheme();
  return <View style={[{ minWidth: 120, padding: spacing.md, backgroundColor: colors.backgroundMuted }, style]}>{typeof children === 'string' ? <Text variant="labelSmall">{children}</Text> : children}</View>;
}

export function TableCell({ children, style }: { children?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const { colors, spacing } = useTheme();
  return <View style={[{ minWidth: 120, padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.borderMuted }, style]}>{typeof children === 'string' ? <Text variant="bodySmall">{children}</Text> : children}</View>;
}
