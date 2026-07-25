import React from "react";
import {
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
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
  ...props
}: SkeletonProps) {
  const { colors, radii } = useTheme();
  const opacity = useSharedValue(animated ? 0.55 : 1);

  React.useEffect(() => {
    if (!animated) {
      cancelAnimation(opacity);
      opacity.value = 1;
      return;
    }

    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 700 }),
        withTiming(0.55, { duration: 700 }),
      ),
      -1,
      true,
    );
    return () => cancelAnimation(opacity);
  }, [animated, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <View
        style={[
          {
            backgroundColor: colors.backgroundSubtle,
            borderRadius: radii[radius],
          },
          style,
        ]}
        {...props}
      />
    </Animated.View>
  );
}
