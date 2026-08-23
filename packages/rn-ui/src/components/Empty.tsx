import React from "react";
import {
  View,
  type StyleProp,
  type TextStyle,
  type ViewProps,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../theme";
import { Text } from "./Text";
import type { BaseGlassProps } from "./types";

export type EmptyMediaVariant = "default" | "icon";
export type EmptyMediaSize = "sm" | "md" | "lg";

export interface EmptyProps extends ViewProps, BaseGlassProps {
  bordered?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Empty({
  bordered = false,
  glass = false,
  style,
  ...props
}: EmptyProps) {
  const { colors, components, radii, spacing, isDark } = useTheme();

  const glassBg = isDark
    ? "rgba(15, 27, 45, 0.60)"
    : "rgba(255, 255, 255, 0.75)";

  return (
    <View
      style={[
        {
          width: "100%",
          minWidth: 0,
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: spacing.lg,
          borderRadius: radii.xl,
          borderWidth: bordered ? components.borderWidth.strong : 0,
          borderStyle: bordered ? "dashed" : "solid",
          borderColor: glass
            ? isDark
              ? "rgba(248, 250, 252, 0.20)"
              : "rgba(15, 23, 42, 0.14)"
            : bordered
              ? colors.border
              : colors.transparent,
          backgroundColor: glass ? glassBg : colors.transparent,
          padding: spacing.xxl,
        },
        style,
      ]}
      {...props}
    />
  );
}

export interface EmptyHeaderProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export function EmptyHeader({ style, ...props }: EmptyHeaderProps) {
  const { spacing } = useTheme();

  return (
    <View
      style={[
        {
          width: "100%",
          maxWidth: 340,
          alignItems: "center",
          gap: spacing.sm,
        },
        style,
      ]}
      {...props}
    />
  );
}

export interface EmptyMediaProps extends ViewProps, BaseGlassProps {
  variant?: EmptyMediaVariant;
  size?: EmptyMediaSize;
  style?: StyleProp<ViewStyle>;
}

const iconMediaSizes: Record<EmptyMediaSize, number> = {
  sm: 44,
  md: 56,
  lg: 72,
};

export function EmptyMedia({
  variant = "default",
  size = "md",
  glass = false,
  style,
  ...props
}: EmptyMediaProps) {
  const { colors, radii, spacing, isDark } = useTheme();
  const isIcon = variant === "icon";
  const boxSize = iconMediaSizes[size];

  const glassBg = isDark
    ? "rgba(15, 27, 45, 0.70)"
    : "rgba(255, 255, 255, 0.85)";

  return (
    <View
      style={[
        {
          marginBottom: spacing.xs,
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          width: isIcon ? boxSize : undefined,
          height: isIcon ? boxSize : undefined,
          borderRadius: isIcon ? radii.xl : undefined,
          backgroundColor: isIcon
            ? glass
              ? glassBg
              : colors.primarySoft
            : colors.transparent,
        },
        style,
      ]}
      {...props}
    />
  );
}

export interface EmptyTitleProps {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export function EmptyTitle({ children, style }: EmptyTitleProps) {
  return (
    <Text variant="title" align="center" style={style}>
      {children}
    </Text>
  );
}

export interface EmptyDescriptionProps {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export function EmptyDescription({ children, style }: EmptyDescriptionProps) {
  return (
    <Text variant="bodySmall" color="textMuted" align="center" style={style}>
      {children}
    </Text>
  );
}

export interface EmptyContentProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export function EmptyContent({ style, ...props }: EmptyContentProps) {
  const { spacing } = useTheme();

  return (
    <View
      style={[
        {
          width: "100%",
          maxWidth: 340,
          minWidth: 0,
          alignItems: "center",
          gap: spacing.sm,
        },
        style,
      ]}
      {...props}
    />
  );
}
