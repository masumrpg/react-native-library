import React from 'react';
import { Animated, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { useTheme } from '../theme';

export interface ProgressProps extends ViewProps {
  value?: number;
  max?: number;
  animated?: boolean;
  style?: StyleProp<ViewStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
}

export function Progress({
  value = 0,
  max = 100,
  animated = true,
  style,
  indicatorStyle,
  ...props
}: ProgressProps) {
  const { colors, radii } = useTheme();
  const progress = Math.max(0, Math.min(1, max <= 0 ? 0 : value / max));
  const width = React.useRef(new Animated.Value(progress)).current;

  React.useEffect(() => {
    if (!animated) {
      width.setValue(progress);
      return;
    }
    Animated.timing(width, {
      toValue: progress,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [animated, progress, width]);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max, now: value }}
      style={[
        {
          width: '100%',
          height: 10,
          borderRadius: radii.full,
          overflow: 'hidden',
          backgroundColor: colors.backgroundSubtle,
        },
        style,
      ]}
      {...props}
    >
      <Animated.View
        style={[
          {
            height: '100%',
            width: width.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
            borderRadius: radii.full,
            backgroundColor: colors.primary,
          },
          indicatorStyle,
        ]}
      />
    </View>
  );
}
