import React from "react";
import {
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../theme";
import { Text } from "./Text";
import { renderIcon, type RenderIcon, type BaseGlassProps } from "./types";

export interface TimelineProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export interface TimelineItemProps extends ViewProps, BaseGlassProps {
  active?: boolean;
  isLast?: boolean;
  isFirst?: boolean;
  lineColor?: string;
  dotColor?: string;
  icon?: RenderIcon;
  style?: StyleProp<ViewStyle>;
}

export interface TimelineTitleProps {
  children?: React.ReactNode;
}

export interface TimelineDescriptionProps {
  children?: React.ReactNode;
}

export function Timeline({ style, children, ...props }: TimelineProps) {
  const childrenArray = React.Children.toArray(children).filter(Boolean);
  const count = childrenArray.length;

  return (
    <View style={[{ gap: 0 }, style]} {...props}>
      {childrenArray.map((child, index) => {
        if (React.isValidElement<TimelineItemProps>(child)) {
          return React.cloneElement(child, {
            isLast: child.props.isLast ?? index === count - 1,
            isFirst: child.props.isFirst ?? index === 0,
          });
        }
        return child;
      })}
    </View>
  );
}

export function TimelineItem({
  active = false,
  isLast = false,
  isFirst = false,
  lineColor,
  dotColor,
  icon,
  style,
  children,
  ...props
}: TimelineItemProps) {
  const { colors, components, spacing } = useTheme();
  const indicatorSize = components.timeline.indicatorSize;
  const resolvedDotColor =
    dotColor ?? (active ? colors.primary : colors.border);
  const resolvedLineColor =
    lineColor ?? (active ? colors.primary : colors.borderMuted);

  return (
    <View style={[{ flexDirection: "row", gap: spacing.md }, style]} {...props}>
      <View style={{ alignItems: "center", width: indicatorSize + 8 }}>
        <View
          style={{
            width: indicatorSize,
            height: indicatorSize,
            borderRadius: indicatorSize / 2,
            backgroundColor: resolvedDotColor,
            marginTop: 4,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon ? renderIcon(icon, colors.onPrimary, 8) : null}
        </View>
        {!isLast && (
          <View
            style={{
              width: components.timeline.connectorWidth ?? 1.5,
              flex: 1,
              backgroundColor: resolvedLineColor,
              marginTop: 4,
            }}
          />
        )}
      </View>

      <View
        style={{
          flex: 1,
          paddingBottom: isLast ? 0 : spacing.lg,
          gap: spacing.xs,
        }}
      >
        {children}
      </View>
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
