import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, Moon, Sun } from "lucide-react-native";
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
  /**
   * Custom right action component.
   * If not provided (`undefined`), a dark/light mode toggle button is rendered by default.
   * Pass `null` to render no right action.
   */
  rightAction?: React.ReactNode | null;
  headerStyle?: StyleProp<ViewStyle>;
  sticky?: boolean;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  eyebrow,
  showBack = false,
  onBack,
  rightAction,
  headerStyle,
  sticky = false,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark, setColorScheme } = useTheme();
  const styles = useStyles();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const toggleTheme = () => {
    setColorScheme(isDark ? "light" : "dark");
  };

  const topPadding = insets.top + 8;

  const renderRightAction = () => {
    if (rightAction === null) {
      return null;
    }
    if (rightAction !== undefined) {
      return rightAction;
    }
    return (
      <IconButton
        icon={icon(isDark ? Sun : Moon)}
        variant="outline"
        size="md"
        onPress={toggleTheme}
      />
    );
  };

  return (
    <View
      style={[
        sticky ? styles.stickyContainer : styles.staticContainer,
        {
          paddingTop: topPadding,
          backgroundColor: colors.surface,
        },
        headerStyle,
      ]}
    >
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

        <Box row center gap="xs">
          {renderRightAction()}
        </Box>
      </Box>
    </View>
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
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderMuted,
    },
    staticContainer: {
      position: "relative",
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderMuted,
    },
    contentRow: {
      minHeight: 48,
    },
    subtitle: {
      marginTop: 2,
    },
  }));
}
