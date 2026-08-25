import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  PanResponder,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "../theme";
import { triggerHaptic } from "../utils/haptics";
import { Text } from "./Text";

export interface SignaturePadRef {
  clear: () => void;
  undo: () => void;
  getPaths: () => string[];
  getSvg: () => string;
  isEmpty: () => boolean;
}

export interface SignaturePadProps {
  strokeColor?: string;
  strokeWidth?: number;
  backgroundColor?: string;
  showGuideLine?: boolean;
  guideLineText?: string;
  onBegin?: () => void;
  onEnd?: () => void;
  onChange?: (paths: string[]) => void;
  hapticFeedback?: boolean;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

interface Point {
  x: number;
  y: number;
}

function pointsToSvgPath(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) {
    const p = points[0];
    if (!p) return "";
    return `M ${p.x} ${p.y} L ${p.x + 0.1} ${p.y + 0.1}`;
  }

  let d = `M ${points[0]?.x ?? 0} ${points[0]?.y ?? 0}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    if (prev && curr) {
      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2;
      d += ` Q ${prev.x} ${prev.y}, ${midX} ${midY}`;
    }
  }
  const last = points[points.length - 1];
  if (last) {
    d += ` L ${last.x} ${last.y}`;
  }
  return d;
}

/**
 * Digital Signature Pad Canvas with SVG path rendering, undo, and export
 */
export const SignaturePad = React.forwardRef<SignaturePadRef, SignaturePadProps>(
  (
    {
      strokeColor,
      strokeWidth = 3,
      backgroundColor,
      showGuideLine = true,
      guideLineText = "Sign Above This Line",
      onBegin,
      onEnd,
      onChange,
      hapticFeedback = true,
      height = 200,
      style,
    },
    ref,
  ) => {
    const { colors, radii, isDark } = useTheme();
    const activeStrokeColor = strokeColor ?? (isDark ? "#FFFFFF" : colors.text);
    const activeBgColor = backgroundColor ?? colors.surface;

    const [paths, setPaths] = useState<string[]>([]);
    const [currentPoints, setCurrentPoints] = useState<Point[]>([]);

    const currentStrokeRef = useRef<Point[]>([]);

    const clear = useCallback(() => {
      if (hapticFeedback) triggerHaptic("selection");
      setPaths([]);
      setCurrentPoints([]);
      currentStrokeRef.current = [];
      onChange?.([]);
    }, [hapticFeedback, onChange]);

    const undo = useCallback(() => {
      if (paths.length === 0) return;
      if (hapticFeedback) triggerHaptic("selection");
      const next = paths.slice(0, -1);
      setPaths(next);
      onChange?.(next);
    }, [hapticFeedback, onChange, paths]);

    useImperativeHandle(ref, () => ({
      clear,
      undo,
      getPaths: () => paths,
      getSvg: () => {
        const pathsXml = paths
          .map(
            (d) =>
              `<path d="${d}" fill="none" stroke="${activeStrokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" />`,
          )
          .join("");
        return `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" width="100%">${pathsXml}</svg>`;
      },
      isEmpty: () => paths.length === 0 && currentPoints.length === 0,
    }));

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e) => {
          const { locationX, locationY } = e.nativeEvent;
          currentStrokeRef.current = [{ x: locationX, y: locationY }];
          setCurrentPoints([{ x: locationX, y: locationY }]);
          onBegin?.();
        },
        onPanResponderMove: (e) => {
          const { locationX, locationY } = e.nativeEvent;
          currentStrokeRef.current.push({ x: locationX, y: locationY });
          setCurrentPoints([...currentStrokeRef.current]);
        },
        onPanResponderRelease: () => {
          if (currentStrokeRef.current.length > 0) {
            const svgPath = pointsToSvgPath(currentStrokeRef.current);
            if (svgPath) {
              setPaths((prev) => {
                const next = [...prev, svgPath];
                setTimeout(() => onChange?.(next), 0);
                return next;
              });
            }
          }
          currentStrokeRef.current = [];
          setCurrentPoints([]);
          onEnd?.();
        },
      }),
    ).current;

    const currentStrokeD = pointsToSvgPath(currentPoints);

    return (
      <View
        style={[
          {
            width: "100%",
            height,
            backgroundColor: activeBgColor,
            borderRadius: radii.lg,
            borderWidth: 1,
            borderColor: colors.border,
            overflow: "hidden",
            position: "relative",
          },
          style,
        ]}
      >
        {/* Sign Base Guideline */}
        {showGuideLine && (
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              bottom: 36,
              left: 20,
              right: 20,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "100%",
                height: 1,
                borderStyle: "dashed",
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: colors.border,
              }}
            />
            {guideLineText && (
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "600",
                  color: colors.textMuted,
                  letterSpacing: 0.6,
                  marginTop: 6,
                  textTransform: "uppercase",
                }}
              >
                {guideLineText}
              </Text>
            )}
          </View>
        )}

        {/* SVG Drawing Canvas Layer */}
        <Svg style={StyleSheet.absoluteFill}>
          {paths.map((d, idx) => (
            <Path
              key={`sig-stroke-${idx}`}
              d={d}
              fill="none"
              stroke={activeStrokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {currentStrokeD ? (
            <Path
              d={currentStrokeD}
              fill="none"
              stroke={activeStrokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
        </Svg>

        {/* Transparent Touch Capture Overlay */}
        <View {...panResponder.panHandlers} style={StyleSheet.absoluteFill} />
      </View>
    );
  },
);

SignaturePad.displayName = "SignaturePad";
