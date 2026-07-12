import React from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';

import { useTheme } from '../theme';
import type { ThemeColorName } from './types';

type Space = keyof ReturnType<typeof useTheme>['spacing'];

export interface BoxProps extends ViewProps {
  bg?: ThemeColorName;
  borderColor?: ThemeColorName;
  radius?: keyof ReturnType<typeof useTheme>['radii'];
  p?: Space;
  px?: Space;
  py?: Space;
  m?: Space;
  mx?: Space;
  my?: Space;
  flex?: number;
  row?: boolean;
  center?: boolean;
  gap?: Space;
}

export function Box({
  bg,
  borderColor,
  radius,
  p,
  px,
  py,
  m,
  mx,
  my,
  flex,
  row,
  center,
  gap,
  style,
  ...props
}: BoxProps) {
  const { colors, radii, spacing } = useTheme();

  const themedStyle: ViewStyle = {
    backgroundColor: bg ? colors[bg] : undefined,
    borderColor: borderColor ? colors[borderColor] : undefined,
    borderRadius: radius ? radii[radius] : undefined,
    padding: p ? spacing[p] : undefined,
    paddingHorizontal: px ? spacing[px] : undefined,
    paddingVertical: py ? spacing[py] : undefined,
    margin: m ? spacing[m] : undefined,
    marginHorizontal: mx ? spacing[mx] : undefined,
    marginVertical: my ? spacing[my] : undefined,
    flex,
    flexDirection: row ? 'row' : undefined,
    alignItems: center ? 'center' : undefined,
    justifyContent: center ? 'center' : undefined,
    gap: gap ? spacing[gap] : undefined,
  };

  return <View style={[themedStyle, style]} {...props} />;
}
