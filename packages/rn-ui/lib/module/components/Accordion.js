"use strict";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, Text as RNText, View } from "react-native";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useTheme } from "../theme/index.js";
import { renderIcon } from "./types.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function renderIndicator(indicator, expanded, color, size) {
  if (typeof indicator === "function") {
    return indicator({
      expanded,
      color,
      size
    });
  }
  if (indicator) {
    return indicator;
  }
  return /*#__PURE__*/_jsx(RNText, {
    style: {
      color,
      fontSize: size,
      lineHeight: size,
      fontWeight: "700"
    },
    children: expanded ? "-" : "+"
  });
}
function DefaultAccordionContent({
  expanded,
  children,
  duration,
  style
}) {
  const progress = useSharedValue(expanded ? 1 : 0);
  const [contentHeight, setContentHeight] = useState(0);
  const [shouldRender, setShouldRender] = useState(expanded);
  useEffect(() => {
    if (expanded) {
      setShouldRender(true);
    }
    progress.value = withTiming(expanded ? 1 : 0, {
      duration
    }, finished => {
      if (finished && !expanded) {
        runOnJS(setShouldRender)(false);
      }
    });
  }, [duration, expanded, progress]);
  const animatedStyle = useAnimatedStyle(() => ({
    height: progress.value * contentHeight,
    opacity: progress.value
  }));
  if (!shouldRender && !expanded) {
    return null;
  }
  return /*#__PURE__*/_jsx(Animated.View, {
    style: [{
      overflow: "hidden"
    }, animatedStyle],
    children: /*#__PURE__*/_jsx(View, {
      style: [style, {
        position: "absolute",
        left: 0,
        right: 0
      }],
      onLayout: event => {
        setContentHeight(event.nativeEvent.layout.height);
      },
      children: children
    })
  });
}
function DefaultAccordionIndicator({
  expanded,
  children,
  duration,
  style
}) {
  const progress = useSharedValue(expanded ? 1 : 0);
  useEffect(() => {
    progress.value = withTiming(expanded ? 1 : 0, {
      duration
    });
  }, [duration, expanded, progress]);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{
      rotate: `${progress.value * 180}deg`
    }]
  }));
  return /*#__PURE__*/_jsx(Animated.View, {
    style: [style, animatedStyle],
    children: children
  });
}
export function Accordion({
  items,
  allowMultiple = false,
  defaultOpenIds = [],
  openIds,
  onOpenChange,
  disabled = false,
  animated = true,
  animationDuration = 180,
  animationComponents,
  indicator,
  itemStyle,
  headerStyle,
  titleStyle,
  subtitleStyle,
  contentStyle,
  style
}) {
  const {
    colors,
    components,
    radii,
    spacing,
    typography
  } = useTheme();
  const [internalOpenIds, setInternalOpenIds] = useState(defaultOpenIds);
  const activeOpenIds = openIds ?? internalOpenIds;
  const openSet = useMemo(() => new Set(activeOpenIds), [activeOpenIds]);
  const setNextOpenIds = useCallback(nextOpenIds => {
    if (!openIds) {
      setInternalOpenIds(nextOpenIds);
    }
    onOpenChange?.(nextOpenIds);
  }, [onOpenChange, openIds]);
  const AnimatedContent = animationComponents?.Content ?? DefaultAccordionContent;
  const AnimatedIndicator = animationComponents?.Indicator ?? DefaultAccordionIndicator;
  const toggleItem = useCallback(item => {
    if (disabled || item.disabled) return;
    const expanded = openSet.has(item.id);
    const nextOpenIds = expanded ? activeOpenIds.filter(id => id !== item.id) : allowMultiple ? [...activeOpenIds, item.id] : [item.id];
    setNextOpenIds(nextOpenIds);
  }, [activeOpenIds, allowMultiple, disabled, openSet, setNextOpenIds]);
  return /*#__PURE__*/_jsx(View, {
    style: [{
      gap: spacing.sm
    }, style],
    children: items.map(item => {
      const expanded = openSet.has(item.id);
      const itemDisabled = disabled || item.disabled;
      return /*#__PURE__*/_jsxs(View, {
        style: [{
          backgroundColor: colors.surface,
          borderRadius: radii.xl,
          borderWidth: components.borderWidth.strong,
          borderColor: expanded ? colors.primary : colors.border,
          overflow: "hidden",
          opacity: itemDisabled ? 0.58 : 1
        }, itemStyle],
        children: [/*#__PURE__*/_jsxs(Pressable, {
          accessibilityRole: "button",
          accessibilityState: {
            expanded,
            disabled: itemDisabled
          },
          disabled: itemDisabled,
          onPress: () => toggleItem(item),
          style: ({
            pressed
          }) => [{
            padding: spacing.lg,
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
            backgroundColor: pressed && !itemDisabled ? colors.backgroundMuted : colors.surface
          }, headerStyle],
          children: [renderIcon(item.icon, expanded ? colors.primary : colors.textMuted, 20), /*#__PURE__*/_jsxs(View, {
            style: {
              flex: 1,
              gap: spacing.xxs
            },
            children: [typeof item.title === "string" ? /*#__PURE__*/_jsx(RNText, {
              style: [typography.subtitle, {
                color: expanded ? colors.primary : colors.text
              }, titleStyle],
              children: item.title
            }) : item.title, typeof item.subtitle === "string" ? /*#__PURE__*/_jsx(RNText, {
              style: [typography.bodySmall, {
                color: colors.textMuted
              }, subtitleStyle],
              children: item.subtitle
            }) : item.subtitle]
          }), /*#__PURE__*/_jsx(View, {
            style: {
              width: 24,
              height: 24,
              alignItems: "center",
              justifyContent: "center"
            },
            children: animated ? /*#__PURE__*/_jsx(AnimatedIndicator, {
              expanded: expanded,
              duration: animationDuration,
              children: renderIndicator(indicator, expanded, expanded ? colors.primary : colors.textMuted, 18)
            }) : renderIndicator(indicator, expanded, expanded ? colors.primary : colors.textMuted, 18)
          })]
        }), animated ? /*#__PURE__*/_jsx(AnimatedContent, {
          expanded: expanded,
          duration: animationDuration,
          style: [{
            borderTopWidth: 1,
            borderTopColor: colors.border,
            padding: spacing.lg,
            backgroundColor: colors.surface
          }, contentStyle],
          children: typeof item.content === "string" ? /*#__PURE__*/_jsx(RNText, {
            style: [typography.body, {
              color: colors.textMuted
            }],
            children: item.content
          }) : item.content
        }) : expanded && /*#__PURE__*/_jsx(View, {
          style: [{
            borderTopWidth: 1,
            borderTopColor: colors.border,
            padding: spacing.lg,
            backgroundColor: colors.surface
          }, contentStyle],
          children: typeof item.content === "string" ? /*#__PURE__*/_jsx(RNText, {
            style: [typography.body, {
              color: colors.textMuted
            }],
            children: item.content
          }) : item.content
        })]
      }, item.id);
    })
  });
}
//# sourceMappingURL=Accordion.js.map