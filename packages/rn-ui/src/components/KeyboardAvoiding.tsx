import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  type KeyboardAvoidingViewProps,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../theme";
import type { ThemeColorName } from "./types";

type Space = keyof ReturnType<typeof useTheme>["spacing"];

export interface KeyboardAvoidingProps extends Omit<
  KeyboardAvoidingViewProps,
  "style"
> {
  bg?: ThemeColorName;
  p?: Space;
  px?: Space;
  py?: Space;
  gap?: Space;
  scroll?: boolean;
  fullHeight?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollViewProps?: ScrollViewProps;
  style?: StyleProp<ViewStyle>;
}

export function KeyboardAvoiding({
  bg = "background",
  p,
  px,
  py,
  gap,
  scroll = false,
  fullHeight = true,
  behavior,
  keyboardVerticalOffset = 0,
  enabled = true,
  contentContainerStyle,
  scrollViewProps,
  style,
  children,
  ...props
}: KeyboardAvoidingProps) {
  const { colors, spacing } = useTheme();
  const resolvedBehavior =
    behavior ?? (Platform.OS === "ios" ? "padding" : "height");
  const {
    contentContainerStyle: scrollContentContainerStyle,
    keyboardShouldPersistTaps = "handled",
    contentInsetAdjustmentBehavior = "automatic",
    ...restScrollViewProps
  } = scrollViewProps ?? {};

  const contentStyle: ViewStyle = {
    padding: p ? spacing[p] : undefined,
    paddingHorizontal: px ? spacing[px] : undefined,
    paddingVertical: py ? spacing[py] : undefined,
    gap: gap ? spacing[gap] : undefined,
  };

  return (
    <KeyboardAvoidingView
      behavior={resolvedBehavior}
      keyboardVerticalOffset={keyboardVerticalOffset}
      enabled={enabled}
      style={[
        {
          flex: fullHeight ? 1 : undefined,
          backgroundColor: colors[bg],
        },
        style,
      ]}
      {...props}
    >
      {scroll ? (
        <ScrollView
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
          contentContainerStyle={[
            contentStyle,
            fullHeight && { flexGrow: 1 },
            contentContainerStyle,
            scrollContentContainerStyle,
          ]}
          {...restScrollViewProps}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[contentStyle, contentContainerStyle]}>{children}</View>
      )}
    </KeyboardAvoidingView>
  );
}
