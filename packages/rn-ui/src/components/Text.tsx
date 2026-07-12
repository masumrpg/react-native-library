import React from 'react';
import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';

import { useTheme } from '../theme';
import type { ThemeColorName } from './types';

export interface TextProps extends RNTextProps {
  variant?: keyof ReturnType<typeof useTheme>['typography'];
  color?: ThemeColorName;
  align?: TextStyle['textAlign'];
  weight?: TextStyle['fontWeight'];
}

export function Text({
  variant = 'body',
  color = 'text',
  align,
  weight,
  style,
  ...props
}: TextProps) {
  const { colors, typography } = useTheme();

  return (
    <RNText
      style={[
        typography[variant],
        {
          color: colors[color],
          textAlign: align,
          fontWeight: weight,
        },
        style,
      ]}
      {...props}
    />
  );
}
