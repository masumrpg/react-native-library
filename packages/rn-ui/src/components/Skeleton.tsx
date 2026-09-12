import React, { createContext, useContext, useEffect, useMemo } from "react";
import {
  Dimensions,
  StyleSheet,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

import { useTheme } from "../theme";

export type SkeletonShimmerDirection =
  | "top-left-to-bottom-right"
  | "left-to-right"
  | "top-to-bottom"
  | "top-right-to-bottom-left";

export interface SkeletonGroupContextValue {
  progress: SharedValue<number>;
  animated: boolean;
}

export const SkeletonContext = createContext<SkeletonGroupContextValue | null>(null);

export interface SkeletonGroupProps {
  /** Whether the shared shimmer animation is actively running */
  animated?: boolean;
  /** Duration of one shimmer sweep in milliseconds. Defaults to 1400ms */
  duration?: number;
  children: React.ReactNode;
}

/**
 * SkeletonGroup optimizes multi-skeleton screens by driving all child Skeleton
 * components with a single, shared animation clock on the UI thread.
 * This drastically reduces UI thread worklet overhead, memory footprint, and frame drops.
 */
export function SkeletonGroup({
  animated = true,
  duration = 1400,
  children,
}: SkeletonGroupProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!animated) {
      cancelAnimation(progress);
      progress.value = 0;
      return;
    }

    progress.value = 0;
    progress.value = withRepeat(
      withTiming(1, {
        duration,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    return () => {
      cancelAnimation(progress);
    };
  }, [animated, duration, progress]);

  const value = useMemo(
    () => ({
      progress,
      animated,
    }),
    [progress, animated],
  );

  return (
    <SkeletonContext.Provider value={value}>
      {children}
    </SkeletonContext.Provider>
  );
}

export interface SkeletonProps extends ViewProps {
  /** Whether shimmer animation is enabled. Defaults to true */
  animated?: boolean;
  /** Border radius token from the theme. Defaults to "md" */
  radius?: keyof ReturnType<typeof useTheme>["radii"];
  /** Direction of the shimmer wave sweep */
  direction?: SkeletonShimmerDirection;
  /** Additional styling applied to the skeleton placeholder */
  style?: StyleProp<ViewStyle>;
  /** Optional inner children */
  children?: React.ReactNode;
}

const SCREEN_WIDTH = Dimensions.get("window").width || 380;
const SWEEP_DISTANCE = SCREEN_WIDTH * 1.5;
const SHIMMER_BAR_WIDTH = Math.max(60, Math.min(SCREEN_WIDTH * 0.35, 120));

function SkeletonComponent({
  animated = true,
  radius = "md",
  direction = "top-left-to-bottom-right",
  style,
  children,
  ...props
}: SkeletonProps) {
  const { colors, radii } = useTheme();
  const groupContext = useContext(SkeletonContext);

  // If inside a SkeletonGroup, inherit the shared UI-thread clock; otherwise use a single local clock.
  const localProgress = useSharedValue(0);
  const progress = groupContext ? groupContext.progress : localProgress;
  const isAnimated = groupContext ? groupContext.animated && animated : animated;

  useEffect(() => {
    if (groupContext) return; // Managed by SkeletonGroup

    if (!isAnimated) {
      cancelAnimation(localProgress);
      localProgress.value = 0;
      return;
    }

    localProgress.value = 0;
    localProgress.value = withRepeat(
      withTiming(1, {
        duration: 1400,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    return () => {
      cancelAnimation(localProgress);
    };
  }, [groupContext, isAnimated, localProgress]);

  // Subtle breathing pulse on the container
  const containerAnimatedStyle = useAnimatedStyle(() => {
    if (!isAnimated) return { opacity: 1 };
    const opacity = interpolate(progress.value, [0, 0.5, 1], [0.75, 1, 0.75]);
    return { opacity };
  });

  // Single performant transform worklet for the shimmer wave
  const shimmerAnimatedStyle = useAnimatedStyle(() => {
    if (!isAnimated) return { opacity: 0 };

    const startPos = direction === "top-right-to-bottom-left" ? SWEEP_DISTANCE : -SWEEP_DISTANCE;
    const endPos = direction === "top-right-to-bottom-left" ? -SWEEP_DISTANCE : SWEEP_DISTANCE;
    const currentTranslate = interpolate(progress.value, [0, 1], [startPos, endPos]);

    switch (direction) {
      case "top-to-bottom":
        return {
          transform: [{ translateY: currentTranslate }],
        };
      case "top-right-to-bottom-left":
        return {
          transform: [{ translateX: currentTranslate }, { rotate: "-25deg" }],
        };
      case "left-to-right":
        return {
          transform: [{ translateX: currentTranslate }],
        };
      case "top-left-to-bottom-right":
      default:
        return {
          transform: [{ translateX: currentTranslate }, { rotate: "25deg" }],
        };
    }
  });

  return (
    <Animated.View
      style={[
        {
          backgroundColor: colors.backgroundSubtle,
          borderRadius: radii[radius],
          overflow: "hidden",
          position: "relative",
        },
        style,
        containerAnimatedStyle,
      ]}
      {...props}
    >
      {isAnimated && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              top: -60,
              bottom: -60,
              width: SHIMMER_BAR_WIDTH,
              backgroundColor: colors.surface,
              opacity: 0.28,
            },
            shimmerAnimatedStyle,
          ]}
        />
      )}
      {children}
    </Animated.View>
  );
}

export const Skeleton = React.memo(SkeletonComponent);
