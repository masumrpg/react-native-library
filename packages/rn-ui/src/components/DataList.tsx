import React from "react";
import {
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../theme";
import { Text } from "./Text";

export interface DataListProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export interface DataListItemProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export interface DataListLabelProps {
  children?: React.ReactNode;
}

export interface DataListValueProps {
  children?: React.ReactNode;
}

export function DataList({ style, ...props }: DataListProps) {
  const { spacing } = useTheme();
  return (
    <View style={[{ width: "100%", gap: spacing.sm }, style]} {...props} />
  );
}

export function DataListItem({ style, ...props }: DataListItemProps) {
  const { colors, components, spacing } = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: spacing.md,
          paddingVertical: spacing.sm,
          borderBottomWidth: components.borderWidth.default,
          borderBottomColor: colors.borderMuted,
        },
        style,
      ]}
      {...props}
    />
  );
}

export function DataListLabel({ children }: DataListLabelProps) {
  return typeof children === "string" ? (
    <Text variant="bodySmall" color="textMuted">
      {children}
    </Text>
  ) : (
    <>{children}</>
  );
}

export function DataListValue({ children }: DataListValueProps) {
  return typeof children === "string" ? (
    <Text variant="label" color="text" align="right">
      {children}
    </Text>
  ) : (
    <>{children}</>
  );
}
