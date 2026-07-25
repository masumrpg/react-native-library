import React from "react";
import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

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

  return (
    <Pressable onPress={toggle} style={style} {...props}>
      {children}
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
  const [measuredHeight, setMeasuredHeight] = React.useState(0);
  const heightAnim = useSharedValue(open ? measuredHeight : 0);

  // Track if we have completed our first height layout measurement
  const hasMeasured = measuredHeight > 0;

  React.useEffect(() => {
    if (hasMeasured) {
      heightAnim.value = withTiming(open ? measuredHeight : 0, {
        duration: 220,
      });
    } else {
      // Set initial value immediately without animating during initial layout
      heightAnim.value = open ? measuredHeight : 0;
    }
  }, [open, measuredHeight, hasMeasured, heightAnim]);

  const handleLayout = (e: any) => {
    const { height } = e.nativeEvent.layout;
    if (height > 0 && height !== measuredHeight) {
      setMeasuredHeight(height);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: hasMeasured ? heightAnim.value : open ? undefined : 0,
    opacity: hasMeasured
      ? Math.min(1, heightAnim.value / Math.max(1, measuredHeight))
      : open
        ? 1
        : 0,
  }));

  return (
    <Animated.View
      pointerEvents={open ? "auto" : "none"}
      style={[
        {
          overflow: "hidden",
        },
        animatedStyle,
        style,
      ]}
      {...props}
    >
      {/* Nested inner view is required to measure natural scroll height boundary */}
      <View onLayout={handleLayout} style={{ width: "100%" }}>
        {children}
      </View>
    </Animated.View>
  );
}
