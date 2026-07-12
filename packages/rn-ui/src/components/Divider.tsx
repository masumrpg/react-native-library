import React from 'react';
import { View, type ViewStyle } from 'react-native';

import { useTheme } from '../theme';

export interface DividerProps {
  inset?: number;
  vertical?: boolean;
  style?: ViewStyle;
}

export function Divider({ inset = 0, vertical = false, style }: DividerProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: colors.divider,
          marginHorizontal: vertical ? 0 : inset,
          marginVertical: vertical ? inset : 0,
          width: vertical ? 1 : undefined,
          height: vertical ? undefined : 1,
          alignSelf: vertical ? 'stretch' : undefined,
        },
        style,
      ]}
    />
  );
}
