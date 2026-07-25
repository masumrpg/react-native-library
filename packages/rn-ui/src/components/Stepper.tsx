import React from 'react';
import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { useTheme } from '../theme';
import { Button } from './Button';
import { Text } from './Text';
import { renderIcon, type RenderIcon } from './types';

export interface StepperProps extends ViewProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onValueChange?: (value: number) => void;
  decrementIcon?: RenderIcon;
  incrementIcon?: RenderIcon;
  style?: StyleProp<ViewStyle>;
}

function clampStepper(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function Stepper({
  value,
  defaultValue = 0,
  min = 0,
  max = 999,
  step = 1,
  disabled = false,
  onValueChange,
  decrementIcon,
  incrementIcon,
  style,
  ...props
}: StepperProps) {
  const { colors, radii, spacing } = useTheme();
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const currentValue = clampStepper(value ?? internalValue, min, max);
  const setNextValue = (nextValue: number) => {
    const next = clampStepper(nextValue, min, max);
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <View
      accessibilityRole="adjustable"
      accessibilityValue={{ min, max, now: currentValue }}
      style={[
        {
          minHeight: 44,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1.25,
          borderColor: colors.border,
          borderRadius: radii.lg,
          backgroundColor: colors.surface,
          overflow: 'hidden',
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      {...props}
    >
      <Button
        size="sm"
        variant="ghost"
        tone="secondary"
        shape="square"
        disabled={disabled || currentValue <= min}
        onPress={() => setNextValue(currentValue - step)}
      >
        {decrementIcon ? renderIcon(decrementIcon, colors.text, 16) : '-'}
      </Button>
      <View style={{ minWidth: 52, alignItems: 'center', paddingHorizontal: spacing.sm }}>
        <Text variant="label" style={{ fontVariant: ['tabular-nums'] }}>
          {currentValue}
        </Text>
      </View>
      <Button
        size="sm"
        variant="ghost"
        tone="secondary"
        shape="square"
        disabled={disabled || currentValue >= max}
        onPress={() => setNextValue(currentValue + step)}
      >
        {incrementIcon ? renderIcon(incrementIcon, colors.text, 16) : '+'}
      </Button>
    </View>
  );
}
