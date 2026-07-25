import React from 'react';
import { Animated, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { useTheme } from '../theme';

export interface SkeletonProps extends ViewProps {
  animated?: boolean;
  radius?: keyof ReturnType<typeof useTheme>['radii'];
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({
  animated = true,
  radius = 'md',
  style,
  ...props
}: SkeletonProps) {
  const { colors, radii } = useTheme();
  const opacity = React.useRef(new Animated.Value(0.55)).current;

  React.useEffect(() => {
    if (!animated) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.55,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [animated, opacity]);

  return (
    <Animated.View style={{ opacity }}>
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
