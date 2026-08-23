import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../theme";
import { triggerHaptic } from "../utils/haptics";
import { Badge } from "./Badge";
import { Input } from "./Input";
import { Sheet } from "./Sheet";
import { Text } from "./Text";
import { renderIcon, type RenderIcon } from "./types";

export interface CommandItem {
  value: string;
  label: string;
  description?: string;
  group?: string;
  shortcut?: string;
  badge?: string;
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
  title = "Command Palette",
  placeholder = "Type a command or search...",
  emptyText = "No matching commands found",
  onClose,
  onSelect,
  style,
}: CommandProps) {
  const { colors, radii, spacing } = useTheme();
  const [query, setQuery] = useState("");

  const filtered = items.filter((item) => {
    const text = `${item.label} ${item.description ?? ""} ${item.group ?? ""}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  const groupedItems = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    const groupName = item.group ?? "General";
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(item);
    return acc;
  }, {});

  const handleSelect = (item: CommandItem) => {
    if (item.disabled) return;
    triggerHaptic("selection");
    onSelect?.(item.value, item);
    onClose();
  };

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title={title}
      style={style}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ gap: spacing.md }}
      >
        {/* Search Input */}
        <Input
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder}
          size="md"
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* Command Items List */}
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={{ maxHeight: 380 }}
          contentContainerStyle={{ paddingVertical: spacing.xs, gap: spacing.md }}
        >
          {filtered.length === 0 ? (
            <View style={{ paddingVertical: spacing.xl, alignItems: "center" }}>
              <Text color="textMuted" align="center">
                {emptyText}
              </Text>
            </View>
          ) : (
            Object.entries(groupedItems).map(([groupName, groupList]) => (
              <View key={groupName} style={{ gap: spacing.xs }}>
                <Text
                  variant="labelSmall"
                  color="textMuted"
                  style={{
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    fontSize: 11,
                    fontWeight: "700",
                    paddingHorizontal: spacing.xs,
                  }}
                >
                  {groupName}
                </Text>

                {groupList.map((item) => (
                  <Pressable
                    key={item.value}
                    disabled={item.disabled}
                    onPress={() => handleSelect(item)}
                    style={({ pressed }) => ({
                      minHeight: 48,
                      borderRadius: radii.xl,
                      paddingVertical: spacing.md,
                      paddingHorizontal: spacing.md,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: spacing.md,
                      backgroundColor: pressed
                        ? colors.backgroundMuted
                        : colors.surfaceMuted,
                      borderWidth: 1,
                      borderColor: pressed ? colors.border : colors.borderMuted,
                      opacity: item.disabled ? 0.5 : 1,
                    })}
                  >
                    {item.icon ? renderIcon(item.icon, colors.primary, 18) : null}

                    <View style={{ flex: 1, gap: 2 }}>
                      <Text variant="label" weight="600">
                        {item.label}
                      </Text>
                      {item.description ? (
                        <Text variant="bodySmall" color="textMuted">
                          {item.description}
                        </Text>
                      ) : null}
                    </View>

                    {item.badge ? (
                      <Badge tone="accent" size="sm">
                        {item.badge}
                      </Badge>
                    ) : null}

                    {item.shortcut ? (
                      <View
                        style={{
                          backgroundColor: colors.backgroundMuted,
                          paddingHorizontal: 8,
                          paddingVertical: 3,
                          borderRadius: radii.sm,
                          borderWidth: 1,
                          borderColor: colors.borderMuted,
                        }}
                      >
                        <Text
                          variant="caption"
                          color="textMuted"
                          style={{ fontWeight: "700" }}
                        >
                          {item.shortcut}
                        </Text>
                      </View>
                    ) : null}
                  </Pressable>
                ))}
              </View>
            ))
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Sheet>
  );
}
