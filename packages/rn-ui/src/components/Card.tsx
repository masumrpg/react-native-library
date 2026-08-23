import React from "react";
import { View, type ViewProps, type ViewStyle } from "react-native";

import { useTheme } from "../theme";
import type { BaseGlassProps } from "./types";

export interface CardProps extends ViewProps, BaseGlassProps {
  padded?: boolean;
  elevated?: boolean;
  outlined?: boolean;
}

export function Card({
  padded = true,
  elevated = false,
  outlined = true,
  glass = false,
  style,
  ...props
}: CardProps) {
  const { colors, components, radii, spacing, shadows, isDark } = useTheme();

  const glassBg = isDark ? "rgba(15, 27, 45, 0.60)" : "rgba(255, 255, 255, 0.75)";
  const glassBorder = isDark ? "rgba(248, 250, 252, 0.18)" : "rgba(15, 23, 42, 0.14)";

  const cardStyle: ViewStyle = {
    backgroundColor: glass ? glassBg : colors.surface,
    borderRadius: radii.xl,
    padding: padded ? spacing.lg : undefined,
    borderWidth: outlined ? components.borderWidth.strong : 0,
    borderColor: glass ? glassBorder : colors.border,
    overflow: "hidden",
    ...(elevated ? shadows.md : shadows.none),
  };

  return <View style={[cardStyle, style]} {...props} />;
}
