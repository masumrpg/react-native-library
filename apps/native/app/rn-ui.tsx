import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Heart,
  Moon,
  Palette,
  Plus,
  Settings,
  Smartphone,
  Sun,
} from "lucide-react-native";
import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  Text,
  useTheme,
  useThemeStyles,
  type ColorSchemePreference,
  type RenderIcon,
} from "@masumdev/rn-ui";

const icon =
  (Icon: React.ComponentType<{ color?: string; size?: number }>): RenderIcon =>
  ({ color, size }) =>
    <Icon color={color} size={size} />;

const themeOptions: Array<{
  label: string;
  value: ColorSchemePreference;
  icon: RenderIcon;
}> = [
  { label: "Light", value: "light", icon: icon(Sun) },
  { label: "Dark", value: "dark", icon: icon(Moon) },
  { label: "System", value: "system", icon: icon(Smartphone) },
];

export default function RnUiScreen() {
  const router = useRouter();
  const {
    colors,
    colorScheme,
    resolvedColorScheme,
    setColorScheme,
    toggleColorScheme,
  } = useTheme();
  const styles = useStyles();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Box row center gap="md" style={styles.topBar}>
          <IconButton
            icon={icon(ArrowLeft)}
            variant="outline"
            onPress={() => router.back()}
          />
          <Box flex={1}>
            <Text variant="labelSmall" color="primary">
              @masumdev/rn-ui
            </Text>
            <Text variant="h3">Component Preview</Text>
          </Box>
          <View style={styles.headerSpacer} />
        </Box>

        <Card>
          <Box gap="md">
            <Box row center gap="sm">
              <Badge tone="accent" variant="solid" icon={icon(Palette)}>
                Themeable
              </Badge>
              <Badge tone="success" variant="soft" icon={icon(Check)}>
                Typed Tokens
              </Badge>
            </Box>

            <Text variant="h1">Reusable UI foundation</Text>
            <Text color="textMuted">
              Semua komponen di screen ini memakai token yang sama untuk color,
              typography, spacing, radius, shadow, dan dark mode.
            </Text>

            <Button
              size="lg"
              fullWidth
              rightIcon={icon(ChevronRight)}
              onPress={toggleColorScheme}
            >
              Toggle Light/Dark
            </Button>
          </Box>
        </Card>

        <Section title="Theme Provider">
          <Card>
            <Box gap="md">
              <Text color="textMuted">
                Preference: {colorScheme}. Resolved: {resolvedColorScheme}.
              </Text>

              <Box row gap="sm" style={styles.wrap}>
                {themeOptions.map((item) => {
                  const active = colorScheme === item.value;

                  return (
                    <Button
                      key={item.value}
                      size="sm"
                      variant={active ? "filled" : "outline"}
                      leftIcon={item.icon}
                      onPress={() => setColorScheme(item.value)}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Box>
            </Box>
          </Card>
        </Section>

        <Section title="Text">
          <Card>
            <Box gap="sm">
              <Text variant="display">Display</Text>
              <Text variant="h1">Heading One</Text>
              <Text variant="h2">Heading Two</Text>
              <Text variant="h3">Heading Three</Text>
              <Text variant="title">Title text</Text>
              <Text variant="subtitle">Subtitle text</Text>
              <Text variant="body">Body text for normal content.</Text>
              <Text variant="bodySmall" color="textMuted">
                Small body text for secondary information.
              </Text>
              <Text variant="caption" color="textSubtle">
                Caption text for compact metadata.
              </Text>
            </Box>
          </Card>
        </Section>

        <Section title="Buttons">
          <Card>
            <Box gap="md">
              <Button leftIcon={icon(Plus)} fullWidth>
                Filled Primary
              </Button>
              <Button variant="outline" tone="secondary" fullWidth>
                Outline Secondary
              </Button>
              <Button variant="soft" tone="accent" leftIcon={icon(Heart)} fullWidth>
                Soft Accent
              </Button>
              <Button variant="ghost" tone="info" fullWidth>
                Ghost Info
              </Button>
              <Button variant="danger" fullWidth>
                Danger Action
              </Button>
              <Box row gap="sm" style={styles.wrap}>
                <Button size="xs">XS</Button>
                <Button size="sm">SM</Button>
                <Button size="md">MD</Button>
                <Button size="lg">LG</Button>
                <Button size="xl">XL</Button>
              </Box>
            </Box>
          </Card>
        </Section>

        <Section title="Icon Buttons">
          <Card>
            <Box row gap="md" center style={styles.wrap}>
              <IconButton icon={icon(ArrowLeft)} variant="ghost" />
              <IconButton icon={icon(Settings)} variant="outline" />
              <IconButton icon={icon(Heart)} variant="soft" />
              <IconButton icon={icon(Plus)} variant="filled" />
              <IconButton icon={icon(Heart)} variant="soft" badge={12} />
            </Box>
          </Card>
        </Section>

        <Section title="Badges">
          <Card>
            <Box gap="sm">
              <Box row gap="sm" style={styles.wrap}>
                <Badge tone="primary" variant="solid">
                  Primary
                </Badge>
                <Badge tone="secondary" variant="soft">
                  Secondary
                </Badge>
                <Badge tone="accent" variant="outline">
                  Accent
                </Badge>
              </Box>
              <Box row gap="sm" style={styles.wrap}>
                <Badge tone="success" icon={icon(Check)}>
                  Success
                </Badge>
                <Badge tone="warning">Warning</Badge>
                <Badge tone="danger">Danger</Badge>
                <Badge tone="info">Info</Badge>
              </Box>
              <Box row gap="sm" style={styles.wrap}>
                <Badge size="sm">Small</Badge>
                <Badge size="md">Medium</Badge>
                <Badge size="lg">Large</Badge>
              </Box>
            </Box>
          </Card>
        </Section>

        <Section title="Box, Card, Divider">
          <Card padded={false} outlined>
            <Box p="lg" gap="md">
              <Box row center gap="md">
                <Box
                  center
                  bg="primarySoft"
                  radius="lg"
                  style={styles.sampleTile}
                >
                  <Palette color={colors.primary} size={22} />
                </Box>
                <Box flex={1}>
                  <Text variant="subtitle">Composable layout primitives</Text>
                  <Text variant="bodySmall" color="textMuted">
                    Box handles common spacing, color, radius, and row layout.
                  </Text>
                </Box>
              </Box>

              <Divider />

              <Box row gap="sm">
                <Box flex={1} bg="backgroundMuted" radius="lg" p="md">
                  <Text variant="label">Surface A</Text>
                  <Text variant="caption" color="textMuted">
                    muted bg
                  </Text>
                </Box>
                <Box flex={1} bg="primarySoft" radius="lg" p="md">
                  <Text variant="label" color="primary">
                    Surface B
                  </Text>
                  <Text variant="caption" color="textMuted">
                    primary soft
                  </Text>
                </Box>
              </Box>
            </Box>
          </Card>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({
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

function useStyles() {
  return useThemeStyles((theme) => ({
    safeArea: {
      flex: 1,
    },
    content: {
      padding: theme.spacing.lg,
      gap: theme.spacing.lg,
      paddingBottom: theme.spacing.xxxl,
    },
    topBar: {
      minHeight: 48,
    },
    headerSpacer: {
      width: theme.components.iconButton.size.md,
    },
    wrap: {
      flexWrap: "wrap",
    },
    sampleTile: {
      width: 48,
      height: 48,
    },
  }));
}
