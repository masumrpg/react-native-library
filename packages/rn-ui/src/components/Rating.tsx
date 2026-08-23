import React from "react";
import {
  StyleSheet,
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
  withSequence,
  withSpring,
  type SharedValue,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "../theme";
import { triggerHaptic } from "../utils/haptics";
import { Text } from "./Text";
import {
  renderIcon,
  type RenderIcon,
  type BaseGlassProps,
  type BaseHapticProps,
} from "./types";

export type RatingShape =
  | "star"
  | "heart"
  | "thumb"
  | "fire"
  | "smile"
  | "shield";

export type RatingPrecision = "full" | "half" | "exact" | number;

export type RatingSize = "sm" | "md" | "lg" | "xl" | number;

export type RatingTone =
  | "warning"
  | "danger"
  | "primary"
  | "success"
  | "secondary"
  | "accent"
  | "info";

export interface RatingItemInfo {
  index: number;
  value: number;
  fillFraction: number;
  isFilled: boolean;
  color: string;
  emptyColor: string;
  size: number;
}

export interface RatingProps
  extends Omit<ViewProps, "style">,
    BaseGlassProps,
    BaseHapticProps {
  value?: number;
  defaultValue?: number;
  max?: number;
  precision?: RatingPrecision;
  shape?: RatingShape;
  size?: RatingSize;
  gap?: number;
  tone?: RatingTone;
  color?: string;
  emptyColor?: string;
  readOnly?: boolean;
  disabled?: boolean;
  allowClear?: boolean;
  showValue?: boolean;
  valueFormat?: (value: number, max: number) => string;
  renderItem?: (info: RatingItemInfo) => React.ReactNode;
  icon?: RenderIcon;
  onValueChange?: (value: number) => void;
  onSlidingStart?: (value: number) => void;
  onSlidingComplete?: (value: number) => void;
  style?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
}

function getDefaultTone(shape: RatingShape): RatingTone {
  switch (shape) {
    case "heart":
    case "fire":
      return "danger";
    case "thumb":
      return "primary";
    case "smile":
      return "success";
    case "shield":
      return "accent";
    case "star":
    default:
      return "warning";
  }
}

function parsePrecisionStep(precision: RatingPrecision): number {
  if (typeof precision === "number") return Math.max(0.01, precision);
  switch (precision) {
    case "full":
      return 1;
    case "half":
      return 0.5;
    case "exact":
      return 0.1;
    default:
      return 1;
  }
}

function clamp(val: number, min: number, max: number): number {
  "worklet";
  return Math.min(max, Math.max(min, val));
}

function roundToStep(
  rawVal: number,
  step: number,
  max: number,
  allowZero: boolean,
): number {
  "worklet";
  if (rawVal <= 0) return allowZero ? 0 : step;
  if (rawVal >= max) return max;

  let snapped = Math.round(rawVal / step) * step;
  const decimals = (step.toString().split(".")[1] || "").length;
  snapped = Number(snapped.toFixed(Math.max(1, decimals)));

  return clamp(snapped, allowZero ? 0 : step, max);
}

function ShapeSvg({
  shape,
  color,
  size,
}: {
  shape: RatingShape;
  color: string;
  size: number;
}) {
  const viewBox = "0 0 24 24";

  switch (shape) {
    case "heart":
      return (
        <Svg width={size} height={size} viewBox={viewBox}>
          <Path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill={color}
          />
        </Svg>
      );
    case "thumb":
      return (
        <Svg width={size} height={size} viewBox={viewBox}>
          <Path
            d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"
            fill={color}
          />
        </Svg>
      );
    case "fire":
      return (
        <Svg width={size} height={size} viewBox={viewBox}>
          <Path
            d="M13.5 1.5c.41 2.6-1.5 4.5-2.5 6.5-1.1 2.2-1 4.3.5 6.2-2.5-.5-4.5-2.5-4.5-5.2 0-.3.03-.6.08-.88C5.2 9.7 4 12.2 4 15c0 4.4 3.6 8 8 8s8-3.6 8-8c0-5.5-4.5-9.5-6.5-13.5zM12 21c-3.3 0-6-2.7-6-6 0-1.7.7-3.2 1.9-4.3.4 2.1 2.2 3.8 4.4 3.8 1.4 0 2.7-.6 3.6-1.7.7 1 1.1 2.2 1.1 3.5 0 2.6-2.1 4.7-5 4.7z"
            fill={color}
          />
        </Svg>
      );
    case "smile":
      return (
        <Svg width={size} height={size} viewBox={viewBox}>
          <Path
            d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"
            fill={color}
          />
        </Svg>
      );
    case "shield":
      return (
        <Svg width={size} height={size} viewBox={viewBox}>
          <Path
            d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"
            fill={color}
          />
        </Svg>
      );
    case "star":
    default:
      return (
        <Svg width={size} height={size} viewBox={viewBox}>
          <Path
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            fill={color}
          />
        </Svg>
      );
  }
}

function RatingItemWrapper({
  index,
  itemSize,
  ratingShared,
  activeColor,
  activeEmptyColor,
  shape,
  icon,
  renderItem,
}: {
  index: number;
  itemSize: number;
  ratingShared: SharedValue<number>;
  activeColor: string;
  activeEmptyColor: string;
  shape: RatingShape;
  icon?: RenderIcon;
  renderItem?: (info: RatingItemInfo) => React.ReactNode;
}) {
  const itemValue = index + 1;

  const fillOverlayStyle = useAnimatedStyle(() => {
    const currentVal = ratingShared.value;
    let fillFraction = 0;

    if (currentVal >= itemValue) {
      fillFraction = 1;
    } else if (currentVal > index) {
      fillFraction = currentVal - index;
    }

    return {
      width: `${fillFraction * 100}%`,
    };
  });

  if (renderItem) {
    const currentVal = ratingShared.value;
    let fillFraction = 0;
    if (currentVal >= itemValue) fillFraction = 1;
    else if (currentVal > index) fillFraction = currentVal - index;

    return (
      <View style={{ width: itemSize, height: itemSize }}>
        {renderItem({
          index,
          value: itemValue,
          fillFraction,
          isFilled: fillFraction > 0,
          color: activeColor,
          emptyColor: activeEmptyColor,
          size: itemSize,
        })}
      </View>
    );
  }

  return (
    <View style={styles.iconCenter}>
      <View style={StyleSheet.absoluteFill}>
        {icon ? (
          renderIcon(icon, activeEmptyColor, itemSize)
        ) : (
          <ShapeSvg shape={shape} color={activeEmptyColor} size={itemSize} />
        )}
      </View>

      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { overflow: "hidden" },
          fillOverlayStyle,
        ]}
      >
        <View style={{ width: itemSize, height: itemSize }}>
          {icon ? (
            renderIcon(icon, activeColor, itemSize)
          ) : (
            <ShapeSvg shape={shape} color={activeColor} size={itemSize} />
          )}
        </View>
      </Animated.View>
    </View>
  );
}

export function Rating({
  value,
  defaultValue = 0,
  max = 5,
  precision = "full",
  shape = "star",
  size = "md",
  gap = 4,
  tone,
  color,
  emptyColor,
  readOnly = false,
  disabled = false,
  allowClear = true,
  showValue = false,
  haptic = true,
  valueFormat,
  renderItem,
  icon,
  onValueChange,
  onSlidingStart,
  onSlidingComplete,
  style,
  itemStyle,
  onLayout,
  ...props
}: RatingProps) {
  const { colors, components } = useTheme();

  const activeTone = tone ?? getDefaultTone(shape);
  const activeColor = color ?? colors[activeTone];
  const activeEmptyColor = emptyColor ?? colors.textMuted + "40";
  const itemSize =
    typeof size === "number" ? size : components.rating?.size[size] ?? 24;
  const step = parsePrecisionStep(precision);

  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = Math.min(
    max,
    Math.max(0, isControlled ? value : internalValue),
  );

  const ratingShared = useSharedValue(currentValue);
  const isInteracting = useSharedValue(false);
  const containerWidth = useSharedValue(max * itemSize + (max - 1) * gap);
  const scaleAnim = useSharedValue(1);

  const [displayVal, setDisplayVal] = React.useState(currentValue);

  React.useEffect(() => {
    if (!isInteracting.value) {
      ratingShared.value = currentValue;
      setDisplayVal(currentValue);
    }
  }, [currentValue, isInteracting, ratingShared]);

  const updateRatingFromX = React.useCallback(
    (xPos: number, isFinal: boolean = false) => {
      "worklet";
      const totalW = containerWidth.value;
      if (totalW <= 0) return;

      const rawVal = (xPos / totalW) * max;
      let nextVal = roundToStep(rawVal, step, max, allowClear);

      if (isFinal && allowClear && nextVal === ratingShared.value && xPos < itemSize) {
        nextVal = 0;
      }

      ratingShared.value = nextVal;
      runOnJS(setDisplayVal)(nextVal);

      if (onValueChange) {
        runOnJS(onValueChange)(nextVal);
      }
      if (isFinal && !isControlled) {
        runOnJS(setInternalValue)(nextVal);
      }
    },
    [
      allowClear,
      containerWidth,
      isControlled,
      itemSize,
      max,
      onValueChange,
      ratingShared,
      step,
    ],
  );

  const triggerHapticFeedback = React.useCallback(() => {
    if (haptic) triggerHaptic("selection");
  }, [haptic]);

  const tapGesture = Gesture.Tap()
    .enabled(!disabled && !readOnly)
    .onEnd((e) => {
      "worklet";
      updateRatingFromX(e.x, true);
      runOnJS(triggerHapticFeedback)();
    });

  const panGesture = Gesture.Pan()
    .enabled(!disabled && !readOnly)
    .minDistance(2)
    .onBegin((e) => {
      "worklet";
      isInteracting.value = true;
      scaleAnim.value = withSpring(1.05, { damping: 15, stiffness: 200 });
      if (onSlidingStart) {
        runOnJS(onSlidingStart)(ratingShared.value);
      }
      updateRatingFromX(e.x, false);
    })
    .onUpdate((e) => {
      "worklet";
      updateRatingFromX(e.x, false);
    })
    .onEnd((e) => {
      "worklet";
      updateRatingFromX(e.x, true);
      const finalVal = ratingShared.value;
      scaleAnim.value = withSequence(
        withSpring(1.08, { damping: 10 }),
        withSpring(1, { damping: 15 }),
      );
      if (onSlidingComplete) {
        runOnJS(onSlidingComplete)(finalVal);
      }
      runOnJS(triggerHapticFeedback)();
      isInteracting.value = false;
    })
    .onFinalize(() => {
      "worklet";
      isInteracting.value = false;
      scaleAnim.value = withSpring(1);
    });

  const composedGesture = Gesture.Race(tapGesture, panGesture);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
    opacity: disabled ? 0.5 : 1,
  }));

  const handleLayout = (e: LayoutChangeEvent) => {
    containerWidth.value = e.nativeEvent.layout.width;
    if (onLayout) onLayout(e);
  };

  const defaultFormattedValue = valueFormat
    ? valueFormat(displayVal, max)
    : `${displayVal.toFixed(step < 0.5 ? 1 : step === 0.5 ? 1 : 0)} / ${max}`;

  return (
    <View style={[styles.root, style]} {...props}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View
          onLayout={handleLayout}
          style={[styles.container, { gap }, containerAnimatedStyle]}
        >
          {Array.from({ length: max }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.itemWrapper,
                { width: itemSize, height: itemSize },
                itemStyle,
              ]}
            >
              <RatingItemWrapper
                index={index}
                itemSize={itemSize}
                ratingShared={ratingShared}
                activeColor={activeColor}
                activeEmptyColor={activeEmptyColor}
                shape={shape}
                icon={icon}
                renderItem={renderItem}
              />
            </View>
          ))}
        </Animated.View>
      </GestureDetector>

      {showValue && (
        <Text variant="labelSmall" color="textMuted" style={styles.valueText}>
          {defaultFormattedValue}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconCenter: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  valueText: {
    marginLeft: 8,
  },
});
