"use strict";

import React from "react";
import { Pressable, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { jsx as _jsx } from "react/jsx-runtime";
const CollapsibleContext = /*#__PURE__*/React.createContext(null);
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
}) {
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
  return /*#__PURE__*/_jsx(CollapsibleContext.Provider, {
    value: {
      open,
      toggle
    },
    children: /*#__PURE__*/_jsx(View, {
      style: style,
      ...props,
      children: children
    })
  });
}
export function CollapsibleTrigger({
  children,
  style,
  ...props
}) {
  const {
    toggle
  } = useCollapsible();
  return /*#__PURE__*/_jsx(Pressable, {
    onPress: toggle,
    style: style,
    ...props,
    children: children
  });
}
export function CollapsibleContent({
  children,
  style,
  ...props
}) {
  const {
    open
  } = useCollapsible();
  const [measuredHeight, setMeasuredHeight] = React.useState(0);
  const heightAnim = useSharedValue(open ? measuredHeight : 0);

  // Track if we have completed our first height layout measurement
  const hasMeasured = measuredHeight > 0;
  React.useEffect(() => {
    if (hasMeasured) {
      heightAnim.value = withTiming(open ? measuredHeight : 0, {
        duration: 220
      });
    } else {
      // Set initial value immediately without animating during initial layout
      heightAnim.value = open ? measuredHeight : 0;
    }
  }, [open, measuredHeight, hasMeasured, heightAnim]);
  const handleLayout = e => {
    const {
      height
    } = e.nativeEvent.layout;
    if (height > 0 && height !== measuredHeight) {
      setMeasuredHeight(height);
    }
  };
  const animatedStyle = useAnimatedStyle(() => ({
    height: hasMeasured ? heightAnim.value : open ? undefined : 0,
    opacity: hasMeasured ? Math.min(1, heightAnim.value / Math.max(1, measuredHeight)) : open ? 1 : 0
  }));
  return /*#__PURE__*/_jsx(Animated.View, {
    pointerEvents: open ? "auto" : "none",
    style: [{
      overflow: "hidden"
    }, animatedStyle, style],
    ...props,
    children: /*#__PURE__*/_jsx(View, {
      onLayout: handleLayout,
      style: {
        width: "100%"
      },
      children: children
    })
  });
}
//# sourceMappingURL=Collapsible.js.map