import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  LayoutChangeEvent,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { useTheme } from "../theme";
import { triggerHaptic } from "../utils/haptics";
import { type ComponentTone } from "./types";

export interface RangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: [number, number];
  defaultValue?: [number, number];
  onValueChange?: (values: [number, number]) => void;
  tone?: ComponentTone;
  disabled?: boolean;
  hapticFeedback?: boolean;
  trackHeight?: number;
  thumbSize?: number;
  style?: StyleProp<ViewStyle>;
}

function clamp(val: number, min: number, max: number) {
  "worklet";
  return Math.max(min, Math.min(val, max));
}

function snap(val: number, step: number, min: number) {
  "worklet";
  if (step <= 0) return val;
  return Math.round((val - min) / step) * step + min;
}

/**
 * Dual-Thumb RangeSlider powered by React Native Gesture Handler & Reanimated (no bounce, no tooltip overlay)
 */
export function RangeSlider({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = [20, 80],
  onValueChange,
  tone = "primary",
  disabled = false,
  hapticFeedback = true,
  trackHeight = 6,
  thumbSize = 24,
  style,
}: RangeSliderProps) {
  const { colors, radii, isDark } = useTheme();

  const isControlled = value !== undefined;
  const [internalValues, setInternalValues] = useState<[number, number]>(
    defaultValue,
  );
  const currentValues = isControlled ? value : internalValues;

  const [activeThumb, setActiveThumb] = useState<"min" | "max" | null>(null);

  const range = max - min;
  const minRatio = range === 0 ? 0 : (currentValues[0] - min) / range;
  const maxRatio = range === 0 ? 1 : (currentValues[1] - min) / range;

  const minProgress = useSharedValue(minRatio);
  const maxProgress = useSharedValue(maxRatio);
  const trackWidth = useSharedValue(0);

  // Sync progress values directly without bounce
  useEffect(() => {
    minProgress.value = minRatio;
    maxProgress.value = maxRatio;
  }, [maxProgress, maxRatio, minProgress, minRatio]);

  const updateValues = useCallback(
    (newMin: number, newMax: number) => {
      const safeMin = Math.min(newMin, newMax);
      const safeMax = Math.max(newMin, newMax);
      if (hapticFeedback) {
        triggerHaptic("selection");
      }
      if (!isControlled) {
        setInternalValues([safeMin, safeMax]);
      }
      onValueChange?.([safeMin, safeMax]);
    },
    [hapticFeedback, isControlled, onValueChange],
  );

  const handleActiveThumbChange = useCallback((thumb: "min" | "max" | null) => {
    setActiveThumb(thumb);
  }, []);

  const activeDragThumb = useSharedValue<"min" | "max">("min");

  const gesture = useMemo(() => {
    return Gesture.Pan()
      .enabled(!disabled)
      .minDistance(0)
      .hitSlop({ top: 15, bottom: 15, left: 10, right: 10 })
      .runOnJS(true)
      .onBegin((e) => {
        const width = trackWidth.value;
        if (width <= 0) return;

        const touchProgress = clamp(e.x / width, 0, 1);
        const distToMin = Math.abs(touchProgress - minProgress.value);
        const distToMax = Math.abs(touchProgress - maxProgress.value);

        const chosen = distToMin <= distToMax ? "min" : "max";
        activeDragThumb.value = chosen;
        handleActiveThumbChange(chosen);

        if (chosen === "min") {
          const clampedProg = Math.min(touchProgress, maxProgress.value);
          minProgress.value = clampedProg;
          const raw = min + clampedProg * range;
          const snapped = clamp(snap(raw, step, min), min, max);
          const currentMax = min + maxProgress.value * range;
          const snappedMax = clamp(snap(currentMax, step, min), min, max);
          updateValues(snapped, Math.max(snapped, snappedMax));
        } else {
          const clampedProg = Math.max(touchProgress, minProgress.value);
          maxProgress.value = clampedProg;
          const raw = min + clampedProg * range;
          const snapped = clamp(snap(raw, step, min), min, max);
          const currentMin = min + minProgress.value * range;
          const snappedMin = clamp(snap(currentMin, step, min), min, max);
          updateValues(Math.min(snappedMin, snapped), snapped);
        }
      })
      .onUpdate((e) => {
        const width = trackWidth.value;
        if (width <= 0) return;

        const touchProgress = clamp(e.x / width, 0, 1);

        if (activeDragThumb.value === "min") {
          const clampedProg = Math.min(touchProgress, maxProgress.value);
          minProgress.value = clampedProg;
          const raw = min + clampedProg * range;
          const snapped = clamp(snap(raw, step, min), min, max);
          const currentMax = min + maxProgress.value * range;
          const snappedMax = clamp(snap(currentMax, step, min), min, max);
          updateValues(snapped, Math.max(snapped, snappedMax));
        } else {
          const clampedProg = Math.max(touchProgress, minProgress.value);
          maxProgress.value = clampedProg;
          const raw = min + clampedProg * range;
          const snapped = clamp(snap(raw, step, min), min, max);
          const currentMin = min + minProgress.value * range;
          const snappedMin = clamp(snap(currentMin, step, min), min, max);
          updateValues(Math.min(snappedMin, snapped), snapped);
        }
      })
      .onEnd(() => {
        handleActiveThumbChange(null);
      });
  }, [
    disabled,
    handleActiveThumbChange,
    max,
    maxProgress,
    min,
    minProgress,
    range,
    step,
    trackWidth,
    updateValues,
    activeDragThumb,
  ]);

  const minThumbStyle = useAnimatedStyle(() => {
    const travel = trackWidth.value > 0 ? trackWidth.value - thumbSize : 0;
    return {
      transform: [{ translateX: minProgress.value * travel }],
    };
  });

  const maxThumbStyle = useAnimatedStyle(() => {
    const travel = trackWidth.value > 0 ? trackWidth.value - thumbSize : 0;
    return {
      transform: [{ translateX: maxProgress.value * travel }],
    };
  });

  const activeTrackStyle = useAnimatedStyle(() => {
    const travel = trackWidth.value > 0 ? trackWidth.value - thumbSize : 0;
    const startX = minProgress.value * travel + thumbSize / 2;
    const endX = maxProgress.value * travel + thumbSize / 2;
    return {
      left: startX,
      width: Math.max(0, endX - startX),
    };
  });

  const toneColor = tone && tone !== "default" ? colors[tone] : colors.primary;

  const handleLayout = (e: LayoutChangeEvent) => {
    trackWidth.value = e.nativeEvent.layout.width;
  };

  return (
    <View style={[{ width: "100%", paddingVertical: 14 }, style]}>
      <GestureDetector gesture={gesture}>
        <View
          onLayout={handleLayout}
          style={{
            height: thumbSize,
            justifyContent: "center",
            position: "relative",
            opacity: disabled ? 0.45 : 1,
          }}
        >
          {/* Background Track */}
          <View
            style={{
              height: trackHeight,
              borderRadius: radii.full,
              backgroundColor: isDark
                ? "rgba(51, 65, 85, 0.8)"
                : colors.backgroundMuted,
              width: "100%",
            }}
          />

          {/* Active Highlight Range */}
          <Animated.View
            style={[
              {
                position: "absolute",
                height: trackHeight,
                borderRadius: radii.full,
                backgroundColor: toneColor,
              },
              activeTrackStyle,
            ]}
          />

          {/* Min Thumb */}
          <Animated.View
            style={[
              {
                position: "absolute",
                width: thumbSize,
                height: thumbSize,
                borderRadius: radii.full,
                backgroundColor: "#FFFFFF",
                borderWidth: 2,
                borderColor: toneColor,
                shadowColor: "#000000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.18,
                shadowRadius: 3,
                elevation: 4,
                alignItems: "center",
                justifyContent: "center",
                zIndex: activeThumb === "min" ? 10 : 5,
              },
              minThumbStyle,
            ]}
          />

          {/* Max Thumb */}
          <Animated.View
            style={[
              {
                position: "absolute",
                width: thumbSize,
                height: thumbSize,
                borderRadius: radii.full,
                backgroundColor: "#FFFFFF",
                borderWidth: 2,
                borderColor: toneColor,
                shadowColor: "#000000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.18,
                shadowRadius: 3,
                elevation: 4,
                alignItems: "center",
                justifyContent: "center",
                zIndex: activeThumb === "max" ? 10 : 5,
              },
              maxThumbStyle,
            ]}
          />
        </View>
      </GestureDetector>
    </View>
  );
}
