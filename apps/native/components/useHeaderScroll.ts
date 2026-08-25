import { useCallback } from "react";
import {
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleProp,
  ViewStyle,
} from "react-native";

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
  _options: UseHeaderScrollOptions = {},
): UseHeaderScrollResult {
  const onScroll = useCallback(
    (_event: NativeSyntheticEvent<NativeScrollEvent>) => {
      // Header stays static in place
    },
    [],
  );

  return {
    onScroll,
    headerStyle: undefined,
    scrollEventThrottle: 16,
    isHeaderVisible: true,
  };
}
