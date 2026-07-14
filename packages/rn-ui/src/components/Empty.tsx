import React from 'react';
import {
  View,
  type StyleProp,
  type TextStyle,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '../theme';
import { Text } from './Text';

export type EmptyMediaVariant = 'default' | 'icon';

export interface EmptyProps extends ViewProps {
  bordered?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Empty({ bordered = false, style, ...props }: EmptyProps) {
  const { colors, radii, spacing } = useTheme();

  return (
    <View
      style={[
        {
          width: '100%',
          minWidth: 0,
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.lg,
          borderRadius: radii.xl,
          borderWidth: bordered ? 1.25 : 0,
          borderStyle: bordered ? 'dashed' : 'solid',
          borderColor: bordered ? colors.border : colors.transparent,
          padding: spacing.xxl,
        },
        style,
      ]}
      {...props}
    />
  );
}

export interface EmptyHeaderProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export function EmptyHeader({ style, ...props }: EmptyHeaderProps) {
  const { spacing } = useTheme();

  return (
    <View
      style={[
        {
          width: '100%',
          maxWidth: 320,
          alignItems: 'center',
          gap: spacing.sm,
        },
        style,
      ]}
      {...props}
    />
  );
}

export interface EmptyMediaProps extends ViewProps {
  variant?: EmptyMediaVariant;
  style?: StyleProp<ViewStyle>;
}

export function EmptyMedia({ variant = 'default', style, ...props }: EmptyMediaProps) {
  const { colors, radii, spacing } = useTheme();
  const isIcon = variant === 'icon';

  return (
    <View
      style={[
        {
          marginBottom: spacing.xs,
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          width: isIcon ? 32 : undefined,
          height: isIcon ? 32 : undefined,
          borderRadius: isIcon ? radii.lg : undefined,
          backgroundColor: isIcon ? colors.backgroundMuted : colors.transparent,
        },
        style,
      ]}
      {...props}
    />
  );
}

export interface EmptyTitleProps {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export function EmptyTitle({ children, style }: EmptyTitleProps) {
  return (
    <Text variant="label" align="center" style={style}>
      {children}
    </Text>
  );
}

export interface EmptyDescriptionProps {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export function EmptyDescription({ children, style }: EmptyDescriptionProps) {
  return (
    <Text variant="bodySmall" color="textMuted" align="center" style={style}>
      {children}
    </Text>
  );
}

export interface EmptyContentProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export function EmptyContent({ style, ...props }: EmptyContentProps) {
  const { spacing } = useTheme();

  return (
    <View
      style={[
        {
          width: '100%',
          maxWidth: 320,
          minWidth: 0,
          alignItems: 'center',
          gap: spacing.sm,
        },
        style,
      ]}
      {...props}
    />
  );
}
