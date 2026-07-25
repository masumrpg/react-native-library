import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SystemBars, type SystemBarStyle } from "react-native-edge-to-edge";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@masumdev/rn-ui";

export interface SystemUIOverlayProps {
  top?: boolean;
  bottom?: boolean;
  statusBarStyle?: Extract<SystemBarStyle, "light" | "dark" | "auto">;
}

export function SystemUIOverlay({
  top = true,
  bottom = true,
  statusBarStyle,
}: SystemUIOverlayProps) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const resolvedStyle = statusBarStyle ?? (isDark ? "light" : "dark");

  return (
    <>
      <SystemBars style={resolvedStyle} />

      {top ? (
        <View
          pointerEvents="none"
          style={[styles.topGradient, { height: insets.top + 40 }]}
        >
          <LinearGradient
            colors={[colors.background, "transparent"]}
            style={StyleSheet.absoluteFill}
          />
        </View>
      ) : null}

      {bottom ? (
        <View
          pointerEvents="none"
          style={[styles.bottomGradient, { height: insets.bottom + 60 }]}
        >
          <LinearGradient
            colors={["transparent", colors.background]}
            style={StyleSheet.absoluteFill}
          />
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 99,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 99,
  },
});
