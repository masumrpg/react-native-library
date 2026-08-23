import React from "react";
import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { triggerHaptic } from "../utils/haptics";

export interface CollapsibleProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface CollapsibleContextProps {
  open: boolean;
  toggle: () => void;
}

const CollapsibleContext = React.createContext<CollapsibleContextProps | null>(
  null,
);

export function useCollapsible() {
  const context = React.useContext(CollapsibleContext);
  if (!context) {
    throw new Error("useCollapsible must be used within a <Collapsible />");
  }
  return context;
}

export function Collapsible({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
  style,
  ...props
}: CollapsibleProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const toggle = React.useCallback(() => {
    const nextOpen = !open;
    if (!isControlled) {
      setUncontrolledOpen(nextOpen);
    }
    if (onOpenChange) {
      onOpenChange(nextOpen);
    }
  }, [open, isControlled, onOpenChange]);

  return (
    <CollapsibleContext.Provider value={{ open, toggle }}>
      <View style={style} {...props}>
        {children}
      </View>
    </CollapsibleContext.Provider>
  );
}

export interface CollapsibleTriggerProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function CollapsibleTrigger({
  children,
  style,
  ...props
}: CollapsibleTriggerProps) {
  const { toggle } = useCollapsible();

  const handlePress = () => {
    triggerHaptic("selection");
    toggle();
  };

  return (
    <Pressable onPress={handlePress} style={style} {...props}>
      {typeof children === "function" ? (children as any)() : children}
    </Pressable>
  );
}

export interface CollapsibleContentProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function CollapsibleContent({
  children,
  style,
  ...props
}: CollapsibleContentProps) {
  const { open } = useCollapsible();
  const [contentHeight, setContentHeight] = React.useState<number>(0);
  const progress = useSharedValue(open ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(open ? 1 : 0, {
      duration: 220,
      easing: Easing.out(Easing.quad),
    });
  }, [open, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: progress.value * contentHeight,
    opacity: progress.value,
  }));

  const handleLayout = (e: any) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0 && Math.abs(h - contentHeight) > 1) {
      setContentHeight(h);
    }
  };

  const childContent = typeof children === "function" ? (children as any)() : children;

  return (
    <View style={{ overflow: "hidden" }}>
      {/* Off-screen unconstrained measurement view to guarantee contentHeight is always valid */}
      <View
        style={[
          style,
          {
            position: "absolute",
            opacity: 0,
            top: -9999,
            left: 0,
            right: 0,
            zIndex: -1,
          },
        ]}
        onLayout={handleLayout}
        pointerEvents="none"
      >
        {childContent}
      </View>

      {/* Animated Collapsible Container */}
      <Animated.View
        pointerEvents={open ? "auto" : "none"}
        style={[{ overflow: "hidden" }, animatedStyle]}
      >
        <View style={style} {...props}>
          {childContent}
        </View>
      </Animated.View>
    </View>
  );
}
