import React from "react";
import {
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { useTheme, type ThemeColors } from "../theme";

export type SliderTone =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info";

export interface SliderProps extends Omit<ViewProps, "style"> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  tone?: SliderTone;
  onValueChange?: (value: number) => void;
  onSlidingStart?: (value: number) => void;
  onSlidingComplete?: (value: number) => void;
  style?: StyleProp<ViewStyle>;
  trackStyle?: StyleProp<ViewStyle>;
  activeTrackStyle?: StyleProp<ViewStyle>;
  thumbStyle?: StyleProp<ViewStyle>;
}

function clamp(value: number, min: number, max: number) {
  "worklet";
  return Math.min(max, Math.max(min, value));
}

function snap(value: number, step: number, min: number) {
  "worklet";
  if (step <= 0) return value;
  return Math.round((value - min) / step) * step + min;
}

function getToneColor(colors: ThemeColors, tone: SliderTone) {
  return colors[tone];
}

export function Slider({
  value,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  tone = "primary",
  onValueChange,
  onSlidingStart,
  onSlidingComplete,
  style,
  trackStyle,
  activeTrackStyle,
  thumbStyle,
  onLayout,
  ...props
}: SliderProps) {
  const { colors, components, radii, isDark } = useTheme();
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const currentValue = clamp(value ?? internalValue, min, max);
  const range = max - min;
  const initialProgress = range === 0 ? 0 : (currentValue - min) / range;
  const progress = useSharedValue(initialProgress);
  const trackWidth = useSharedValue(0);
  const lastEmittedValue = useSharedValue(currentValue);
  const isInteractingRef = React.useRef(false);
  const isControlled = value !== undefined;
  const activeColor = getToneColor(colors, tone);
  const thumbSize = 24;

  React.useEffect(() => {
    if (isInteractingRef.current) return;

    const nextProgress = range === 0 ? 0 : (currentValue - min) / range;
    lastEmittedValue.value = currentValue;
    progress.value = clamp(nextProgress, 0, 1);
  }, [currentValue, lastEmittedValue, min, progress, range]);

  const setInteractionActive = React.useCallback((active: boolean) => {
    isInteractingRef.current = active;
  }, []);

  const commitValue = React.useCallback(
    (nextValue: number, complete: boolean, start = false) => {
      const next = clamp(nextValue, min, max);
      if (!isControlled) {
        setInternalValue(next);
      }
      if (start) {
        onSlidingStart?.(next);
      }
      onValueChange?.(next);
      if (complete) {
        onSlidingComplete?.(next);
      }
    },
    [isControlled, max, min, onSlidingComplete, onSlidingStart, onValueChange],
  );

  const handleLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      trackWidth.value = event.nativeEvent.layout.width;
      onLayout?.(event);
    },
    [onLayout, trackWidth],
  );

  const gesture = React.useMemo(
    () =>
      Gesture.Pan()
        .enabled(!disabled)
        .minDistance(0)
        .hitSlop(components.slider.hitSlop)
        .onBegin((event) => {
          const width = trackWidth.value;
          if (width <= 0) return;

          const nextProgress = Math.min(1, Math.max(0, event.x / width));
          const rawValue = min + nextProgress * range;
          const nextValue = clamp(snap(rawValue, step, min), min, max);

          lastEmittedValue.value = nextValue;
          progress.value = nextProgress;
          scheduleOnRN(setInteractionActive, true);
          scheduleOnRN(commitValue, nextValue, false, true);
        })
        .onUpdate((event) => {
          const width = trackWidth.value;
          if (width <= 0) return;

          const nextProgress = Math.min(1, Math.max(0, event.x / width));
          const rawValue = min + nextProgress * range;
          const nextValue = clamp(snap(rawValue, step, min), min, max);

          progress.value = nextProgress;
          if (nextValue !== lastEmittedValue.value) {
            lastEmittedValue.value = nextValue;
            scheduleOnRN(commitValue, nextValue, false, false);
          }
        })
        .onFinalize((event) => {
          const width = trackWidth.value;
          if (width > 0) {
            const nextProgress = Math.min(1, Math.max(0, event.x / width));
            const rawValue = min + nextProgress * range;
            const nextValue = clamp(snap(rawValue, step, min), min, max);
            const snappedProgress = range === 0 ? 0 : (nextValue - min) / range;

            progress.value = snappedProgress;
            lastEmittedValue.value = nextValue;
            scheduleOnRN(setInteractionActive, false);
            scheduleOnRN(commitValue, nextValue, true, false);
          } else {
            scheduleOnRN(setInteractionActive, false);
          }
        }),
    [
      commitValue,
      components.slider.hitSlop,
      disabled,
      lastEmittedValue,
      max,
      min,
      progress,
      range,
      setInteractionActive,
      step,
      trackWidth,
    ],
  );

  const activeTrackAnimatedStyle = useAnimatedStyle(() => ({
    width: Math.max(0, progress.value * (trackWidth.value - thumbSize) + thumbSize / 2),
    backgroundColor: activeColor,
  }));

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const travel = Math.max(0, trackWidth.value - thumbSize);

    return {
      width: thumbSize,
      height: thumbSize,
      borderRadius: radii.full,
      transform: [
        { translateX: progress.value * travel },
      ],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        accessibilityRole="adjustable"
        accessibilityValue={{ min, max, now: currentValue }}
        onLayout={handleLayout}
        style={[
          {
            width: "100%",
            height: thumbSize,
            justifyContent: "center",
            position: "relative",
            opacity: disabled ? 0.45 : 1,
          },
          style,
        ]}
        {...props}
      >
        {/* Background Track */}
        <View
          pointerEvents="none"
          style={[
            {
              height: 6,
              borderRadius: radii.full,
              backgroundColor: isDark
                ? "rgba(51, 65, 85, 0.8)"
                : colors.backgroundMuted,
              width: "100%",
            },
            trackStyle,
          ]}
        />

        {/* Active Highlight Track */}
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              height: 6,
              borderRadius: radii.full,
              backgroundColor: activeColor,
            },
            activeTrackAnimatedStyle,
            activeTrackStyle,
          ]}
        />

        {/* Thumb */}
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              width: thumbSize,
              height: thumbSize,
              borderRadius: radii.full,
              backgroundColor: "#FFFFFF",
              borderWidth: 2,
              borderColor: activeColor,
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.18,
              shadowRadius: 3,
              elevation: 4,
              alignItems: "center",
              justifyContent: "center",
            },
            thumbAnimatedStyle,
            thumbStyle,
          ]}
        />
      </Animated.View>
    </GestureDetector>
  );
}
