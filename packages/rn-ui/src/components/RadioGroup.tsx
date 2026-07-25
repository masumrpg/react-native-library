import React from 'react';
import {
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '../theme';
import { Text } from './Text';

export interface RadioGroupContextValue {
  value?: string;
  disabled: boolean;
  onValueChange?: (value: string) => void;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps extends ViewProps {
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

export function RadioGroup({
  value,
  defaultValue,
  disabled = false,
  onValueChange,
  style,
  ...props
}: RadioGroupProps) {
  const { spacing } = useTheme();
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const currentValue = value ?? internalValue;
  const handleValueChange = React.useCallback((next: string) => {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  }, [onValueChange, value]);
  const context = React.useMemo(
    () => ({ value: currentValue, disabled, onValueChange: handleValueChange }),
    [currentValue, disabled, handleValueChange],
  );

  return (
    <RadioGroupContext.Provider value={context}>
      <View
        accessibilityRole="radiogroup"
        style={[{ gap: spacing.sm, width: '100%' }, style]}
        {...props}
      />
    </RadioGroupContext.Provider>
  );
}

export interface RadioGroupItemProps extends Omit<PressableProps, 'style'> {
  value: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function RadioGroupItem({
  value,
  label,
  description,
  disabled = false,
  style,
  ...props
}: RadioGroupItemProps) {
  const context = React.useContext(RadioGroupContext);
  const { colors, radii, spacing, typography } = useTheme();
  const checked = context?.value === value;
  const isDisabled = disabled || Boolean(context?.disabled);

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={() => context?.onValueChange?.(value)}
      style={({ pressed }) => [
        {
          width: '100%',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: spacing.md,
          padding: spacing.md,
          borderWidth: 1.25,
          borderColor: checked ? colors.primary : colors.border,
          borderRadius: radii.lg,
          backgroundColor: checked ? colors.primarySoft : colors.surface,
          opacity: isDisabled ? 0.5 : pressed ? 0.78 : 1,
        },
        style,
      ]}
      {...props}
    >
      <View
        style={{
          width: 18,
          height: 18,
          borderRadius: 9,
          borderWidth: 1.5,
          borderColor: checked ? colors.primary : colors.border,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 1,
        }}
      >
        {checked ? (
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.primary,
            }}
          />
        ) : null}
      </View>
      <View style={{ flex: 1, gap: spacing.xs }}>
        {typeof label === 'string' ? (
          <Text variant="label" color="text">{label}</Text>
        ) : label}
        {typeof description === 'string' ? (
          <Text style={[typography.bodySmall, { color: colors.textMuted }]}>
            {description}
          </Text>
        ) : description}
      </View>
    </Pressable>
  );
}
