import React from "react";
import {
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../theme";
import { Text } from "./Text";

export interface BreadcrumbProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export function Breadcrumb({ style, ...props }: BreadcrumbProps) {
  const { spacing } = useTheme();
  return (
    <View
      accessibilityRole="text"
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
          gap: spacing.xs,
        },
        style,
      ]}
      {...props}
    />
  );
}

export interface BreadcrumbItemProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export function BreadcrumbItem({ style, ...props }: BreadcrumbItemProps) {
  return (
    <View
      style={[{ flexDirection: "row", alignItems: "center" }, style]}
      {...props}
    />
  );
}

export interface BreadcrumbLinkProps extends PressableProps {
  children?: React.ReactNode;
}

export interface BreadcrumbPageProps {
  children?: React.ReactNode;
}

export interface BreadcrumbSeparatorProps {
  children?: React.ReactNode;
}

export function BreadcrumbLink({
  children,
  disabled,
  ...props
}: BreadcrumbLinkProps) {
  return (
    <Pressable disabled={disabled} {...props}>
      {typeof children === "string" ? (
        <Text variant="bodySmall" color={disabled ? "text" : "primary"}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

export function BreadcrumbPage({ children }: BreadcrumbPageProps) {
  return typeof children === "string" ? (
    <Text variant="bodySmall" color="text">
      {children}
    </Text>
  ) : (
    <>{children}</>
  );
}

export function BreadcrumbSeparator({
  children = "/",
}: BreadcrumbSeparatorProps) {
  return typeof children === "string" ? (
    <Text variant="bodySmall" color="textSubtle">
      {children}
    </Text>
  ) : (
    <>{children}</>
  );
}
