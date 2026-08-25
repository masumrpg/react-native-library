import React, { useCallback, useImperativeHandle, useRef, useState } from "react";
import {
  Dimensions,
  LayoutChangeEvent,
  PanResponder,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "../theme";
import { triggerHaptic } from "../utils/haptics";
import { renderIcon, type ComponentTone, type RenderIcon } from "./types";
import { Text } from "./Text";

export interface SwipeableAction {
  key?: string;
  label?: string;
  icon?: RenderIcon;
  tone?: ComponentTone;
  backgroundColor?: string;
  color?: string;
  isDestructive?: boolean;
  onPress?: () => void;
  closeOnPress?: boolean;
}

export interface SwipeableItemRef {
  close: () => void;
  openLeft: () => void;
  openRight: () => void;
  dismiss: (callback?: () => void) => void;
}

export interface SwipeableItemProps {
  children: React.ReactNode;
  leftActions?: SwipeableAction[];
  rightActions?: SwipeableAction[];
  actionWidth?: number;
  fullSwipeThreshold?: number;
  onFullSwipeLeft?: () => void;
  onFullSwipeRight?: () => void;
  hapticFeedback?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

const SCREEN_WIDTH = Dimensions.get("window").width;

/**
 * High-performance SwipeableItem list row with Reanimated spring physics, collapse animation, & haptics
 */
export const SwipeableItem = React.forwardRef<SwipeableItemRef, SwipeableItemProps>(
  (
    {
      children,
      leftActions = [],
      rightActions = [],
      actionWidth = 75,
      fullSwipeThreshold = SCREEN_WIDTH * 0.42,
      onFullSwipeLeft,
      onFullSwipeRight,
      hapticFeedback = true,
      disabled = false,
      style,
      containerStyle,
    },
    ref,
  ) => {
    const { colors } = useTheme();
    const translateX = useSharedValue(0);
    const itemHeight = useSharedValue<number | null>(null);
    const itemOpacity = useSharedValue(1);
    const [measuredHeight, setMeasuredHeight] = useState<number | null>(null);
    const hasTriggeredThresholdHaptic = useRef(false);

    const maxLeftDrag = leftActions.length * actionWidth;
    const maxRightDrag = -(rightActions.length * actionWidth);

    const close = useCallback(() => {
      translateX.value = withSpring(0, {
        damping: 20,
        stiffness: 240,
        mass: 0.7,
      });
    }, [translateX]);

    const openLeft = useCallback(() => {
      if (maxLeftDrag > 0) {
        translateX.value = withSpring(maxLeftDrag, {
          damping: 20,
          stiffness: 240,
          mass: 0.7,
        });
      }
    }, [maxLeftDrag, translateX]);

    const openRight = useCallback(() => {
      if (maxRightDrag < 0) {
        translateX.value = withSpring(maxRightDrag, {
          damping: 20,
          stiffness: 240,
          mass: 0.7,
        });
      }
    }, [maxRightDrag, translateX]);

    useImperativeHandle(ref, () => ({
      close,
      openLeft,
      openRight,
      dismiss: (callback?: () => void) => {
        performDeleteCollapse(callback);
      },
    }));

    const fireHaptic = useCallback(() => {
      if (hapticFeedback) {
        triggerHaptic("selection");
      }
    }, [hapticFeedback]);

    const performDeleteCollapse = useCallback(
      (callback?: () => void) => {
        if (hapticFeedback) triggerHaptic("medium");
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: 200 });
        itemOpacity.value = withTiming(0, { duration: 180 });
        itemHeight.value = withTiming(0, { duration: 240 });
        setTimeout(() => {
          callback?.();
        }, 250);
      },
      [hapticFeedback, itemHeight, itemOpacity, translateX],
    );

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          if (disabled) return false;
          return Math.abs(gestureState.dx) > 12 && Math.abs(gestureState.dy) < 12;
        },
        onMoveShouldSetPanResponderCapture: (_, gestureState) => {
          if (disabled) return false;
          return Math.abs(gestureState.dx) > 12 && Math.abs(gestureState.dy) < 12;
        },
        onPanResponderGrant: () => {
          hasTriggeredThresholdHaptic.current = false;
        },
        onPanResponderMove: (_, gestureState) => {
          let nextX = gestureState.dx;

          if (nextX > maxLeftDrag && !onFullSwipeRight) {
            nextX = maxLeftDrag + (nextX - maxLeftDrag) * 0.22;
          } else if (nextX < maxRightDrag && !onFullSwipeLeft) {
            nextX = maxRightDrag + (nextX - maxRightDrag) * 0.22;
          }

          if (
            (nextX > fullSwipeThreshold && onFullSwipeRight) ||
            (nextX < -fullSwipeThreshold && onFullSwipeLeft)
          ) {
            if (!hasTriggeredThresholdHaptic.current) {
              hasTriggeredThresholdHaptic.current = true;
              fireHaptic();
            }
          }

          translateX.value = nextX;
        },
        onPanResponderRelease: (_, gestureState) => {
          const currentX = gestureState.dx;

          // Full swipe right trigger
          if (currentX > fullSwipeThreshold && onFullSwipeRight) {
            if (hapticFeedback) triggerHaptic("medium");
            translateX.value = withSpring(SCREEN_WIDTH, { damping: 20 });
            setTimeout(() => {
              onFullSwipeRight?.();
            }, 250);
            return;
          }

          // Full swipe left auto delete collapse
          if (currentX < -fullSwipeThreshold && onFullSwipeLeft) {
            performDeleteCollapse(onFullSwipeLeft);
            return;
          }

          // Snap to open Left actions
          if (currentX > maxLeftDrag * 0.45 && maxLeftDrag > 0) {
            if (hapticFeedback) triggerHaptic("selection");
            translateX.value = withSpring(maxLeftDrag, {
              damping: 20,
              stiffness: 240,
              mass: 0.7,
            });
            return;
          }

          // Snap to open Right actions
          if (currentX < maxRightDrag * 0.45 && maxRightDrag < 0) {
            if (hapticFeedback) triggerHaptic("selection");
            translateX.value = withSpring(maxRightDrag, {
              damping: 20,
              stiffness: 240,
              mass: 0.7,
            });
            return;
          }

          // Otherwise snap closed
          close();
        },
      }),
    ).current;

    const rowAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
    }));

    const outerAnimatedStyle = useAnimatedStyle(() => {
      if (itemHeight.value === null) {
        return { opacity: itemOpacity.value };
      }
      return {
        height: itemHeight.value,
        opacity: itemOpacity.value,
        marginBottom: itemHeight.value === 0 ? 0 : undefined,
      };
    });

    const leftContainerStyle = useAnimatedStyle(() => {
      const isVisible = translateX.value > 0;
      const opacity = interpolate(translateX.value, [0, 20], [0, 1], "clamp");
      return {
        opacity: isVisible ? opacity : 0,
        pointerEvents: isVisible ? "auto" : "none",
      };
    });

    const rightContainerStyle = useAnimatedStyle(() => {
      const isVisible = translateX.value < 0;
      const opacity = interpolate(translateX.value, [-20, 0], [1, 0], "clamp");
      return {
        opacity: isVisible ? opacity : 0,
        pointerEvents: isVisible ? "auto" : "none",
      };
    });

    const getActionToneColor = (tone?: ComponentTone) => {
      if (tone === "danger") return colors.danger;
      if (tone === "success") return colors.success;
      if (tone === "warning") return colors.warning;
      if (tone === "accent") return colors.accent;
      if (tone === "secondary") return colors.surfaceRaised;
      return colors.primary;
    };

    const handleLayout = (e: LayoutChangeEvent) => {
      const h = e.nativeEvent.layout.height;
      if (measuredHeight === null && h > 0) {
        setMeasuredHeight(h);
        itemHeight.value = h;
      }
    };

    return (
      <Animated.View
        onLayout={handleLayout}
        style={[
          {
            position: "relative",
            overflow: "hidden",
          },
          outerAnimatedStyle,
          containerStyle,
        ]}
      >
        {/* Left Actions Underlay */}
        {leftActions.length > 0 && (
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                flexDirection: "row",
                zIndex: 0,
              },
              leftContainerStyle,
            ]}
          >
            {leftActions.map((action, idx) => {
              const bg = action.backgroundColor ?? getActionToneColor(action.tone);
              const fg = action.color ?? "#FFFFFF";
              const isDestructive = action.isDestructive ?? action.tone === "danger";

              return (
                <Pressable
                  key={action.key ?? `left-action-${idx}`}
                  onPress={() => {
                    if (hapticFeedback) triggerHaptic("selection");
                    if (isDestructive) {
                      performDeleteCollapse(action.onPress);
                    } else {
                      action.onPress?.();
                      if (action.closeOnPress !== false) {
                        translateX.value = withSpring(0);
                      }
                    }
                  }}
                  style={{
                    width: actionWidth,
                    backgroundColor: bg,
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 8,
                    gap: 4,
                  }}
                >
                  {action.icon && renderIcon(action.icon, fg, 20)}
                  {action.label && (
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "600",
                        color: fg,
                        textAlign: "center",
                      }}
                    >
                      {action.label}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </Animated.View>
        )}

        {/* Right Actions Underlay */}
        {rightActions.length > 0 && (
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
                flexDirection: "row",
                zIndex: 0,
              },
              rightContainerStyle,
            ]}
          >
            {rightActions.map((action, idx) => {
              const bg = action.backgroundColor ?? getActionToneColor(action.tone ?? "danger");
              const fg = action.color ?? "#FFFFFF";
              const isDestructive = action.isDestructive ?? (action.tone === "danger" || action.label?.toLowerCase().includes("delete"));

              return (
                <Pressable
                  key={action.key ?? `right-action-${idx}`}
                  onPress={() => {
                    if (hapticFeedback) triggerHaptic("selection");
                    if (isDestructive) {
                      performDeleteCollapse(action.onPress);
                    } else {
                      action.onPress?.();
                      if (action.closeOnPress !== false) {
                        translateX.value = withSpring(0);
                      }
                    }
                  }}
                  style={{
                    width: actionWidth,
                    backgroundColor: bg,
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 8,
                    gap: 4,
                  }}
                >
                  {action.icon && renderIcon(action.icon, fg, 20)}
                  {action.label && (
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "600",
                        color: fg,
                        textAlign: "center",
                      }}
                    >
                      {action.label}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </Animated.View>
        )}

        {/* Swiping Foreground Content */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            {
              backgroundColor: colors.surface,
              zIndex: 2,
            },
            rowAnimatedStyle,
            style,
          ]}
        >
          {children}
        </Animated.View>
      </Animated.View>
    );
  },
);

SwipeableItem.displayName = "SwipeableItem";

export const SwipeableRow = SwipeableItem;
