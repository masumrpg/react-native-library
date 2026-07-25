import React from 'react';
import { Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { useTheme } from '../theme';

export interface LabelProps extends TextProps {
  required?: boolean;
  requiredIndicator?: React.ReactNode;
  requiredIndicatorStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  invalid?: boolean;
  style?: StyleProp<TextStyle>;
}

export function Label({
  required = false,
  requiredIndicator,
  requiredIndicatorStyle,
  disabled = false,
  invalid = false,
  style,
  children,
  ...props
}: LabelProps) {
  const { colors, typography } = useTheme();

  return (
    <Text
      style={[
        typography.label,
        {
          color: disabled ? colors.disabledText : invalid ? colors.danger : colors.text,
        },
        style,
      ]}
      {...props}
    >
      {children}
      {required ? (
        requiredIndicator ?? (
          <Text style={[{ color: colors.danger }, requiredIndicatorStyle]}>
            {' *'}
          </Text>
        )
      ) : null}
    </Text>
  );
}
