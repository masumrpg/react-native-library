import React from "react";
import {
  StyleSheet,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "../theme";

export type SkeletonShimmerDirection =
  | "top-left-to-bottom-right"
  | "left-to-right"
  | "top-to-bottom"
  | "top-right-to-bottom-left";

export interface SkeletonProps extends ViewProps {
  animated?: boolean;
  radius?: keyof ReturnType<typeof useTheme>["radii"];
  direction?: SkeletonShimmerDirection;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({
  animated = true,
  radius = "md",
  direction = "top-left-to-bottom-right",
  style,
  onLayout,
  ...props
}: SkeletonProps) {
  const { colors, radii } = useTheme();

  const widthSV = useSharedValue(0);
  const heightSV = useSharedValue(0);
  const opacity = useSharedValue(0.65);
  const translateProgress = useSharedValue(-1);

  React.useEffect(() => {
    if (!animated) {
      cancelAnimation(opacity);
      cancelAnimation(translateProgress);
      opacity.value = 1;
      return;
    }

    // Subtle background pulse
    opacity.value = 0.65;
    opacity.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );

    // Continuous -1 to 1 loop on UI thread
    const startProgress = direction === "top-right-to-bottom-left" ? 1 : -1;
    const endProgress = direction === "top-right-to-bottom-left" ? -1 : 1;

    translateProgress.value = startProgress;
    translateProgress.value = withRepeat(
      withTiming(endProgress, {
        duration: 1500,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    return () => {
      cancelAnimation(opacity);
      cancelAnimation(translateProgress);
    };
  }, [animated, direction]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && (width !== widthSV.value || height !== heightSV.value)) {
      widthSV.value = width;
      heightSV.value = height;
    }
    onLayout?.(e);
  };

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const shimmerAnimatedStyle = useAnimatedStyle(() => {
    const w = widthSV.value || 200;
    const h = heightSV.value || 100;
    const sweepDistance = (w + h) * 1.5;
    const currentTranslate = translateProgress.value * sweepDistance;
    const shimmerWidth = Math.max(40, Math.min(w * 0.3, 100));

    switch (direction) {
      case "top-to-bottom":
        return {
          width: shimmerWidth,
          transform: [{ translateY: currentTranslate }],
        };
      case "top-right-to-bottom-left":
        return {
          width: shimmerWidth,
          transform: [{ translateX: currentTranslate }, { rotate: "-25deg" }],
        };
      case "left-to-right":
        return {
          width: shimmerWidth,
          transform: [{ translateX: currentTranslate }],
        };
      case "top-left-to-bottom-right":
      default:
        return {
          width: shimmerWidth,
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
      onLayout={handleLayout}
      {...props}
    >
      {animated && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              top: -60,
              bottom: -60,
              backgroundColor: colors.surface,
              opacity: 0.25,
            },
            shimmerAnimatedStyle,
          ]}
        />
      )}
    </Animated.View>
  );
}
