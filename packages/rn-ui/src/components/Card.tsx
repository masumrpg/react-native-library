import React from "react";
import { View, type ViewProps, type ViewStyle } from "react-native";

import { useTheme } from "../theme";

export interface CardProps extends ViewProps {
  padded?: boolean;
  elevated?: boolean;
  outlined?: boolean;
}

export function Card({
  padded = true,
  elevated = false,
  outlined = true,
  style,
  ...props
}: CardProps) {
  const { colors, components, radii, spacing, shadows } = useTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: padded ? spacing.lg : undefined,
    borderWidth: outlined ? components.borderWidth.strong : 0,
    borderColor: colors.border,
    ...(elevated ? shadows.md : shadows.none),
  };

  return <View style={[cardStyle, style]} {...props} />;
}
