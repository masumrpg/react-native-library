import React from "react";
import { Animated, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { Box, Text } from "@masumdev/rn-ui";

export type RnUiSectionContext = Record<string, any>;

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ComponentProps<typeof Box>["children"];
}) {
  return (
    <Box gap="sm">
      <Text variant="labelSmall" color="textSubtle" style={{ textTransform: "uppercase" }}>
        {title}
      </Text>
      {children}
    </Box>
  );
}

export function AnimatedDetail({
  visible,
  children,
}: {
  visible: boolean;
  children: React.ComponentProps<typeof Box>["children"];
}) {
  const progress = React.useRef(new Animated.Value(visible ? 1 : 0)).current;
  const [contentHeight, setContentHeight] = React.useState(0);
  const [shouldRender, setShouldRender] = React.useState(visible);

  React.useEffect(() => {
    if (visible) {
      setShouldRender(true);
    }

    Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && !visible) {
        setShouldRender(false);
      }
    });
  }, [progress, visible]);

  const height = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight],
  });

  if (!shouldRender && !visible) {
    return null;
  }

  return (
    <Animated.View style={{ height, opacity: progress, overflow: "hidden" }}>
      <View
        style={{ position: "absolute", left: 0, right: 0 }}
        onLayout={(event) => setContentHeight(event.nativeEvent.layout.height)}
      >
        {children}
      </View>
    </Animated.View>
  );
}

export function AnimatedToggleIcon({
  expanded,
  color,
  size,
  direction = "down",
}: {
  expanded: boolean;
  color: string;
  size: number;
  direction?: "down" | "up" | "left";
}) {
  const progress = React.useRef(new Animated.Value(expanded ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: expanded ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [expanded, progress]);

  const outputRange =
    direction === "up"
      ? ["0deg", "-90deg"]
      : direction === "left"
        ? ["0deg", "180deg"]
        : ["0deg", "90deg"];

  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange,
  });

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <ChevronRight color={color} size={size} />
    </Animated.View>
  );
}
