import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Image,
  View,
  type ImageProps,
  type ImageSourcePropType,
  type ImageStyle,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../theme";
import { Text } from "./Text";

export type AvatarSize = "sm" | "default" | "lg" | "xl" | number;
export type AvatarShape = "circle" | "square" | "rounded";
export type AvatarStatus = "online" | "offline" | "busy" | "away";

interface AvatarContextType {
  size: AvatarSize;
  shape: AvatarShape;
  variant?: AvatarVariant;
  ringPadding: number;
  hasLoaded: boolean;
  setHasLoaded: (value: boolean) => void;
  hasError: boolean;
  setHasError: (value: boolean) => void;
  inGroup?: boolean;
}

const AvatarContext = createContext<AvatarContextType | null>(null);

function useAvatarContext() {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error(
      "Avatar components must be rendered within an Avatar provider",
    );
  }
  return context;
}

const GroupContext = createContext<{
  inGroup: boolean;
  size: AvatarSize;
  shape: AvatarShape;
} | null>(null);

export type AvatarVariant = "default" | "bordered" | "ring" | "premium" | "vip";
export type AvatarTone =
  | "default"
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "gold";

export type AvatarBadgeTone =
  | "primary"
  | "danger"
  | "warning"
  | "success"
  | "secondary"
  | "accent";

export type AvatarBadgePosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left";

export interface AvatarProps extends React.ComponentPropsWithoutRef<
  typeof View
> {
  size?: AvatarSize;
  shape?: AvatarShape;
  variant?: AvatarVariant;
  tone?: AvatarTone;
  style?: StyleProp<ViewStyle>;
  badge?: React.ReactNode | number | string;
  badgeTone?: AvatarBadgeTone;
  badgePosition?: AvatarBadgePosition;
  badgeStatus?: AvatarStatus;
  maxBadgeCount?: number;
  frame?: React.ReactNode | ImageSourcePropType;
  frameScale?: number;
  children?: React.ReactNode;
}

export function Avatar({
  size = "default",
  shape = "circle",
  variant = "default",
  tone = "default",
  style,
  badge,
  badgeTone,
  badgePosition,
  badgeStatus,
  maxBadgeCount,
  frame,
  frameScale,
  children,
  ...props
}: AvatarProps) {
  const { colors, components, radii } = useTheme();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Check if rendered inside an AvatarGroup
  const group = useContext(GroupContext);
  const finalSize = group ? group.size : size;
  const finalShape = group ? group.shape : shape;
  const inGroup = !!group;

  // Determine width and height based on size
  const dimension =
    typeof finalSize === "number"
      ? finalSize
      : finalSize === "xl"
      ? 56
      : finalSize === "lg"
      ? 44
      : finalSize === "sm"
      ? 28
      : 36;

  const borderRadius =
    finalShape === "circle"
      ? radii.full
      : finalShape === "square"
      ? radii.xs
      : radii.md;

  const toneColor =
    tone === "primary"
      ? colors.primary
      : tone === "secondary"
      ? colors.secondary
      : tone === "accent"
      ? colors.accent
      : tone === "success"
      ? colors.success
      : tone === "warning"
      ? colors.warning
      : tone === "danger"
      ? colors.danger
      : tone === "gold"
      ? "#F59E0B"
      : colors.border;

  let borderWidth = 0;
  let borderColor: string | undefined;
  let ringPadding = 0;

  if (variant === "bordered") {
    borderWidth = 2;
    borderColor = tone === "default" ? colors.border : toneColor;
  } else if (variant === "ring") {
    borderWidth = 2;
    borderColor = tone === "default" ? colors.primary : toneColor;
    ringPadding = 2;
  } else if (variant === "premium") {
    borderWidth = 2.5;
    borderColor = "#8B5CF6";
    ringPadding = 2;
  } else if (variant === "vip") {
    borderWidth = 2.5;
    borderColor = "#F59E0B";
    ringPadding = 2;
  }

  const rootStyle: ViewStyle = {
    position: "relative",
    width: dimension,
    height: dimension,
    borderRadius,
    backgroundColor: colors.backgroundMuted,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
    ...(borderWidth > 0
      ? {
          borderWidth,
          borderColor,
        }
      : inGroup
      ? {
          borderWidth: components.borderWidth.ring,
          borderColor: colors.background,
        }
      : {}),
  };

  const isImageSource = (val: unknown): val is ImageSourcePropType => {
    return (
      typeof val === "number" ||
      (typeof val === "object" &&
        val !== null &&
        ("uri" in val || "headers" in val))
    );
  };

  return (
    <AvatarContext.Provider
      value={{
        size: finalSize,
        shape: finalShape,
        variant,
        ringPadding,
        hasLoaded,
        setHasLoaded,
        hasError,
        setHasError,
        inGroup,
      }}
    >
      <View style={[rootStyle, style]} {...props}>
        {children}
        {frame ? (
          isImageSource(frame) ? (
            <AvatarFrame source={frame} scale={frameScale} />
          ) : (
            <AvatarFrame scale={frameScale}>
              {frame as React.ReactNode}
            </AvatarFrame>
          )
        ) : null}
        {badge !== undefined ? (
          <AvatarBadge
            count={
              typeof badge === "number" || typeof badge === "string"
                ? badge
                : undefined
            }
            value={
              typeof badge !== "number" && typeof badge !== "string"
                ? badge
                : undefined
            }
            tone={badgeTone}
            position={badgePosition ?? "top-right"}
            max={maxBadgeCount}
          />
        ) : badgeStatus ? (
          <AvatarBadge
            status={badgeStatus}
            tone={badgeTone}
            position={badgePosition ?? "bottom-right"}
          />
        ) : null}
      </View>
    </AvatarContext.Provider>
  );
}

export interface AvatarImageProps extends Omit<ImageProps, "style"> {
  style?: StyleProp<ImageStyle>;
}

export function AvatarImage({
  source,
  style,
  onLoad,
  onError,
  ...props
}: AvatarImageProps) {
  const { setHasLoaded, setHasError, hasError, shape, ringPadding } =
    useAvatarContext();
  const { radii } = useTheme();

  useEffect(() => {
    setHasLoaded(false);
    setHasError(false);
  }, [source]);

  if (hasError) {
    return null;
  }

  const handleLoad = (e: Parameters<NonNullable<ImageProps["onLoad"]>>[0]) => {
    setHasLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e: Parameters<NonNullable<ImageProps["onError"]>>[0]) => {
    setHasError(true);
    onError?.(e);
  };

  const baseRadius =
    shape === "circle"
      ? radii.full
      : shape === "square"
      ? radii.xs
      : radii.md;

  const borderRadius = Math.max(0, baseRadius - ringPadding);

  const imageStyle: ImageStyle = {
    position: "absolute",
    top: ringPadding,
    left: ringPadding,
    right: ringPadding,
    bottom: ringPadding,
    borderRadius,
  };

  return (
    <Image
      source={source}
      style={[imageStyle, style]}
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  );
}

export interface AvatarFallbackProps extends React.ComponentPropsWithoutRef<
  typeof View
> {
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

export function AvatarFallback({
  style,
  textStyle,
  children,
  ...props
}: AvatarFallbackProps) {
  const { hasLoaded, hasError, size, shape, ringPadding } = useAvatarContext();
  const { colors, radii } = useTheme();

  if (hasLoaded && !hasError) {
    return null;
  }

  const baseRadius =
    shape === "circle"
      ? radii.full
      : shape === "square"
      ? radii.xs
      : radii.md;

  const borderRadius = Math.max(0, baseRadius - ringPadding);

  const fallbackStyle: ViewStyle = {
    position: "absolute",
    top: ringPadding,
    left: ringPadding,
    right: ringPadding,
    bottom: ringPadding,
    borderRadius,
    backgroundColor: colors.backgroundMuted,
    alignItems: "center",
    justifyContent: "center",
  };

  const fontSize =
    typeof size === "number"
      ? size * 0.4
      : size === "xl"
      ? 20
      : size === "lg"
      ? 16
      : size === "sm"
      ? 11
      : 13;

  return (
    <View style={[fallbackStyle, style]} {...props}>
      {typeof children === "string" ? (
        <Text
          style={[
            { color: colors.textMuted, fontSize, fontWeight: "600" },
            textStyle,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

export interface AvatarBadgeProps extends React.ComponentPropsWithoutRef<
  typeof View
> {
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  bg?: string;
  status?: AvatarStatus;
  tone?: AvatarBadgeTone;
  position?: AvatarBadgePosition;
  count?: number | string;
  value?: React.ReactNode;
  max?: number;
  children?: React.ReactNode;
}

export function AvatarBadge({
  style,
  textStyle,
  bg,
  status,
  tone = "danger",
  position,
  count,
  value,
  max = 99,
  children,
  ...props
}: AvatarBadgeProps) {
  const { size } = useAvatarContext();
  const { colors, components } = useTheme();

  // Determine badge position: default to "bottom-right" for status dots, "top-right" for count/custom badges
  const isStatusDot =
    status !== undefined &&
    count === undefined &&
    value === undefined &&
    children === undefined;
  const finalPosition: AvatarBadgePosition =
    position ?? (isStatusDot ? "bottom-right" : "top-right");

  const toneColor =
    tone === "primary"
      ? colors.primary
      : tone === "danger"
      ? colors.danger
      : tone === "warning"
      ? colors.warning
      : tone === "success"
      ? colors.success
      : tone === "secondary"
      ? colors.secondary
      : colors.accent;

  const statusColor =
    status === "online"
      ? colors.success
      : status === "busy"
      ? colors.danger
      : status === "away"
      ? colors.warning
      : status === "offline"
      ? colors.textMuted
      : bg || toneColor;

  const badgeBg = bg || (status ? statusColor : toneColor);

  // Position offsets based on avatar size
  const offset =
    typeof size === "number"
      ? 0
      : size === "xl"
      ? 1
      : size === "lg"
      ? 0
      : size === "sm"
      ? -2
      : -1;

  const positionStyle: ViewStyle = {};
  if (finalPosition === "top-right") {
    positionStyle.top = offset;
    positionStyle.right = offset;
  } else if (finalPosition === "top-left") {
    positionStyle.top = offset;
    positionStyle.left = offset;
  } else if (finalPosition === "bottom-left") {
    positionStyle.bottom = offset;
    positionStyle.left = offset;
  } else {
    positionStyle.bottom = offset;
    positionStyle.right = offset;
  }

  // If pure status indicator dot
  if (isStatusDot) {
    const dotSize =
      typeof size === "number"
        ? size * 0.28
        : size === "xl"
        ? 14
        : size === "lg"
        ? 12
        : size === "sm"
        ? 8
        : 10;

    const dotStyle: ViewStyle = {
      position: "absolute",
      ...positionStyle,
      width: dotSize,
      height: dotSize,
      borderRadius: dotSize / 2,
      backgroundColor: statusColor,
      borderWidth: components.borderWidth.focus,
      borderColor: colors.background,
      zIndex: 10,
    };

    return <View style={[dotStyle, style]} {...props} />;
  }

  // Count, content, or custom decorative children
  const content =
    children ??
    value ??
    (typeof count === "number"
      ? count > max
        ? `${max}+`
        : String(count)
      : count);

  const isNumericOrShortText =
    typeof content === "string" || typeof content === "number";

  const minBadgeHeight =
    typeof size === "number"
      ? Math.max(16, size * 0.4)
      : size === "xl"
      ? 20
      : size === "lg"
      ? 18
      : size === "sm"
      ? 14
      : 16;

  const fontSize =
    typeof size === "number"
      ? Math.max(9, size * 0.25)
      : size === "xl"
      ? 11
      : size === "lg"
      ? 10
      : size === "sm"
      ? 8
      : 9;

  const customBadgeStyle: ViewStyle = {
    position: "absolute",
    ...positionStyle,
    minWidth: minBadgeHeight,
    height: minBadgeHeight,
    paddingHorizontal: isNumericOrShortText ? 4 : 2,
    borderRadius: 999,
    backgroundColor: badgeBg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: components.borderWidth.focus,
    borderColor: colors.background,
    zIndex: 10,
  };

  return (
    <View style={[customBadgeStyle, style]} {...props}>
      {isNumericOrShortText ? (
        <Text
          style={[
            {
              color: "#FFFFFF",
              fontSize,
              fontWeight: "700",
              lineHeight: fontSize + 2,
              textAlign: "center",
            },
            textStyle,
          ]}
        >
          {content}
        </Text>
      ) : (
        content
      )}
    </View>
  );
}

export interface AvatarGroupProps extends React.ComponentPropsWithoutRef<
  typeof View
> {
  size?: AvatarSize;
  shape?: AvatarShape;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export function AvatarGroup({
  size = "default",
  shape = "circle",
  style,
  children,
  ...props
}: AvatarGroupProps) {
  const groupStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
  };

  const spacing =
    typeof size === "number"
      ? -size * 0.25
      : size === "xl"
      ? -14
      : size === "lg"
      ? -10
      : size === "sm"
      ? -6
      : -8;

  return (
    <GroupContext.Provider value={{ inGroup: true, size, shape }}>
      <View style={[groupStyle, style]} {...props}>
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement<{ style?: StyleProp<ViewStyle> }>(child)) return child;

          return React.cloneElement(child, {
            style: [
              {
                marginLeft: index === 0 ? 0 : spacing,
              },
              child.props.style,
            ],
          });
        })}
      </View>
    </GroupContext.Provider>
  );
}

export interface AvatarGroupCountProps extends React.ComponentPropsWithoutRef<
  typeof View
> {
  count: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function AvatarGroupCount({
  count,
  style,
  textStyle,
  ...props
}: AvatarGroupCountProps) {
  const { colors, components, radii } = useTheme();
  const group = useContext(GroupContext);
  const size = group ? group.size : "default";
  const shape = group ? group.shape : "circle";

  const dimension =
    typeof size === "number"
      ? size
      : size === "xl"
      ? 56
      : size === "lg"
      ? 44
      : size === "sm"
      ? 28
      : 36;

  const spacing =
    typeof size === "number"
      ? -size * 0.25
      : size === "xl"
      ? -14
      : size === "lg"
      ? -10
      : size === "sm"
      ? -6
      : -8;

  const fontSize =
    typeof size === "number"
      ? size * 0.35
      : size === "xl"
      ? 16
      : size === "lg"
      ? 14
      : size === "sm"
      ? 10
      : 12;

  const borderRadius =
    shape === "circle"
      ? radii.full
      : shape === "square"
      ? radii.xs
      : radii.md;

  const countStyle: ViewStyle = {
    width: dimension,
    height: dimension,
    borderRadius,
    backgroundColor: colors.backgroundMuted,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: components.borderWidth.ring,
    borderColor: colors.background,
    marginLeft: spacing,
  };

  return (
    <View style={[countStyle, style]} {...props}>
      <Text
        style={[
          { color: colors.textMuted, fontSize, fontWeight: "600" },
          textStyle,
        ]}
      >
        +{count}
      </Text>
    </View>
  );
}

export interface AvatarFrameProps
  extends Omit<React.ComponentPropsWithoutRef<typeof View>, "style"> {
  source?: ImageSourcePropType;
  scale?: number;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  children?: React.ReactNode;
}

export function AvatarFrame({
  source,
  scale = 1.3,
  style,
  imageStyle,
  children,
  ...props
}: AvatarFrameProps) {
  const { size } = useAvatarContext();
  const dimension =
    typeof size === "number"
      ? size
      : size === "xl"
      ? 56
      : size === "lg"
      ? 44
      : size === "sm"
      ? 28
      : 36;

  const frameDimension = dimension * scale;
  const frameOffset = (dimension - frameDimension) / 2;

  const frameStyle: ViewStyle = {
    position: "absolute",
    top: frameOffset,
    left: frameOffset,
    width: frameDimension,
    height: frameDimension,
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    zIndex: 6,
  };

  return (
    <View style={[frameStyle, style]} pointerEvents="none" {...props}>
      {source ? (
        <Image
          source={source}
          style={[
            {
              width: "100%",
              height: "100%",
              resizeMode: "contain",
            },
            imageStyle,
          ]}
        />
      ) : null}
      {children}
    </View>
  );
}
