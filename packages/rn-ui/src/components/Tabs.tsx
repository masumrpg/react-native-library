import React from "react";
import {
  Pressable,
  View,
  type LayoutChangeEvent,
  type PressableProps,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "../theme";
import { triggerHaptic } from "../utils/haptics";
import { Text } from "./Text";
import {
  renderIcon,
  type RenderIcon,
  type BaseAnimatedProps,
  type BaseGlassProps,
  type BaseHapticProps,
  type SizeProps,
  type VariantProps,
} from "./types";

export type TabsVariant = "segmented" | "pills" | "underline" | "soft";
export type TabsSize = "sm" | "md" | "lg";

export interface TabNodeLayout {
  x: number;
  width: number;
  height: number;
}

export interface TabsContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  variant: TabsVariant;
  size: TabsSize;
  glass: boolean;
  haptic: boolean;
  animated: boolean;
  registerTabNode: (value: string, layout: TabNodeLayout) => void;
  tabNodes: Record<string, TabNodeLayout>;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

export function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs compound components must be rendered inside <Tabs />");
  }
  return context;
}

export interface TabsProps
  extends ViewProps,
    BaseGlassProps,
    BaseHapticProps,
    BaseAnimatedProps,
    VariantProps<TabsVariant>,
    SizeProps<TabsSize> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

export function Tabs({
  value,
  defaultValue,
  variant = "segmented",
  size = "md",
  glass = false,
  haptic = true,
  animated = true,
  onValueChange,
  style,
  ...props
}: TabsProps) {
  const { spacing } = useTheme();
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [tabNodes, setTabNodes] = React.useState<Record<string, TabNodeLayout>>({});

  const currentValue = value ?? internalValue;

  const registerTabNode = React.useCallback(
    (tabValue: string, layout: TabNodeLayout) => {
      setTabNodes((prev) => {
        if (
          prev[tabValue]?.x === layout.x &&
          prev[tabValue]?.width === layout.width
        ) {
          return prev;
        }
        return { ...prev, [tabValue]: layout };
      });
    },
    [],
  );

  const handleValueChange = React.useCallback(
    (next: string) => {
      if (haptic) triggerHaptic("selection");
      if (value === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [haptic, onValueChange, value],
  );

  const context = React.useMemo(
    () => ({
      value: currentValue,
      onValueChange: handleValueChange,
      variant,
      size,
      glass,
      haptic,
      animated,
      registerTabNode,
      tabNodes,
    }),
    [
      currentValue,
      handleValueChange,
      variant,
      size,
      glass,
      haptic,
      animated,
      registerTabNode,
      tabNodes,
    ],
  );

  return (
    <TabsContext.Provider value={context}>
      <View style={[{ width: "100%", gap: spacing.md }, style]} {...props} />
    </TabsContext.Provider>
  );
}

const listHeights: Record<TabsSize, number> = {
  sm: 36,
  md: 44,
  lg: 52,
};

export interface TabsListProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export function TabsList({ style, children, ...props }: TabsListProps) {
  const { colors, components, radii, spacing, isDark } = useTheme();
  const { value, variant, size, glass, animated, tabNodes } = useTabsContext();

  const activeNode = value ? tabNodes[value] : undefined;

  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const initialized = useSharedValue(false);

  React.useEffect(() => {
    if (activeNode && activeNode.width > 0) {
      if (!animated || !initialized.value) {
        indicatorX.value = activeNode.x;
        indicatorWidth.value = activeNode.width;
        initialized.value = true;
      } else {
        indicatorX.value = withTiming(activeNode.x, { duration: 180 });
        indicatorWidth.value = withTiming(activeNode.width, { duration: 180 });
      }
    }
  }, [activeNode, animated, indicatorX, indicatorWidth, initialized]);

  const glassBg = isDark
    ? "rgba(15, 27, 45, 0.70)"
    : "rgba(255, 255, 255, 0.85)";

  const isUnderline = variant === "underline";
  const isPills = variant === "pills";

  const height = listHeights[size];

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorWidth.value,
  }));

  const activeBg =
    variant === "segmented" || variant === "pills"
      ? colors.primary
      : variant === "soft"
        ? colors.primarySoft
        : colors.transparent;

  const padding = isUnderline ? 0 : 4;
  // Concentric radius rule: InnerRadius = OuterRadius - Padding (16 - 4 = 12px)
  const innerRadius = isPills
    ? radii.full
    : isUnderline
      ? 0
      : radii.md;

  return (
    <View
      style={[
        {
          width: "100%",
          minHeight: height,
          height: isUnderline ? undefined : height,
          padding,
          borderRadius: isUnderline ? 0 : radii.lg,
          borderWidth: isUnderline ? 0 : components.borderWidth.strong,
          borderColor: glass
            ? isDark
              ? "rgba(248, 250, 252, 0.20)"
              : "rgba(15, 23, 42, 0.14)"
            : colors.border,
          borderBottomWidth: isUnderline ? components.borderWidth.strong : undefined,
          borderBottomColor: isUnderline ? colors.border : undefined,
          backgroundColor: isUnderline
            ? colors.transparent
            : isPills
              ? colors.transparent
              : glass
                ? glassBg
                : colors.input,
          flexDirection: "row",
          alignItems: "stretch",
          gap: isPills ? spacing.xs : isUnderline ? spacing.md : 4,
          position: "relative",
        },
        style,
      ]}
      {...props}
    >
      {/* Concentric Sliding Active Tab Indicator */}
      {activeNode && (
        <Animated.View
          style={[
            {
              position: "absolute",
              top: isUnderline ? undefined : padding,
              bottom: isUnderline ? 0 : padding,
              height: isUnderline ? 2.5 : undefined,
              borderRadius: innerRadius,
              backgroundColor: isUnderline ? colors.primary : activeBg,
              zIndex: 0,
            },
            indicatorStyle,
          ]}
        />
      )}
      {children}
    </View>
  );
}

export interface TabsTriggerProps extends Omit<PressableProps, "style"> {
  value: string;
  icon?: RenderIcon;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function TabsTrigger({
  value,
  icon,
  children,
  style,
  disabled,
  ...props
}: TabsTriggerProps) {
  const {
    value: selectedValue,
    onValueChange,
    variant,
    size,
    registerTabNode,
  } = useTabsContext();
  const { colors, radii, spacing } = useTheme();
  const active = selectedValue === value;

  const handleLayout = (event: LayoutChangeEvent) => {
    const { x, width, height } = event.nativeEvent.layout;
    registerTabNode(value, { x, width, height });
  };

  const activeTextColor =
    variant === "segmented" || variant === "pills"
      ? colors.onPrimary
      : colors.primary;

  const isPills = variant === "pills";
  const isUnderline = variant === "underline";

  const triggerRadius = isPills ? radii.full : isUnderline ? 0 : radii.md;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active, disabled: Boolean(disabled) }}
      disabled={disabled}
      onLayout={handleLayout}
      onPress={() => onValueChange?.(value)}
      style={({ pressed }) => [
        {
          flex: 1,
          height: isUnderline ? listHeights[size] : "100%",
          borderRadius: triggerRadius,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: spacing.xs,
          paddingHorizontal: spacing.sm,
          zIndex: 1,
          opacity: disabled ? 0.5 : pressed ? 0.82 : 1,
        },
        style,
      ]}
      {...props}
    >
      {icon
        ? renderIcon(
            icon,
            active ? activeTextColor : colors.textMuted,
            size === "sm" ? 14 : 16,
          )
        : null}
      {typeof children === "string" ? (
        <Text
          variant={size === "sm" ? "bodySmall" : "label"}
          weight={active ? "600" : "400"}
          style={{ color: active ? activeTextColor : colors.textMuted }}
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
  const { value: selectedValue } = useTabsContext();
  const active = selectedValue === value;

  if (!active && !forceMount) return null;
  return (
    <View style={[{ display: active ? "flex" : "none" }, style]} {...props} />
  );
}
