import { useCallback, useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleProp,
  ViewStyle,
} from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";

export interface UseHeaderScrollOptions {
  headerHeight?: number;
  threshold?: number;
}

export interface UseHeaderScrollResult {
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  headerStyle: StyleProp<ViewStyle>;
  scrollEventThrottle: number;
  isHeaderVisible: boolean;
}

/**
 * Custom hook to detect scroll direction and animate header visibility:
 * - Scroll Down -> Hides header by translating completely upwards off-screen
 * - Scroll Up -> Reveals header by translating back into view
 * - Scroll Top (y <= 10) -> Keeps header fully visible
 */
export function useHeaderScroll(
  options: UseHeaderScrollOptions = {},
): UseHeaderScrollResult {
  const { headerHeight = 220, threshold = 6 } = options;

  // Reanimated shared value for smooth GPU/UI thread animation
  const translateY = useSharedValue(0);
  const [isVisible, setIsVisible] = useState(true);

  // Ref tracking previous scroll Y offset to determine scroll direction
  const lastScrollY = useRef(0);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentY = event.nativeEvent.contentOffset.y;
      const dy = currentY - lastScrollY.current;

      // Always show header at the very top of the page
      if (currentY <= 10) {
        if (translateY.value !== 0) {
          translateY.value = withTiming(0, {
            duration: 220,
            easing: Easing.out(Easing.quad),
          });
          setIsVisible(true);
        }
      } else if (dy > threshold && currentY > 30) {
        // Scrolling DOWN -> Hide header completely off-screen
        if (translateY.value !== -headerHeight) {
          translateY.value = withTiming(-headerHeight, {
            duration: 220,
            easing: Easing.out(Easing.quad),
          });
          setIsVisible(false);
        }
      } else if (dy < -threshold) {
        // Scrolling UP -> Reveal header
        if (translateY.value !== 0) {
          translateY.value = withTiming(0, {
            duration: 220,
            easing: Easing.out(Easing.quad),
          });
          setIsVisible(true);
        }
      }

      lastScrollY.current = currentY;
    },
    [headerHeight, threshold, translateY],
  );

  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return {
    onScroll,
    headerStyle: headerStyle as unknown as StyleProp<ViewStyle>,
    scrollEventThrottle: 16,
    isHeaderVisible: isVisible,
  };
}
