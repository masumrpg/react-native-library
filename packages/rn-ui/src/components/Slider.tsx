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
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

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
  const { colors, components, radii } = useTheme();
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const currentValue = clamp(value ?? internalValue, min, max);
  const range = max - min;
  const initialProgress = range === 0 ? 0 : (currentValue - min) / range;
  const progress = useSharedValue(initialProgress);
  const trackWidth = useSharedValue(0);
  const isPressed = useSharedValue(0);
  const lastEmittedValue = useSharedValue(currentValue);
  const isInteractingRef = React.useRef(false);
  const isControlled = value !== undefined;
  const activeColor = getToneColor(colors, tone);
  const thumbSize = components.slider.thumbSize;
  const activeThumbSize = components.slider.activeThumbSize;
  const thumbTravelInset = activeThumbSize / 2;

  React.useEffect(() => {
    if (isInteractingRef.current) return;

    const nextProgress = range === 0 ? 0 : (currentValue - min) / range;
    lastEmittedValue.value = currentValue;
    progress.value = withSpring(clamp(nextProgress, 0, 1), {
      damping: 18,
      stiffness: 260,
      mass: 0.85,
    });
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
          progress.value = withTiming(nextProgress, { duration: 110 });
          isPressed.value = withSpring(1, { damping: 16, stiffness: 260 });
          runOnJS(setInteractionActive)(true);
          runOnJS(commitValue)(nextValue, false, true);
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
            runOnJS(commitValue)(nextValue, false, false);
          }
        })
        .onFinalize((event) => {
          const width = trackWidth.value;
          if (width > 0) {
            const nextProgress = Math.min(1, Math.max(0, event.x / width));
            const rawValue = min + nextProgress * range;
            const nextValue = clamp(snap(rawValue, step, min), min, max);
            const snappedProgress = range === 0 ? 0 : (nextValue - min) / range;

            progress.value = withSpring(snappedProgress, {
              damping: 18,
              stiffness: 260,
              mass: 0.85,
            });
            lastEmittedValue.value = nextValue;
            runOnJS(setInteractionActive)(false);
            runOnJS(commitValue)(nextValue, true, false);
          } else {
            runOnJS(setInteractionActive)(false);
          }

          isPressed.value = withSpring(0, { damping: 16, stiffness: 260 });
        }),
    [
      commitValue,
      components.slider.hitSlop,
      disabled,
      isPressed,
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
    width: Math.max(0, progress.value * trackWidth.value),
    backgroundColor: activeColor,
  }));

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const size =
      thumbSize + (activeThumbSize - thumbSize) * Math.min(isPressed.value, 1);
    const travel = Math.max(0, trackWidth.value - thumbTravelInset * 2);

    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      transform: [
        { translateX: thumbTravelInset + progress.value * travel - size / 2 },
        { scale: 1 + isPressed.value * 0.02 },
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
            height: components.slider.height,
            justifyContent: "center",
            opacity: disabled ? 0.5 : 1,
          },
          style,
        ]}
        {...props}
      >
        <View
          pointerEvents="none"
          style={[
            {
              height: components.slider.trackHeight,
              borderRadius: radii.full,
              borderWidth: components.borderWidth.strong,
              borderColor: colors.border,
              backgroundColor: colors.backgroundSubtle,
              overflow: "hidden",
            },
            trackStyle,
          ]}
        >
          <Animated.View
            style={[
              {
                height: "100%",
                borderRadius: radii.full,
              },
              activeTrackAnimatedStyle,
              activeTrackStyle,
            ]}
          />
        </View>

        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              borderWidth: components.borderWidth.ring,
              borderColor: activeColor,
              backgroundColor: colors.surface,
            },
            thumbAnimatedStyle,
            thumbStyle,
          ]}
        />
      </Animated.View>
    </GestureDetector>
  );
}
