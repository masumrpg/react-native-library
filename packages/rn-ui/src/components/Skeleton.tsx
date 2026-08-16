import React from "react";
import {
  StyleSheet,
  View,
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

export interface SkeletonProps extends ViewProps {
  animated?: boolean;
  radius?: keyof ReturnType<typeof useTheme>["radii"];
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({
  animated = true,
  radius = "md",
  style,
  onLayout,
  ...props
}: SkeletonProps) {
  const { colors, radii } = useTheme();
  const [containerWidth, setContainerWidth] = React.useState(0);

  const opacity = useSharedValue(0.6);
  const translateX = useSharedValue(-100);

  React.useEffect(() => {
    if (!animated) {
      cancelAnimation(opacity);
      cancelAnimation(translateX);
      opacity.value = 1;
      return;
    }

    // Pulse animation
    opacity.value = 0.5;
    opacity.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );

    // Shimmer sweep animation
    const targetWidth = containerWidth > 0 ? containerWidth * 1.5 : 300;
    translateX.value = -targetWidth;
    translateX.value = withRepeat(
      withTiming(targetWidth, {
        duration: 1300,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    return () => {
      cancelAnimation(opacity);
      cancelAnimation(translateX);
    };
  }, [animated, containerWidth, opacity, translateX]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && w !== containerWidth) {
      setContainerWidth(w);
    }
    onLayout?.(e);
  };

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const shimmerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

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
              width: "50%",
              backgroundColor: colors.surface,
              opacity: 0.35,
            },
            shimmerAnimatedStyle,
          ]}
        />
      )}
    </Animated.View>
  );
}
