import React from "react";
import {
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../theme";
import { Text } from "./Text";

export interface TabsContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

export interface TabsProps extends ViewProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  style,
  ...props
}: TabsProps) {
  const { spacing } = useTheme();
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const currentValue = value ?? internalValue;
  const handleValueChange = React.useCallback(
    (next: string) => {
      if (value === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [onValueChange, value],
  );

  const context = React.useMemo(
    () => ({ value: currentValue, onValueChange: handleValueChange }),
    [currentValue, handleValueChange],
  );

  return (
    <TabsContext.Provider value={context}>
      <View style={[{ width: "100%", gap: spacing.md }, style]} {...props} />
    </TabsContext.Provider>
  );
}

export interface TabsListProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export function TabsList({ style, ...props }: TabsListProps) {
  const { colors, components, radii, spacing } = useTheme();

  return (
    <View
      style={[
        {
          width: "100%",
          minHeight: 44,
          padding: 3,
          borderRadius: radii.lg,
          borderWidth: components.borderWidth.strong,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          flexDirection: "row",
          gap: spacing.xs,
        },
        style,
      ]}
      {...props}
    />
  );
}

export interface TabsTriggerProps extends Omit<PressableProps, "style"> {
  value: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function TabsTrigger({
  value,
  children,
  style,
  disabled,
  ...props
}: TabsTriggerProps) {
  const context = React.useContext(TabsContext);
  const { colors, radii, spacing } = useTheme();
  const active = context?.value === value;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active, disabled: Boolean(disabled) }}
      disabled={disabled}
      onPress={() => context?.onValueChange?.(value)}
      style={({ pressed }) => [
        {
          flex: 1,
          minHeight: 36,
          borderRadius: radii.md,
          backgroundColor: active ? colors.primary : colors.transparent,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: spacing.md,
          opacity: disabled ? 0.5 : pressed ? 0.78 : 1,
        },
        style,
      ]}
      {...props}
    >
      {typeof children === "string" ? (
        <Text
          variant="label"
          style={{ color: active ? colors.onPrimary : colors.textMuted }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

export interface TabsContentProps extends ViewProps {
  value: string;
  forceMount?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function TabsContent({
  value,
  forceMount = false,
  style,
  ...props
}: TabsContentProps) {
  const context = React.useContext(TabsContext);
  const active = context?.value === value;

  if (!active && !forceMount) return null;
  return (
    <View style={[{ display: active ? "flex" : "none" }, style]} {...props} />
  );
}
