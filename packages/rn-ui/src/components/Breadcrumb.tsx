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
import { renderIcon, type RenderIcon } from "./types";

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
      style={[{ flexDirection: "row", alignItems: "center", gap: 4 }, style]}
      {...props}
    />
  );
}

export interface BreadcrumbLinkProps extends Omit<PressableProps, "children"> {
  children?: React.ReactNode | RenderIcon;
}

export interface BreadcrumbPageProps {
  children?: React.ReactNode | RenderIcon;
}

export interface BreadcrumbSeparatorProps {
  children?: React.ReactNode | RenderIcon;
}

export function BreadcrumbLink({
  children,
  disabled,
  ...props
}: BreadcrumbLinkProps) {
  const { colors } = useTheme();

  return (
    <Pressable disabled={disabled} hitSlop={4} {...props}>
      {typeof children === "string" ? (
        <Text variant="bodySmall" color={disabled ? "textMuted" : "primary"} weight="600">
          {children}
        </Text>
      ) : typeof children === "function" ? (
        renderIcon(children as RenderIcon, disabled ? colors.textMuted : colors.primary, 14)
      ) : (
        children
      )}
    </Pressable>
  );
}

export function BreadcrumbPage({ children }: BreadcrumbPageProps) {
  const { colors } = useTheme();

  return typeof children === "string" ? (
    <Text variant="bodySmall" color="text" weight="600">
      {children}
    </Text>
  ) : typeof children === "function" ? (
    renderIcon(children as RenderIcon, colors.text, 14)
  ) : (
    <>{children}</>
  );
}

export function BreadcrumbSeparator({
  children = "/",
}: BreadcrumbSeparatorProps) {
  const { colors } = useTheme();

  if (typeof children === "string") {
    return (
      <Text variant="bodySmall" color="textSubtle">
        {children}
      </Text>
    );
  }

  if (typeof children === "function") {
    return <>{renderIcon(children as RenderIcon, colors.textMuted, 14)}</>;
  }

  return <>{children}</>;
}
