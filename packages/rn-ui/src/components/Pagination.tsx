import React from "react";
import {
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../theme";
import { Button } from "./Button";
import { Text } from "./Text";

export interface PaginationProps extends ViewProps {
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
  previousLabel?: string;
  nextLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  previousLabel = "Prev",
  nextLabel = "Next",
  style,
  ...props
}: PaginationProps) {
  const { spacing } = useTheme();
  const safePage = Math.min(pageCount, Math.max(1, page));

  return (
    <View
      style={[
        {
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: spacing.sm,
        },
        style,
      ]}
      {...props}
    >
      <Button
        size="sm"
        variant="outline"
        tone="secondary"
        disabled={safePage <= 1}
        onPress={() => onPageChange?.(safePage - 1)}
      >
        {previousLabel}
      </Button>
      <Text
        variant="labelSmall"
        color="textMuted"
        style={{ fontVariant: ["tabular-nums"] }}
      >
        {safePage} / {pageCount}
      </Text>
      <Button
        size="sm"
        variant="outline"
        tone="secondary"
        disabled={safePage >= pageCount}
        onPress={() => onPageChange?.(safePage + 1)}
      >
        {nextLabel}
      </Button>
    </View>
  );
}
