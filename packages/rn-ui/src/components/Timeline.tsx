import React from "react";
import {
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../theme";
import { Text } from "./Text";

export interface TimelineProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export interface TimelineItemProps extends ViewProps {
  active?: boolean;
  style?: StyleProp<ViewStyle>;
}

export interface TimelineTitleProps {
  children?: React.ReactNode;
}

export interface TimelineDescriptionProps {
  children?: React.ReactNode;
}

export function Timeline({ style, ...props }: TimelineProps) {
  const { spacing } = useTheme();
  return <View style={[{ gap: spacing.md }, style]} {...props} />;
}

export function TimelineItem({
  active = false,
  style,
  children,
  ...props
}: TimelineItemProps) {
  const { colors, components, spacing } = useTheme();
  const indicatorSize = components.timeline.indicatorSize;

  return (
    <View style={[{ flexDirection: "row", gap: spacing.md }, style]} {...props}>
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            width: indicatorSize,
            height: indicatorSize,
            borderRadius: indicatorSize / 2,
            backgroundColor: active ? colors.primary : colors.border,
          }}
        />
        <View
          style={{
            width: components.timeline.connectorWidth,
            flex: 1,
            minHeight: components.timeline.connectorMinHeight,
            backgroundColor: colors.borderMuted,
          }}
        />
      </View>
      <View style={{ flex: 1, gap: spacing.xs }}>{children}</View>
    </View>
  );
}

export function TimelineTitle({ children }: TimelineTitleProps) {
  return typeof children === "string" ? (
    <Text variant="label">{children}</Text>
  ) : (
    <>{children}</>
  );
}

export function TimelineDescription({ children }: TimelineDescriptionProps) {
  return typeof children === "string" ? (
    <Text variant="bodySmall" color="textMuted">
      {children}
    </Text>
  ) : (
    <>{children}</>
  );
}
