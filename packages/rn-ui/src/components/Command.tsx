import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../theme";
import { Input } from "./Input";
import { Text } from "./Text";
import { renderIcon, type RenderIcon } from "./types";

export interface CommandItem {
  value: string;
  label: string;
  description?: string;
  icon?: RenderIcon;
  disabled?: boolean;
}

export interface CommandProps {
  visible: boolean;
  items: CommandItem[];
  title?: string;
  placeholder?: string;
  emptyText?: string;
  onClose: () => void;
  onSelect?: (value: string, item: CommandItem) => void;
  style?: StyleProp<ViewStyle>;
}

export function Command({
  visible,
  items,
  title = "Command",
  placeholder = "Search...",
  emptyText = "No results",
  onClose,
  onSelect,
  style,
}: CommandProps) {
  const { colors, components, radii, spacing } = useTheme();
  const [query, setQuery] = React.useState("");
  const filtered = items.filter((item) => {
    const text = `${item.label} ${item.description ?? ""}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: colors.overlay,
          justifyContent: "flex-end",
        }}
        onPress={onClose}
      >
        <Pressable
          style={[
            {
              backgroundColor: colors.surface,
              borderTopLeftRadius: radii.xxl,
              borderTopRightRadius: radii.xxl,
              borderWidth: components.borderWidth.strong,
              borderColor: colors.border,
              padding: spacing.lg,
              gap: spacing.md,
              maxHeight: "76%",
            },
            style,
          ]}
        >
          <Text variant="title">{title}</Text>
          <Input
            value={query}
            onChangeText={setQuery}
            placeholder={placeholder}
          />
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={{ gap: spacing.sm }}>
              {filtered.length === 0 ? (
                <Text
                  color="textMuted"
                  align="center"
                  style={{ padding: spacing.lg }}
                >
                  {emptyText}
                </Text>
              ) : (
                filtered.map((item) => (
                  <Pressable
                    key={item.value}
                    disabled={item.disabled}
                    onPress={() => {
                      onSelect?.(item.value, item);
                      onClose();
                    }}
                    style={({ pressed }) => ({
                      minHeight: 48,
                      borderRadius: radii.lg,
                      padding: spacing.md,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: spacing.md,
                      backgroundColor: pressed
                        ? colors.backgroundMuted
                        : colors.surface,
                      opacity: item.disabled ? 0.5 : 1,
                    })}
                  >
                    {renderIcon(item.icon, colors.primary, 18)}
                    <View style={{ flex: 1, gap: spacing.xs }}>
                      <Text variant="label">{item.label}</Text>
                      {item.description ? (
                        <Text variant="bodySmall" color="textMuted">
                          {item.description}
                        </Text>
                      ) : null}
                    </View>
                  </Pressable>
                ))
              )}
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
