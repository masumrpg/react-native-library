import React from 'react';
import {
  Text as RNText,
  View,
  type StyleProp,
  type TextInput,
  type TextStyle,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '../theme';
import { withAlpha } from '../utils';
import { Button, type ButtonProps, type ButtonSize, type ButtonVariant } from './Button';
import { Input, type InputProps } from './Input';

export type InputGroupAddonAlign = 'inline-start' | 'inline-end' | 'block-start' | 'block-end';
export type InputGroupButtonSize = 'xs' | 'sm' | 'icon-xs' | 'icon-sm';
export type InputGroupOrientation = 'inline' | 'block';

interface InputGroupContextValue {
  orientation: InputGroupOrientation;
  focused: boolean;
  invalid: boolean;
  disabled: boolean;
  setFocused: (focused: boolean) => void;
  setControlState: (state: { invalid?: boolean; disabled?: boolean }) => void;
}

const InputGroupContext = React.createContext<InputGroupContextValue | null>(null);

function useInputGroupContext() {
  return React.useContext(InputGroupContext);
}

export interface InputGroupProps extends ViewProps {
  orientation?: InputGroupOrientation;
  invalid?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function InputGroup({
  orientation = 'inline',
  invalid = false,
  disabled = false,
  style,
  children,
  ...props
}: InputGroupProps) {
  const { colors, radii } = useTheme();
  const [focused, setFocused] = React.useState(false);
  const [controlState, setControlState] = React.useState({
    invalid: false,
    disabled: false,
  });

  const isInvalid = invalid || controlState.invalid;
  const isDisabled = disabled || controlState.disabled;
  const borderColor = isInvalid ? colors.danger : focused ? colors.primary : colors.border;

  const value = React.useMemo<InputGroupContextValue>(
    () => ({
      focused,
      orientation,
      invalid: isInvalid,
      disabled: isDisabled,
      setFocused,
      setControlState: (state) => {
        setControlState((current) => ({
          invalid: state.invalid ?? current.invalid,
          disabled: state.disabled ?? current.disabled,
        }));
      },
    }),
    [focused, isDisabled, isInvalid, orientation],
  );

  return (
    <InputGroupContext.Provider value={value}>
      <View
        accessibilityState={{ disabled: isDisabled }}
        style={[
          {
            width: '100%',
            minHeight: 44,
            borderRadius: radii.lg,
            borderWidth: focused || isInvalid ? 1.5 : 1.25,
            borderColor,
            backgroundColor: isDisabled ? withAlpha(colors.input, 0.55) : colors.input,
            flexDirection: orientation === 'block' ? 'column' : 'row',
            alignItems: orientation === 'block' ? 'stretch' : 'center',
            overflow: 'hidden',
            opacity: isDisabled ? 0.72 : 1,
          },
          style,
        ]}
        {...props}
      >
        {children}
      </View>
    </InputGroupContext.Provider>
  );
}

export interface InputGroupAddonProps extends ViewProps {
  align?: InputGroupAddonAlign;
  style?: StyleProp<ViewStyle>;
}

export function InputGroupAddon({
  align = 'inline-start',
  style,
  children,
  ...props
}: InputGroupAddonProps) {
  const { spacing } = useTheme();
  const isBlock = align === 'block-start' || align === 'block-end';

  return (
    <View
      style={[
        {
          width: isBlock ? '100%' : undefined,
          minHeight: isBlock ? undefined : 44,
          paddingHorizontal: isBlock ? spacing.md : spacing.sm,
          paddingVertical: isBlock ? spacing.sm : 0,
          alignItems: isBlock ? 'flex-start' : 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: spacing.sm,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

export interface InputGroupButtonProps extends Omit<ButtonProps, 'size' | 'children'> {
  size?: InputGroupButtonSize;
  variant?: ButtonVariant;
  children?: React.ReactNode;
}

export function InputGroupButton({
  size = 'xs',
  variant = 'ghost',
  shape,
  children,
  style,
  ...props
}: InputGroupButtonProps) {
  const { radii } = useTheme();
  const isIcon = size === 'icon-xs' || size === 'icon-sm';
  const buttonSize: ButtonSize = size === 'sm' || size === 'icon-sm' ? 'sm' : 'xs';

  return (
    <Button
      size={buttonSize}
      variant={variant}
      shape={shape ?? (isIcon ? 'square' : 'rounded')}
      style={[
        {
          minWidth: isIcon ? (size === 'icon-sm' ? 32 : 24) : undefined,
          paddingHorizontal: isIcon ? 0 : size === 'sm' ? 12 : 10,
          borderRadius: isIcon ? radii.sm : radii.md,
        },
        style,
      ]}
      {...props}
    >
      {children ?? ''}
    </Button>
  );
}

export interface InputGroupTextProps extends ViewProps {
  textStyle?: StyleProp<TextStyle>;
}

export function InputGroupText({
  style,
  textStyle,
  children,
  ...props
}: InputGroupTextProps) {
  const { colors, typography, spacing } = useTheme();
  const context = useInputGroupContext();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
        },
        style,
      ]}
      {...props}
    >
      {typeof children === 'string' || typeof children === 'number' ? (
        <RNText
          style={[
            typography.bodySmall,
            {
              color: context?.disabled ? colors.disabledText : colors.textMuted,
              fontWeight: '500',
            },
            textStyle,
          ]}
        >
          {children}
        </RNText>
      ) : (
        children
      )}
    </View>
  );
}

export interface InputGroupInputProps extends InputProps {}

export const InputGroupInput = React.forwardRef<TextInput, InputGroupInputProps>(
  function InputGroupInput(
    {
      invalid = false,
      disabled = false,
      editable,
      onFocus,
      onBlur,
      style,
      ...props
    },
    ref,
  ) {
    const context = useInputGroupContext();
    const isEditable = editable ?? !disabled;

    React.useEffect(() => {
      context?.setControlState({ invalid, disabled: !isEditable });
    }, [context, invalid, isEditable]);

    return (
      <Input
        ref={ref}
        invalid={false}
        disabled={!isEditable}
        editable={isEditable}
        fullWidth={false}
        onFocus={(event) => {
          context?.setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          context?.setFocused(false);
          onBlur?.(event);
        }}
        style={[
          {
            flex: context?.orientation === 'block' ? undefined : 1,
            width: context?.orientation === 'block' ? '100%' : undefined,
            borderWidth: 0,
            borderRadius: 0,
            backgroundColor: 'transparent',
            minHeight: 42,
          },
          style,
        ]}
        {...props}
      />
    );
  },
);

export interface InputGroupTextareaProps extends Omit<InputGroupInputProps, 'multiline'> {}

export const InputGroupTextarea = React.forwardRef<TextInput, InputGroupTextareaProps>(
  function InputGroupTextarea({ style, ...props }, ref) {
    return (
      <InputGroupInput
        ref={ref}
        multiline
        textAlignVertical="top"
        style={[
          {
            minHeight: 96,
            paddingVertical: 10,
          },
          style,
        ]}
        {...props}
      />
    );
  },
);
