import React from "react";
import { StyleSheet, View, type ViewProps, type ViewStyle } from "react-native";

import { useTheme } from "../theme";

export interface AspectRatioProps extends ViewProps {
  /**
   * The aspect ratio of the container, e.g., 16/9, 4/3, 1.
   * Defaults to 1.
   */
  ratio?: number;
  /**
   * The border radius token from the theme.
   */
  radius?: keyof ReturnType<typeof useTheme>["radii"];
  /**
   * The content to render inside the AspectRatio container.
   */
  children?: React.ReactNode;
}

export function AspectRatio({
  ratio = 1,
  radius,
  children,
  style,
  ...props
}: AspectRatioProps) {
  const { radii } = useTheme();

  const containerStyle: ViewStyle = {
    width: "100%",
    aspectRatio: ratio,
    overflow: "hidden",
    borderRadius: radius ? radii[radius] : undefined,
  };

  return (
    <View style={[containerStyle, style]} {...props}>
      <View style={StyleSheet.absoluteFill}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              style: [StyleSheet.absoluteFill, child.props.style],
            } as any);
          }
          return child;
        })}
      </View>
    </View>
  );
}
