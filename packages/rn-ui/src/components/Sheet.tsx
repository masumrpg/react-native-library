import React from 'react';
import { View, type StyleProp, type TextStyle, type ViewProps, type ViewStyle } from 'react-native';

import {
  BottomSheet,
  BottomSheetView,
  type BottomSheetMethods,
  type BottomSheetProps,
} from './BottomSheet';
import { Text } from './Text';
import { useTheme } from '../theme';

export const Sheet = React.forwardRef<BottomSheetMethods, BottomSheetProps>(function Sheet(
  props,
  ref,
) {
  return <BottomSheet ref={ref} enablePanDownToClose {...props} />;
});

export { BottomSheetView as SheetContent };

export interface SheetHeaderProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export function SheetHeader({ style, ...props }: SheetHeaderProps) {
  const { spacing } = useTheme();
  return <View style={[{ gap: spacing.xs }, style]} {...props} />;
}

export interface SheetTitleProps {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export function SheetTitle({ children, style }: SheetTitleProps) {
  return (
    <Text variant="title" color="text" style={style}>
      {children}
    </Text>
  );
}

export interface SheetDescriptionProps {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export function SheetDescription({ children, style }: SheetDescriptionProps) {
  return (
    <Text variant="bodySmall" color="textMuted" style={style}>
      {children}
    </Text>
  );
}

export interface SheetFooterProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export function SheetFooter({ style, ...props }: SheetFooterProps) {
  const { spacing } = useTheme();
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: spacing.sm,
        },
        style,
      ]}
      {...props}
    />
  );
}
