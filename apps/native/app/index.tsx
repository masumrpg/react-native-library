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

  const handleNavigate = React.useCallback(
    (route: string) => {
      setNavigatingRoute(route);
      requestAnimationFrame(() => {
        setTimeout(() => {
          router.push(route as never);
          setTimeout(() => setNavigatingRoute(null), 600);
        }, 30);
      });
    },
    [router],
  );

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <SystemUIOverlay />
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: insets.top + spacing.xl,
            paddingBottom: insets.bottom + spacing.xl,
          },
        ]}
      >
        <Box gap="lg" style={styles.headerContainer}>
          <Box row center gap="md">
            <Box flex={1} gap="sm">
              <Text variant="labelSmall" color="primary" style={styles.eyebrow}>
                MasumDev Mobile
              </Text>
              <Text variant="h1">Component Libraries</Text>
            </Box>
            <Button
              size="sm"
              variant="outline"
              tone={isDark ? "warning" : "secondary"}
              leftIcon={icon(isDark ? Sun : Moon)}
              onPress={() => setColorScheme(isDark ? "light" : "dark")}
            >
              {isDark ? "Light" : "Dark"}
            </Button>
          </Box>
          <Text color="textMuted">
            Interact with custom React Native packages using one flat,
            token-driven visual system.
          </Text>
        </Box>

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
              <Card key={item.route} padded={false}>
                <Box p="lg" gap="md">
                  <Box row center gap="md">
                    <Box
                      center
                      radius="lg"
                      style={[
                        styles.iconContainer,
                        { backgroundColor: softColor },
                      ]}
                    >
                      <Icon color={toneColor} size={24} />
                    </Box>
                    <Box flex={1}>
                      <Badge tone={item.tone} size="sm">
                        {item.badge}
                      </Badge>
                      <Text variant="title" style={styles.cardTitle}>
                        {item.title}
                      </Text>
                    </Box>
                  </Box>

                  <Text color="textMuted">{item.description}</Text>

                  <Button
                    variant="outline"
                    tone={item.tone}
                    rightIcon={icon(ChevronRight)}
                    loading={isNavigating}
                    disabled={navigatingRoute !== null}
                    onPress={() => handleNavigate(item.route)}
                  >
                    {isNavigating ? "Opening..." : "Explore Screen"}
                  </Button>
                </Box>
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
    },
    container: {
      padding: theme.spacing.xl,
      gap: theme.spacing.xl,
    },
    headerContainer: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    eyebrow: {
      textTransform: "uppercase",
      letterSpacing: 1,
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
    footer: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
  }));
}
