import React from "react";
import {
  ScrollView,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../theme";
import { Text } from "./Text";

export interface TableProps extends ViewProps {
  horizontal?: boolean;
  style?: StyleProp<ViewStyle>;
}

export interface TableRowProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export interface TableHeadProps extends ViewProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface TableCellProps extends ViewProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Table({
  horizontal = true,
  style,
  children,
  ...props
}: TableProps) {
  const { colors, components, radii } = useTheme();
  const table = (
    <View
      style={[
        {
          borderWidth: components.borderWidth.strong,
          borderColor: colors.border,
          borderRadius: radii.lg,
          overflow: "hidden",
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );

  return horizontal ? (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {table}
    </ScrollView>
  ) : (
    table
  );
}

export function TableRow({ style, ...props }: TableRowProps) {
  return <View style={[{ flexDirection: "row" }, style]} {...props} />;
}

export function TableHead({ children, style, ...props }: TableHeadProps) {
  const { colors, components, spacing } = useTheme();

  return (
    <View
      style={[
        {
          minWidth: components.table.minColumnWidth,
          padding: spacing.md,
          borderBottomWidth: components.borderWidth.default,
          borderBottomColor: colors.borderMuted,
        },
        style,
      ]}
      {...props}
    >
      {typeof children === "string" ? (
        <Text variant="labelSmall">{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

export function TableCell({ children, style, ...props }: TableCellProps) {
  const { colors, components, spacing } = useTheme();

  return (
    <View
      style={[
        {
          minWidth: components.table.minColumnWidth,
          padding: spacing.md,
          borderTopWidth: components.borderWidth.default,
          borderTopColor: colors.borderMuted,
        },
        style,
      ]}
      {...props}
    >
      {typeof children === "string" ? (
        <Text variant="bodySmall">{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}
