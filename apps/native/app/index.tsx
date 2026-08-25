import React from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  BookOpen,
  ChevronRight,
  Moon,
  Palette,
  QrCode,
  Sun,
} from "lucide-react-native";
import {
  Badge,
  Box,
  Button,
  Card,
  Text,
  useTheme,
  useThemeStyles,
  type RenderIcon,
} from "@masumdev/rn-ui";
import { SystemUIOverlay } from "../components/system-ui-overlay";
import { ScreenHeader } from "../components/ScreenHeader";
import { useHeaderScroll } from "../components/useHeaderScroll";

const icon =
  (Icon: React.ComponentType<{ color?: string; size?: number }>): RenderIcon =>
  ({ color, size }) => <Icon color={color} size={size} />;

const showcases = [
  {
    route: "/qr-code",
    badge: "QR-CODE-GEN",
    title: "QR Code Generator",
    description:
      "A modern, customizable QR code generator supporting custom shapes, gradients, and loading states.",
    tone: "primary" as const,
    icon: QrCode,
  },
  {
    route: "/tajweed-verse",
    badge: "RN-TAJWEED-VERSE",
    title: "Tajweed Verse Renderer",
    description:
      "Parse Quranic script with Tajweed markup, interactive rule tooltips, theme presets, and custom rules.",
    tone: "success" as const,
    icon: BookOpen,
  },
  {
    route: "/rn-ui",
    badge: "RN-UI",
    title: "Themeable UI Kit",
    description:
      "Preview reusable Box, Text, Button, IconButton, Badge, Card, and Divider with flat light/dark themes.",
    tone: "accent" as const,
    icon: Palette,
  },
];

export default function Native() {
  const router = useRouter();
  const { colors, isDark, setColorScheme, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const [navigatingRoute, setNavigatingRoute] = React.useState<string | null>(
    null,
  );

  const { onScroll, headerStyle, scrollEventThrottle } = useHeaderScroll({
    headerHeight: 90,
  });

  const isAnyNavigating = navigatingRoute !== null;

  const handleNavigate = React.useCallback(
    (route: string) => {
      if (isAnyNavigating) return;
      setNavigatingRoute(route);
      requestAnimationFrame(() => {
        setTimeout(() => {
          router.push(route as never);
          setTimeout(() => setNavigatingRoute(null), 600);
        }, 30);
      });
    },
    [isAnyNavigating, router],
  );

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <SystemUIOverlay />

      <ScreenHeader
        eyebrow="MasumDev Mobile"
        title="Component Libraries"
        subtitle="Interact with custom React Native packages using one flat visual system."
        headerStyle={headerStyle}
        rightAction={
          <Button
            size="sm"
            variant="outline"
            tone={isDark ? "warning" : "secondary"}
            leftIcon={icon(isDark ? Sun : Moon)}
            disabled={isAnyNavigating}
            onPress={() => setColorScheme(isDark ? "light" : "dark")}
          >
            {isDark ? "Light" : "Dark"}
          </Button>
        }
      />

      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: insets.top + 95,
            paddingBottom: insets.bottom + spacing.xl,
          },
        ]}
      >
        <Box gap="md">
          <Text
            variant="labelSmall"
            color="textSubtle"
            style={styles.sectionLabel}
          >
            Explore Showcase Screens
          </Text>

          {showcases.map((item) => {
            const Icon = item.icon;
            const toneColor =
              item.tone === "success"
                ? colors.success
                : item.tone === "accent"
                  ? colors.accent
                  : colors.primary;
            const softColor =
              item.tone === "success"
                ? colors.successSoft
                : item.tone === "accent"
                  ? colors.accentSoft
                  : colors.primarySoft;
            const isNavigating = navigatingRoute === item.route;

            return (
              <Card
                key={item.route}
                style={styles.card}
              >
                <Box row center gap="md">
                  <Box
                    center
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor: softColor,
                        borderRadius: 14,
                      },
                    ]}
                  >
                    <Icon color={toneColor} size={24} />
                  </Box>
                  <Box flex={1} gap="xs">
                    <Badge tone={item.tone} size="sm">
                      {item.badge}
                    </Badge>
                    <Text variant="h3" style={styles.cardTitle}>
                      {item.title}
                    </Text>
                  </Box>
                </Box>

                <Text variant="bodySmall" color="textMuted">
                  {item.description}
                </Text>

                <Button
                  tone={item.tone}
                  variant="soft"
                  size="md"
                  rightIcon={icon(ChevronRight)}
                  loading={isNavigating}
                  disabled={isAnyNavigating && !isNavigating}
                  onPress={() => handleNavigate(item.route)}
                >
                  Explore Screen
                </Button>
              </Card>
            );
          })}
        </Box>

        <Box center style={styles.footer}>
          <Text variant="caption" color="textSubtle">
            Made by Ma'sum
          </Text>
        </Box>
      </ScrollView>
    </View>
  );
}

function useStyles() {
  return useThemeStyles((theme) => ({
    safeArea: {
      flex: 1,
      minHeight: "100%",
    },
    container: {
      paddingHorizontal: theme.spacing.xl,
      paddingBottom: theme.spacing.xl,
      gap: theme.spacing.xl,
      flexGrow: 1,
    },
    sectionLabel: {
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    iconContainer: {
      width: 48,
      height: 48,
    },
    cardTitle: {
      marginTop: theme.spacing.xs,
    },
    card: {
      gap: theme.spacing.md,
    },
    footer: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
  }));
}
