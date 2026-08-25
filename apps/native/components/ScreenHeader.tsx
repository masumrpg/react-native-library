import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { ChevronLeft } from "lucide-react-native";
import {
  Box,
  IconButton,
  Text,
  useTheme,
  useThemeStyles,
  type RenderIcon,
} from "@masumdev/rn-ui";

const icon =
  (Icon: React.ComponentType<{ color?: string; size?: number }>): RenderIcon =>
  ({ color, size }) => <Icon color={color} size={size} />;

export interface ScreenHeaderProps {
  title: string | React.ReactNode;
  subtitle?: string;
  eyebrow?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  headerStyle?: StyleProp<ViewStyle>;
  sticky?: boolean;
  blurIntensity?: number;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  eyebrow,
  showBack = false,
  onBack,
  rightAction,
  headerStyle,
  sticky = true,
  blurIntensity = 100,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const styles = useStyles();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const topPadding = insets.top + 8;

  return (
    <Animated.View
      style={[
        sticky ? styles.stickyContainer : styles.staticContainer,
        { paddingTop: topPadding },
        headerStyle,
      ]}
    >
      <BlurView
        intensity={blurIntensity}
        tint={isDark ? "dark" : "light"}
        style={[
          styles.blurOverlay,
          {
            backgroundColor: isDark
              ? "rgba(5, 22, 30, 0.40)"
              : "rgba(255, 255, 255, 0.40)",
          },
        ]}
      />

      <Box row center gap="md" style={styles.contentRow}>
        {showBack && (
          <IconButton
            icon={icon(ChevronLeft)}
            variant="outline"
            size="md"
            onPress={handleBack}
          />
        )}

        <Box flex={1} gap="xs">
          {!!eyebrow && (
            <Text variant="labelSmall" color="primary" numberOfLines={1}>
              {eyebrow}
            </Text>
          )}
          {typeof title === "string" ? (
            <Text variant={eyebrow ? "h3" : "h2"} numberOfLines={1}>
              {title}
            </Text>
          ) : (
            title
          )}
          {!!subtitle && (
            <Text
              variant="caption"
              color="textMuted"
              numberOfLines={1}
              style={styles.subtitle}
            >
              {subtitle}
            </Text>
          )}
        </Box>

        {rightAction && <Box row center gap="xs">{rightAction}</Box>}
      </Box>
    </Animated.View>
  );
};

function useStyles() {
  return useThemeStyles((theme) => ({
    stickyContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 999,
      overflow: "hidden",
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    staticContainer: {
      overflow: "hidden",
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    blurOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    contentRow: {
      minHeight: 48,
      zIndex: 1,
    },
    subtitle: {
      marginTop: 2,
    },
  }));
}
