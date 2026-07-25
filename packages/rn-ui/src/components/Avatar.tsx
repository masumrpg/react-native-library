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

export type AvatarSize = "default" | "sm" | "lg";

interface AvatarContextType {
  size: AvatarSize;
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
} | null>(null);

export interface AvatarProps extends React.ComponentPropsWithoutRef<
  typeof View
> {
  size?: AvatarSize;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export function Avatar({
  size = "default",
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
  const inGroup = !!group;

  // Determine width and height based on size
  const dimension = finalSize === "lg" ? 40 : finalSize === "sm" ? 24 : 32;

  const rootStyle: ViewStyle = {
    position: "relative",
    width: dimension,
    height: dimension,
    borderRadius: radii.full,
    backgroundColor: colors.backgroundMuted,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible", // Let the badge sit outside or on the edge
    ...(inGroup
      ? {
          borderWidth: components.borderWidth.ring,
          borderColor: colors.background, // ring-2 ring-background
        }
      : {}),
  };

  return (
    <AvatarContext.Provider
      value={{
        size: finalSize,
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
  const { setHasLoaded, setHasError, hasError } = useAvatarContext();
  const { radii } = useTheme();

  useEffect(() => {
    setHasLoaded(false);
    setHasError(false);
  }, [source]);

  if (hasError) {
    return null;
  }

  const handleLoad = (e: any) => {
    setHasLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e: any) => {
    setHasError(true);
    onError?.(e);
  };

  return (
    <Image
      source={source}
      style={[
        StyleSheet.absoluteFill,
        {
          borderRadius: radii.full,
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
  const { hasLoaded, hasError, size } = useAvatarContext();
  const { colors, radii } = useTheme();

  // Show fallback only if not loaded yet OR if load failed
  if (hasLoaded && !hasError) {
    return null;
  }

  const fallbackStyle: ViewStyle = {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radii.full,
    backgroundColor: colors.backgroundMuted,
    alignItems: "center",
    justifyContent: "center",
  };

  // Determine text size based on size
  const fontSize = size === "lg" ? 16 : size === "sm" ? 10 : 12;

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
  bg?: string; // Custom background color override
}

export function AvatarBadge({ style, bg, ...props }: AvatarBadgeProps) {
  const { size } = useAvatarContext();
  const { colors, components } = useTheme();

  // Determine badge dimensions based on parent size
  const badgeSize = size === "lg" ? 12 : size === "sm" ? 8 : 10;
  const offset = size === "lg" ? 0 : size === "sm" ? -1 : -0.5;

  const badgeStyle: ViewStyle = {
    position: "absolute",
    right: offset,
    bottom: offset,
    width: badgeSize,
    height: badgeSize,
    borderRadius: badgeSize / 2,
    backgroundColor: bg || colors.primary,
    borderWidth: components.borderWidth.focus,
    borderColor: colors.background, // ring-2 ring-background
    zIndex: 10,
  };

  return <View style={[badgeStyle, style]} {...props} />;
}

export interface AvatarGroupProps extends React.ComponentPropsWithoutRef<
  typeof View
> {
  size?: AvatarSize;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export function AvatarGroup({
  size = "default",
  style,
  children,
  ...props
}: AvatarGroupProps) {
  const groupStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
  };

  // Spacing values mapped to negative margins
  const spacing = size === "lg" ? -10 : size === "sm" ? -6 : -8;

  return (
    <GroupContext.Provider value={{ inGroup: true, size }}>
      <View style={[groupStyle, style]} {...props}>
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return child;

          return React.cloneElement(child, {
            style: [
              {
                marginLeft: index === 0 ? 0 : spacing,
              },
              child.props.style,
            ],
          } as any);
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

  const dimension = size === "lg" ? 40 : size === "sm" ? 24 : 32;
  const spacing = size === "lg" ? -10 : size === "sm" ? -6 : -8;
  const fontSize = size === "lg" ? 14 : size === "sm" ? 10 : 12;

  const countStyle: ViewStyle = {
    width: dimension,
    height: dimension,
    borderRadius: radii.full,
    backgroundColor: colors.backgroundMuted,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: components.borderWidth.ring,
    borderColor: colors.background, // ring-2 ring-background
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
