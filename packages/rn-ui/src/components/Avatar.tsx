import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  View,
  type ImageProps,
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

export interface AvatarProps extends React.ComponentPropsWithoutRef<
  typeof View
> {
  size?: AvatarSize;
  shape?: AvatarShape;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export function Avatar({
  size = "default",
  shape = "circle",
  style,
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

  const rootStyle: ViewStyle = {
    position: "relative",
    width: dimension,
    height: dimension,
    borderRadius,
    backgroundColor: colors.backgroundMuted,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
    ...(inGroup
      ? {
          borderWidth: components.borderWidth.ring,
          borderColor: colors.background,
        }
      : {}),
  };

  return (
    <AvatarContext.Provider
      value={{
        size: finalSize,
        shape: finalShape,
        hasLoaded,
        setHasLoaded,
        hasError,
        setHasError,
        inGroup,
      }}
    >
      <View style={[rootStyle, style]} {...props}>
        {children}
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
  const { setHasLoaded, setHasError, hasError, shape } = useAvatarContext();
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

  const borderRadius =
    shape === "circle"
      ? radii.full
      : shape === "square"
      ? radii.xs
      : radii.md;

  return (
    <Image
      source={source}
      style={[
        StyleSheet.absoluteFill,
        {
          borderRadius,
        },
        style,
      ]}
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
  const { hasLoaded, hasError, size, shape } = useAvatarContext();
  const { colors, radii } = useTheme();

  if (hasLoaded && !hasError) {
    return null;
  }

  const borderRadius =
    shape === "circle"
      ? radii.full
      : shape === "square"
      ? radii.xs
      : radii.md;

  const fallbackStyle: ViewStyle = {
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
    <View style={[StyleSheet.absoluteFill, fallbackStyle, style]} {...props}>
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
  bg?: string;
  status?: AvatarStatus;
}

export function AvatarBadge({ style, bg, status, ...props }: AvatarBadgeProps) {
  const { size } = useAvatarContext();
  const { colors, components } = useTheme();

  const statusColor =
    status === "online"
      ? colors.success
      : status === "busy"
      ? colors.danger
      : status === "away"
      ? colors.warning
      : status === "offline"
      ? colors.textMuted
      : bg || colors.success;

  const badgeSize =
    typeof size === "number"
      ? size * 0.28
      : size === "xl"
      ? 14
      : size === "lg"
      ? 12
      : size === "sm"
      ? 8
      : 10;

  const offset =
    typeof size === "number"
      ? 0
      : size === "xl"
      ? 1
      : size === "lg"
      ? 0
      : size === "sm"
      ? -1
      : -0.5;

  const badgeStyle: ViewStyle = {
    position: "absolute",
    right: offset,
    bottom: offset,
    width: badgeSize,
    height: badgeSize,
    borderRadius: badgeSize / 2,
    backgroundColor: statusColor,
    borderWidth: components.borderWidth.focus,
    borderColor: colors.background,
    zIndex: 10,
  };

  return <View style={[badgeStyle, style]} {...props} />;
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
