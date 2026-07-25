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

export type ButtonGroupOrientation = "horizontal" | "vertical";

export interface ButtonGroupProps extends ViewProps {
  orientation?: ButtonGroupOrientation;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const isAbsolute = (style: any): boolean => {
  if (!style) return false;
  if (Array.isArray(style)) {
    return style.some((s) => s && s.position === "absolute");
  }
  return style.position === "absolute";
};

export function ButtonGroup({
  orientation = "horizontal",
  style,
  children,
  ...props
}: ButtonGroupProps) {
  const isHorizontal = orientation === "horizontal";

  const groupStyle: ViewStyle = {
    flexDirection: isHorizontal ? "row" : "column",
    alignItems: "stretch",
    width: "100%",
  };

  const validChildren = React.Children.toArray(children).filter(Boolean);
  const layoutChildren = validChildren.filter((child) => {
    if (!React.isValidElement(child)) return false;
    return !isAbsolute(child.props.style);
  });
  const count = layoutChildren.length;
  let layoutIndex = 0;

  return (
    <View style={[groupStyle, style]} {...props}>
      {validChildren.map((child) => {
        if (!React.isValidElement(child)) return child;

        if (isAbsolute(child.props.style)) {
          // If the child is absolute (like the sliding indicator), we do not modify its style
          return child;
        }

        const index = layoutIndex;
        layoutIndex++;

        // Visual border & radius overrides based on position in group
        const childStyle: ViewStyle = {};

        if (isHorizontal) {
          if (index > 0) {
            childStyle.borderTopLeftRadius = 0;
            childStyle.borderBottomLeftRadius = 0;
            childStyle.borderLeftWidth = 0;
          }
          if (index < count - 1) {
            childStyle.borderTopRightRadius = 0;
            childStyle.borderBottomRightRadius = 0;
          }
        } else {
          if (index > 0) {
            childStyle.borderTopLeftRadius = 0;
            childStyle.borderTopRightRadius = 0;
            childStyle.borderTopWidth = 0;
          }
          if (index < count - 1) {
            childStyle.borderBottomLeftRadius = 0;
            childStyle.borderBottomRightRadius = 0;
          }
        }

        // Clone child and inject styles.
        // We append childStyle AFTER child's own style to ensure adjacent flat corners & border removals override defaults.
        return React.cloneElement(child, {
          style: [child.props.style, childStyle],
        } as any);
      })}
    </View>
  );
}

export interface ButtonGroupTextProps extends React.ComponentPropsWithoutRef<
  typeof View
> {
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

export function ButtonGroupText({
  style,
  textStyle,
  children,
  ...props
}: ButtonGroupTextProps) {
  const { colors, radii, spacing } = useTheme();

  const textContainerStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundMuted,
    borderColor: colors.border,
    borderWidth: 1.25,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
  };

  return (
    <View style={[textContainerStyle, style]} {...props}>
      {typeof children === "string" ? (
        <Text
          style={[
            { color: colors.text, fontSize: 14, fontWeight: "500" },
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

export interface ButtonGroupSeparatorProps extends React.ComponentPropsWithoutRef<
  typeof View
> {
  orientation?: ButtonGroupOrientation;
  style?: StyleProp<ViewStyle>;
}

export function ButtonGroupSeparator({
  orientation = "vertical",
  style,
  ...props
}: ButtonGroupSeparatorProps) {
  const { colors } = useTheme();
  const isVertical = orientation === "vertical";

  const separatorStyle: ViewStyle = isVertical
    ? {
        width: 1.25,
        backgroundColor: colors.border,
        alignSelf: "stretch",
      }
    : {
        height: 1.25,
        backgroundColor: colors.border,
        alignSelf: "stretch",
      };

  return <View style={[separatorStyle, style]} {...props} />;
}
