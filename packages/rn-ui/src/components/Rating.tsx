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
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { useTheme, type ThemeColors } from "../theme";
import { Text } from "./Text";
import { renderIcon, type RenderIcon } from "./types";

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

export interface RatingProps extends Omit<ViewProps, "style"> {
  /** Controlled value (0 to max) */
  value?: number;
  /** Uncontrolled initial value (default: 0) */
  defaultValue?: number;
  /** Maximum number of items/stars (default: 5) */
  max?: number;
  /** Rating step precision: 'full' (1), 'half' (0.5), 'exact' (0.1), or custom float number */
  precision?: RatingPrecision;
  /** Preset icon shape: 'star' | 'heart' | 'thumb' | 'fire' | 'smile' | 'shield' (default: 'star') */
  shape?: RatingShape;
  /** Preset size: 'sm' (16) | 'md' (24) | 'lg' (32) | 'xl' (40) or custom pixel number */
  size?: RatingSize;
  /** Spacing between items (default: 4) */
  gap?: number;
  /** Tone color when active/filled (default: 'warning' for star, 'danger' for heart, etc.) */
  tone?: RatingTone;
  /** Custom fill color (overrides tone) */
  color?: string;
  /** Custom unfilled color (overrides theme textMuted default) */
  emptyColor?: string;
  /** Read-only display mode without gesture interaction */
  readOnly?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Allow resetting value to 0 when pressing the current value (default: true) */
  allowClear?: boolean;
  /** Show numeric label beside rating (default: false) */
  showValue?: boolean;
  /** Format function for numeric value label */
  valueFormat?: (value: number, max: number) => string;
  /** Custom item renderer for full custom icons per state */
  renderItem?: (info: RatingItemInfo) => React.ReactNode;
  /** Custom RenderIcon definition for all items */
  icon?: RenderIcon;
  /** Callback emitted on rating change */
  onValueChange?: (value: number) => void;
  /** Callback emitted when sliding/gesturing starts */
  onSlidingStart?: (value: number) => void;
  /** Callback emitted when sliding/gesturing ends */
  onSlidingComplete?: (value: number) => void;
  style?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
}

function getNumericSize(size: RatingSize): number {
  if (typeof size === "number") return size;
  switch (size) {
    case "sm":
      return 16;
    case "md":
      return 24;
    case "lg":
      return 32;
    case "xl":
      return 40;
    default:
      return 24;
  }
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

function roundToStep(rawVal: number, step: number, max: number, allowZero: boolean): number {
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
  const itemSize = typeof size === "number" ? size : (components.rating?.size[size] ?? 24);
  const step = parsePrecisionStep(precision);

  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = Math.min(max, Math.max(0, isControlled ? value : internalValue));

  const ratingShared = useSharedValue(currentValue);
  const isInteracting = useSharedValue(false);
  const containerWidth = useSharedValue(max * itemSize + (max - 1) * gap);
  const scaleAnim = useSharedValue(1);

  React.useEffect(() => {
    if (!isInteracting.value) {
      ratingShared.value = currentValue;
    }
  }, [currentValue, isInteracting]);

  const updateRatingFromX = React.useCallback(
    (xPos: number, isFinal: boolean = false) => {
      "worklet";
      const totalW = containerWidth.value;
      if (totalW <= 0) return;

      const rawVal = (xPos / totalW) * max;
      let nextVal = roundToStep(rawVal, step, max, allowClear);

      // Handle tap on current value to toggle zero clear
      if (isFinal && allowClear && nextVal === ratingShared.value && xPos < itemSize) {
        nextVal = 0;
      }

      ratingShared.value = nextVal;

      if (onValueChange) {
        runOnJS(onValueChange)(nextVal);
      }
      if (!isControlled) {
        runOnJS(setInternalValue)(nextVal);
      }
    },
    [max, step, allowClear, isControlled, onValueChange, ratingShared, containerWidth, itemSize]
  );

  const panGesture = Gesture.Pan()
    .enabled(!disabled && !readOnly)
    .minDistance(0)
    .onBegin((e) => {
      "worklet";
      isInteracting.value = true;
      scaleAnim.value = withSpring(1.06, { damping: 15, stiffness: 200 });
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
        withSpring(1.12, { damping: 10 }),
        withSpring(1, { damping: 15 })
      );
      if (onSlidingComplete) {
        runOnJS(onSlidingComplete)(finalVal);
      }
      isInteracting.value = false;
    })
    .onFinalize(() => {
      "worklet";
      isInteracting.value = false;
      scaleAnim.value = withSpring(1);
    });

  const composedGesture = panGesture;

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
    opacity: disabled ? 0.5 : 1,
  }));

  const handleLayout = (e: LayoutChangeEvent) => {
    containerWidth.value = e.nativeEvent.layout.width;
    if (onLayout) onLayout(e);
  };

  const defaultFormattedValue = valueFormat
    ? valueFormat(currentValue, max)
    : `${currentValue.toFixed(step < 0.5 ? 1 : step === 0.5 ? 1 : 0)} / ${max}`;

  return (
    <View style={[styles.root, style]} {...props}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View
          onLayout={handleLayout}
          style={[
            styles.container,
            { gap },
            containerAnimatedStyle,
          ]}
        >
          {Array.from({ length: max }).map((_, index) => {
            const itemValue = index + 1;
            let fillFraction = 0;

            if (currentValue >= itemValue) {
              fillFraction = 1;
            } else if (currentValue > index) {
              fillFraction = currentValue - index;
            }

            const isFilled = fillFraction > 0;

            const itemInfo: RatingItemInfo = {
              index,
              value: itemValue,
              fillFraction,
              isFilled,
              color: activeColor,
              emptyColor: activeEmptyColor,
              size: itemSize,
            };

            return (
              <View
                key={index}
                style={[
                  styles.itemWrapper,
                  { width: itemSize, height: itemSize },
                  itemStyle,
                ]}
              >
                {renderItem ? (
                  renderItem(itemInfo)
                ) : icon ? (
                  <View style={styles.iconCenter}>
                    {/* Layer 1: Background Unfilled */}
                    <View style={StyleSheet.absoluteFill}>
                      {renderIcon(icon, activeEmptyColor, itemSize)}
                    </View>
                    {/* Layer 2: Filled Overlay */}
                    <View
                      style={[
                        StyleSheet.absoluteFill,
                        {
                          width: `${fillFraction * 100}%`,
                          overflow: "hidden",
                        },
                      ]}
                    >
                      <View style={{ width: itemSize, height: itemSize }}>
                        {renderIcon(icon, activeColor, itemSize)}
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.iconCenter}>
                    {/* Layer 1: Background Unfilled Shape */}
                    <View style={StyleSheet.absoluteFill}>
                      <ShapeSvg
                        shape={shape}
                        color={activeEmptyColor}
                        size={itemSize}
                      />
                    </View>
                    {/* Layer 2: Active Filled Shape with Percentage Width Clipping */}
                    <View
                      style={[
                        StyleSheet.absoluteFill,
                        {
                          width: `${fillFraction * 100}%`,
                          overflow: "hidden",
                        },
                      ]}
                    >
                      <View style={{ width: itemSize, height: itemSize }}>
                        <ShapeSvg
                          shape={shape}
                          color={activeColor}
                          size={itemSize}
                        />
                      </View>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
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
