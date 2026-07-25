import React from "react";
import {
  PanResponder,
  Pressable,
  View,
  type GestureResponderEvent,
  type PanResponderGestureState,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../theme";

export interface SliderProps extends Omit<ViewProps, "style"> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onValueChange?: (value: number) => void;
  onSlidingComplete?: (value: number) => void;
  style?: StyleProp<ViewStyle>;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function snap(value: number, step: number, min: number) {
  if (step <= 0) return value;
  return Math.round((value - min) / step) * step + min;
}

export function Slider({
  value,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  onValueChange,
  onSlidingComplete,
  style,
  ...props
}: SliderProps) {
  const { colors, components, radii } = useTheme();
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [trackWidth, setTrackWidth] = React.useState(0);
  const currentValue = clamp(value ?? internalValue, min, max);
  const percent = max === min ? 0 : (currentValue - min) / (max - min);

  const setNextValue = React.useCallback(
    (locationX: number, complete = false) => {
      if (disabled || trackWidth <= 0) return;
      const raw = min + clamp(locationX / trackWidth, 0, 1) * (max - min);
      const next = clamp(snap(raw, step, min), min, max);
      if (value === undefined) setInternalValue(next);
      onValueChange?.(next);
      if (complete) onSlidingComplete?.(next);
    },
    [
      disabled,
      max,
      min,
      onSlidingComplete,
      onValueChange,
      step,
      trackWidth,
      value,
    ],
  );

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onMoveShouldSetPanResponder: () => !disabled,
        onPanResponderMove: (
          _event: GestureResponderEvent,
          gesture: PanResponderGestureState,
        ) => {
          setNextValue(percent * trackWidth + gesture.dx);
        },
        onPanResponderRelease: (_event, gesture) => {
          setNextValue(percent * trackWidth + gesture.dx, true);
        },
      }),
    [disabled, percent, setNextValue, trackWidth],
  );

  return (
    <Pressable
      accessibilityRole="adjustable"
      accessibilityValue={{ min, max, now: currentValue }}
      disabled={disabled}
      onPress={(event) => setNextValue(event.nativeEvent.locationX, true)}
      onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
      style={[
        {
          width: "100%",
          height: 32,
          justifyContent: "center",
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      {...panResponder.panHandlers}
      {...props}
    >
      <View
        style={{
          height: 6,
          borderRadius: radii.full,
          backgroundColor: colors.backgroundSubtle,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${percent * 100}%`,
            height: "100%",
            backgroundColor: colors.primary,
          }}
        />
      </View>
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: `${percent * 100}%`,
          width: 22,
          height: 22,
          marginLeft: -11,
          borderRadius: 11,
          borderWidth: components.borderWidth.ring,
          borderColor: colors.primary,
          backgroundColor: colors.surface,
        }}
      />
    </Pressable>
  );
}
