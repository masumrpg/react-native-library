import React from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';

import { useTheme } from '../theme';
import { Text } from './Text';

export interface ComboboxProps {
  value?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export interface ComboboxContextProps {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  inputValue: string;
  setInputValue: (val: string) => void;
  triggerRef: React.RefObject<any>;
  triggerLayout: { pageX: number; pageY: number; width: number; height: number };
  measureTrigger: () => void;
  colors: any;
}

const ComboboxContext = React.createContext<ComboboxContextProps | null>(null);

export function useCombobox() {
  const context = React.useContext(ComboboxContext);
  if (!context) {
    throw new Error('useCombobox must be used within a <Combobox />');
  }
  return context;
}

export function Combobox({
  value: controlledValue,
  onValueChange,
  open: controlledOpen,
  onOpenChange,
  children,
}: ComboboxProps) {
  const { colors } = useTheme();

  const [uncontrolledValue, setUncontrolledValue] = React.useState('');
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [triggerLayout, setTriggerLayout] = React.useState({
    pageX: 0,
    pageY: 0,
    width: 0,
    height: 0,
  });

  const triggerRef = React.useRef<any>(null);

  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue;
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (controlledOpen === undefined) {
        setUncontrolledOpen(nextOpen);
      }
      if (onOpenChange) {
        onOpenChange(nextOpen);
      }
    },
    [controlledOpen, onOpenChange]
  );

  const handleValueChange = React.useCallback(
    (nextVal: string) => {
      if (controlledValue === undefined) {
        setUncontrolledValue(nextVal);
      }
      if (onValueChange) {
        onValueChange(nextVal);
      }
    },
    [controlledValue, onValueChange]
  );

  const measureTrigger = React.useCallback(() => {
    triggerRef.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
      if (width > 0 && height > 0) {
        setTriggerLayout({ pageX: x, pageY: y, width, height });
      }
    });
  }, []);

  return (
    <ComboboxContext.Provider
      value={{
        value,
        onValueChange: handleValueChange,
        open,
        setOpen,
        inputValue,
        setInputValue,
        triggerRef,
        triggerLayout,
        measureTrigger,
        colors,
      }}
    >
      <View style={{ width: '100%' }}>{children}</View>
    </ComboboxContext.Provider>
  );
}

// Chevron pure arrow down icon
function ChevronDownIcon({ color }: { color: string }) {
  return (
    <View
      style={{
        width: 8,
        height: 8,
        borderRightWidth: 1.5,
        borderBottomWidth: 1.5,
        borderColor: color,
        transform: [{ rotate: '45deg' }],
        marginTop: -3,
        marginRight: 4,
      }}
    />
  );
}

export interface ComboboxInputProps {
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

export function ComboboxInput({
  placeholder = 'Select option...',
  style,
  inputStyle,
  disabled = false,
}: ComboboxInputProps) {
  const {
    inputValue,
    setInputValue,
    open,
    setOpen,
    triggerRef,
    measureTrigger,
    colors,
  } = useCombobox();

  const handleFocus = () => {
    if (!disabled) {
      measureTrigger();
      setOpen(true);
    }
  };

  const handlePress = () => {
    if (!disabled) {
      measureTrigger();
      setOpen(!open);
    }
  };

  return (
    <Pressable
      ref={triggerRef}
      onPress={handlePress}
      disabled={disabled}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          height: 38,
          borderWidth: 1.25,
          borderColor: colors.border,
          borderRadius: 6,
          backgroundColor: colors.transparent,
          paddingHorizontal: 12,
          width: '100%',
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <TextInput
        editable={!disabled}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={inputValue}
        onChangeText={setInputValue}
        onFocus={handleFocus}
        pointerEvents={disabled ? 'none' : 'auto'}
        style={[
          {
            flex: 1,
            fontSize: 14,
            color: colors.text,
            padding: 0,
            height: '100%',
          },
          inputStyle,
        ]}
      />
      <ChevronDownIcon color={colors.textMuted} />
    </Pressable>
  );
}

export interface ComboboxContentProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ComboboxContent({ children, style }: ComboboxContentProps) {
  const { open, setOpen, triggerLayout, colors } = useCombobox();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (open) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [open]);

  if (!open) return null;

  const { height: SCREEN_HEIGHT } = Dimensions.get('window');
  const spaceBelow = SCREEN_HEIGHT - (triggerLayout.pageY + triggerLayout.height);
  const dropdownMaxHeight = 220;
  const renderAbove = spaceBelow < dropdownMaxHeight + 40;

  const positionStyle = renderAbove
    ? { bottom: SCREEN_HEIGHT - triggerLayout.pageY + 6 }
    : { top: triggerLayout.pageY + triggerLayout.height + 6 };

  // Gently slide out from trigger input box
  const translateY = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: renderAbove ? [8, 0] : [-8, 0],
  });

  return (
    <Modal
      transparent
      visible={open}
      animationType="none"
      onRequestClose={() => setOpen(false)}
    >
      {/* Tap-away overlay backdrop */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => setOpen(false)}
      />

      {/* Floating Card Popup aligned directly below or above trigger depending on space */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: triggerLayout.pageX,
            width: triggerLayout.width,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            maxHeight: dropdownMaxHeight,
            opacity: fadeAnim,
            transform: [{ translateY }],
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 3,
            elevation: 3,
            overflow: 'hidden',
          },
          positionStyle,
          style,
        ]}
      >
        {children}
      </Animated.View>
    </Modal>
  );
}

export interface ComboboxListProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ComboboxList({ children, style }: ComboboxListProps) {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={[{ flex: 1, padding: 4 }, style]}
    >
      {children}
    </ScrollView>
  );
}

export interface ComboboxItemProps {
  value: string;
  label: string; // Required for automatic text filtering
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

// Chevron checkmark for selected indicator
function CheckIcon({ color }: { color: string }) {
  return (
    <View
      style={{
        width: 8,
        height: 5,
        borderLeftWidth: 1.75,
        borderBottomWidth: 1.75,
        borderColor: color,
        transform: [{ rotate: '-45deg' }],
        marginRight: 6,
      }}
    />
  );
}

export function ComboboxItem({
  value,
  label,
  children,
  style,
}: ComboboxItemProps) {
  const {
    value: selectedValue,
    onValueChange,
    setOpen,
    inputValue,
    setInputValue,
    colors,
  } = useCombobox();

  // Automatic filter matching
  if (
    inputValue &&
    !label.toLowerCase().includes(inputValue.toLowerCase())
  ) {
    return null;
  }

  const isSelected = selectedValue === value;

  const handlePress = () => {
    onValueChange(value);
    setInputValue(label);
    setOpen(false);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 9,
          paddingHorizontal: 12,
          borderRadius: 6,
          backgroundColor: isSelected
            ? colors.surfaceMuted
            : pressed
            ? colors.surfaceMuted
            : colors.transparent,
          justifyContent: 'space-between',
        },
        style,
      ]}
    >
      <Text
        style={{
          fontSize: 14,
          color: colors.text,
          fontWeight: isSelected ? '500' : '400',
        }}
      >
        {children || label}
      </Text>
      {isSelected && <CheckIcon color={colors.primary} />}
    </Pressable>
  );
}

export interface ComboboxEmptyProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ComboboxEmpty({
  children = 'No results found.',
  style,
}: ComboboxEmptyProps) {
  const { inputValue, colors } = useCombobox();

  // Only show if there's an input value that resulted in no matches.
  // Wait, let's keep it simple: ComboboxContent will render it if user wants,
  // or we can let it render directly as a text helper.
  return (
    <View style={[{ padding: 12, alignItems: 'center' }, style]}>
      <Text style={{ fontSize: 13, color: colors.textMuted }}>{children}</Text>
    </View>
  );
}
