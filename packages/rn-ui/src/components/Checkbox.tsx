import React from "react";
import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useTheme } from "../theme";
import { renderIcon, type RenderIcon } from "./types";

export interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  invalid?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: RenderIcon;
}

// Pure SVG/Vector checkmark to avoid external dependencies
function CheckIcon({ color }: { color: string }) {
  return (
    <View
      style={{
        width: 10,
        height: 6,
        borderLeftWidth: 1.8,
        borderBottomWidth: 1.8,
        borderColor: color,
        transform: [{ rotate: "-45deg" }],
        marginTop: -2,
      }}
    />
  );
}

export function Checkbox({
  checked = false,
  onCheckedChange,
  disabled = false,
  invalid = false,
  style,
  icon,
  ...props
}: CheckboxProps) {
  const { colors, components } = useTheme();
  const progress = useSharedValue(checked ? 1 : 0);

  React.useEffect(() => {
    progress.value = withSpring(checked ? 1 : 0, {
      damping: 14,
      stiffness: 220,
    });
  }, [checked, progress]);

  const handlePress = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  const borderColor = invalid
    ? colors.danger
    : checked
      ? colors.primary
      : colors.border;

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.65 + progress.value * 0.35 }],
  }));

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          width: 18,
          height: 18,
          borderRadius: 4,
          borderWidth: components.borderWidth.focus,
          borderColor,
          backgroundColor: colors.transparent,
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          opacity: disabled ? 0.5 : pressed ? 0.82 : 1,
        },
        style,
      ]}
      {...props}
    >
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: invalid ? colors.danger : colors.primary,
            justifyContent: "center",
            alignItems: "center",
          },
          overlayStyle,
        ]}
      >
        {icon ? (
          renderIcon(icon, colors.onPrimary, 12)
        ) : (
          <CheckIcon color={colors.onPrimary} />
        )}
      </Animated.View>
    </Pressable>
  );
}
