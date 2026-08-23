import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Pressable,
  Text as RNText,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "../theme";
import { triggerHaptic } from "../utils/haptics";
import { renderIcon, type RenderIcon, type BaseGlassProps } from "./types";

export type AccordionVariant = "outlined" | "flat" | "ghost" | "glass";

export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: RenderIcon;
  disabled?: boolean;
}

export interface AccordionIndicatorProps {
  expanded: boolean;
  color: string;
  size: number;
}

export interface AccordionAnimatedContentProps {
  expanded: boolean;
  children: React.ReactNode;
  duration: number;
  style?: StyleProp<ViewStyle>;
}

export interface AccordionAnimatedIndicatorProps {
  expanded: boolean;
  children: React.ReactNode;
  duration: number;
  style?: StyleProp<ViewStyle>;
}

export interface AccordionAnimationComponents {
  Content?: React.ComponentType<AccordionAnimatedContentProps>;
  Indicator?: React.ComponentType<AccordionAnimatedIndicatorProps>;
}

export type AccordionIndicator =
  | React.ReactNode
  | ((props: AccordionIndicatorProps) => React.ReactNode);

export interface AccordionProps extends BaseGlassProps {
  items: AccordionItem[];
  variant?: AccordionVariant;
  allowMultiple?: boolean;
  defaultOpenIds?: string[];
  openIds?: string[];
  onOpenChange?: (openIds: string[]) => void;
  disabled?: boolean;
  animated?: boolean;
  haptic?: boolean;
  animationDuration?: number;
  animationComponents?: AccordionAnimationComponents;
  indicator?: AccordionIndicator;
  itemStyle?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}

function renderIndicator(
  indicator: AccordionIndicator | undefined,
  expanded: boolean,
  color: string,
  size: number,
) {
  if (typeof indicator === "function") {
    return indicator({ expanded, color, size });
  }

  if (indicator) {
    return indicator;
  }

  return (
    <RNText
      style={{
        color,
        fontSize: size,
        lineHeight: size,
        fontWeight: "700",
      }}
    >
      {expanded ? "-" : "+"}
    </RNText>
  );
}

function DefaultAccordionContent({
  expanded,
  children,
  duration,
  style,
}: AccordionAnimatedContentProps) {
  const progress = useSharedValue(expanded ? 1 : 0);
  const [contentHeight, setContentHeight] = useState(0);
  const [shouldRender, setShouldRender] = useState(expanded);

  useEffect(() => {
    if (expanded) {
      setShouldRender(true);
    }

    progress.value = withTiming(expanded ? 1 : 0, { duration }, (finished) => {
      if (finished && !expanded) {
        runOnJS(setShouldRender)(false);
      }
    });
  }, [duration, expanded, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: progress.value * contentHeight,
    opacity: progress.value,
  }));

  if (!shouldRender && !expanded) {
    return null;
  }

  return (
    <Animated.View style={[{ overflow: "hidden" }, animatedStyle]}>
      <View
        style={[style, { position: "absolute", left: 0, right: 0 }]}
        onLayout={(event) => {
          setContentHeight(event.nativeEvent.layout.height);
        }}
      >
        {children}
      </View>
    </Animated.View>
  );
}

function DefaultAccordionIndicator({
  expanded,
  children,
  duration,
  style,
}: AccordionAnimatedIndicatorProps) {
  const progress = useSharedValue(expanded ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(expanded ? 1 : 0, { duration });
  }, [duration, expanded, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 180}deg` }],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
}

export function Accordion({
  items,
  variant = "outlined",
  allowMultiple = false,
  defaultOpenIds = [],
  openIds,
  onOpenChange,
  disabled = false,
  animated = true,
  glass = false,
  haptic = true,
  animationDuration = 180,
  animationComponents,
  indicator,
  itemStyle,
  headerStyle,
  titleStyle,
  subtitleStyle,
  contentStyle,
  style,
}: AccordionProps) {
  const { colors, components, radii, spacing, typography, isDark } = useTheme();
  const [internalOpenIds, setInternalOpenIds] = useState(defaultOpenIds);
  const activeOpenIds = openIds ?? internalOpenIds;

  const openSet = useMemo(() => new Set(activeOpenIds), [activeOpenIds]);

  const setNextOpenIds = useCallback(
    (nextOpenIds: string[]) => {
      if (!openIds) {
        setInternalOpenIds(nextOpenIds);
      }

      onOpenChange?.(nextOpenIds);
    },
    [onOpenChange, openIds],
  );

  const AnimatedContent =
    animationComponents?.Content ?? DefaultAccordionContent;
  const AnimatedIndicator =
    animationComponents?.Indicator ?? DefaultAccordionIndicator;

  const isGlass = glass || variant === "glass";
  const isFlat = variant === "flat";
  const isGhost = variant === "ghost";

  const glassBg = isDark
    ? "rgba(15, 27, 45, 0.60)"
    : "rgba(255, 255, 255, 0.75)";

  const toggleItem = useCallback(
    (item: AccordionItem) => {
      if (disabled || item.disabled) return;

      if (haptic) triggerHaptic("selection");
      const expanded = openSet.has(item.id);
      const nextOpenIds = expanded
        ? activeOpenIds.filter((id) => id !== item.id)
        : allowMultiple
          ? [...activeOpenIds, item.id]
          : [item.id];

      setNextOpenIds(nextOpenIds);
    },
    [activeOpenIds, allowMultiple, disabled, haptic, openSet, setNextOpenIds],
  );

  return (
    <View style={[{ gap: isGhost ? 0 : spacing.sm }, style]}>
      {items.map((item, index) => {
        const expanded = openSet.has(item.id);
        const itemDisabled = disabled || item.disabled;

        const itemBg = isGlass
          ? glassBg
          : isGhost
            ? colors.transparent
            : isFlat
              ? isDark
                ? "rgba(15, 28, 38, 0.6)"
                : colors.backgroundMuted
              : colors.surface;

        const itemBorderColor = isGlass
          ? isDark
            ? "rgba(248, 250, 252, 0.20)"
            : "rgba(15, 23, 42, 0.14)"
          : isGhost
            ? colors.border
            : isFlat
              ? "transparent"
              : expanded
                ? colors.primary
                : colors.border;

        const borderWidth = isGhost
          ? 0
          : isFlat
            ? 0
            : components.borderWidth.strong;

        const borderBottomWidth = isGhost && index < items.length - 1 ? 1 : borderWidth;

        return (
          <View
            key={item.id}
            style={[
              {
                backgroundColor: itemBg,
                borderRadius: isGhost ? 0 : radii.xl,
                borderWidth,
                borderBottomWidth,
                borderColor: itemBorderColor,
                overflow: "hidden",
                opacity: itemDisabled ? 0.58 : 1,
              },
              itemStyle,
            ]}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded, disabled: itemDisabled }}
              disabled={itemDisabled}
              onPress={() => toggleItem(item)}
              style={({ pressed }) => [
                {
                  padding: spacing.lg,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                  backgroundColor:
                    pressed && !itemDisabled
                      ? colors.backgroundMuted
                      : colors.transparent,
                },
                headerStyle,
              ]}
            >
              {renderIcon(
                item.icon,
                expanded ? colors.primary : colors.textMuted,
                20,
              )}

              <View style={{ flex: 1, gap: spacing.xxs }}>
                {typeof item.title === "string" ? (
                  <RNText
                    style={[
                      typography.subtitle,
                      { color: expanded ? colors.primary : colors.text },
                      titleStyle,
                    ]}
                  >
                    {item.title}
                  </RNText>
                ) : (
                  item.title
                )}

                {typeof item.subtitle === "string" ? (
                  <RNText
                    style={[
                      typography.bodySmall,
                      { color: colors.textMuted },
                      subtitleStyle,
                    ]}
                  >
                    {item.subtitle}
                  </RNText>
                ) : (
                  item.subtitle
                )}
              </View>

              <View
                style={{
                  width: 24,
                  height: 24,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {animated ? (
                  <AnimatedIndicator
                    expanded={expanded}
                    duration={animationDuration}
                  >
                    {renderIndicator(
                      indicator,
                      expanded,
                      expanded ? colors.primary : colors.textMuted,
                      18,
                    )}
                  </AnimatedIndicator>
                ) : (
                  renderIndicator(
                    indicator,
                    expanded,
                    expanded ? colors.primary : colors.textMuted,
                    18,
                  )
                )}
              </View>
            </Pressable>

            {animated ? (
              <AnimatedContent
                expanded={expanded}
                duration={animationDuration}
                style={[
                  {
                    borderTopWidth: isGhost ? 0 : 1,
                    borderTopColor: colors.border,
                    padding: spacing.lg,
                    backgroundColor: colors.transparent,
                  },
                  contentStyle,
                ]}
              >
                {typeof item.content === "string" ? (
                  <RNText
                    style={[typography.body, { color: colors.textMuted }]}
                  >
                    {item.content}
                  </RNText>
                ) : (
                  item.content
                )}
              </AnimatedContent>
            ) : (
              expanded && (
                <View
                  style={[
                    {
                      borderTopWidth: isGhost ? 0 : 1,
                      borderTopColor: colors.border,
                      padding: spacing.lg,
                      backgroundColor: colors.transparent,
                    },
                    contentStyle,
                  ]}
                >
                  {typeof item.content === "string" ? (
                    <RNText
                      style={[typography.body, { color: colors.textMuted }]}
                    >
                      {item.content}
                    </RNText>
                  ) : (
                    item.content
                  )}
                </View>
              )
            )}
          </View>
        );
      })}
    </View>
  );
}
