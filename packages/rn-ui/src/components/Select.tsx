import React from 'react';
import { Modal, Pressable, ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '../theme';
import { Text } from './Text';
import { renderIcon, type RenderIcon } from './types';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  title?: string;
  onValueChange?: (value: string) => void;
  chevronIcon?: RenderIcon;
  checkIcon?: RenderIcon;
  style?: StyleProp<ViewStyle>;
}

export function Select({
  value,
  defaultValue,
  options,
  placeholder = 'Select option',
  disabled = false,
  title = 'Select',
  onValueChange,
  chevronIcon,
  checkIcon,
  style,
}: SelectProps) {
  const { colors, radii, spacing } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const currentValue = value ?? internalValue;
  const selected = options.find((option) => option.value === currentValue);

  const choose = (next: string) => {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
    setOpen(false);
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          {
            minHeight: 44,
            width: '100%',
            borderWidth: 1.25,
            borderColor: colors.border,
            borderRadius: radii.lg,
            backgroundColor: colors.input,
            paddingHorizontal: spacing.md,
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            opacity: disabled ? 0.5 : pressed ? 0.78 : 1,
          },
          style,
        ]}
      >
        <Text color={selected ? 'text' : 'placeholder'} style={{ flex: 1 }}>
          {selected?.label ?? placeholder}
        </Text>
        {renderIcon(chevronIcon, colors.textMuted, 18) ?? (
          <Text color="textMuted">⌄</Text>
        )}
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          style={{ flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' }}
          onPress={() => setOpen(false)}
        >
          <Pressable
            style={{
              backgroundColor: colors.surface,
              borderTopLeftRadius: radii.xxl,
              borderTopRightRadius: radii.xxl,
              borderWidth: 1.25,
              borderColor: colors.border,
              padding: spacing.lg,
              gap: spacing.md,
              maxHeight: '72%',
            }}
          >
            <Text variant="title">{title}</Text>
            <ScrollView>
              <View style={{ gap: spacing.sm }}>
                {options.map((option) => {
                  const active = option.value === currentValue;
                  return (
                    <Pressable
                      key={option.value}
                      disabled={option.disabled}
                      onPress={() => choose(option.value)}
                      style={({ pressed }) => ({
                        minHeight: 48,
                        borderRadius: radii.lg,
                        borderWidth: 1.25,
                        borderColor: active ? colors.primary : colors.border,
                        backgroundColor: active ? colors.primarySoft : colors.surface,
                        padding: spacing.md,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: spacing.md,
                        opacity: option.disabled ? 0.5 : pressed ? 0.78 : 1,
                      })}
                    >
                      <View style={{ flex: 1, gap: spacing.xs }}>
                        <Text variant="label">{option.label}</Text>
                        {option.description ? (
                          <Text variant="bodySmall" color="textMuted">{option.description}</Text>
                        ) : null}
                      </View>
                      {active ? renderIcon(checkIcon, colors.primary, 18) ?? <Text color="primary">✓</Text> : null}
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
