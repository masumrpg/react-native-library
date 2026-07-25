import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, RefreshCw } from "lucide-react-native";
import { QRCode, QR_CODE_CONFIGS } from "@masumdev/react-native-qr-code-gen";
import {
  Box,
  Button,
  Card,
  IconButton,
  Text,
  useTheme,
  useThemeStyles,
  type RenderIcon,
} from "@masumdev/rn-ui";
import { SystemUIOverlay } from "../components/system-ui-overlay";

const icon =
  (Icon: React.ComponentType<{ color?: string; size?: number }>): RenderIcon =>
  ({ color, size }) => <Icon color={color} size={size} />;

const featuredVariants = [
  { label: "Basic Variant", value: "https://google.com", variant: "BASIC" },
  { label: "Heart Variant", value: "Love QR", variant: "HEART" },
  { label: "Linear Gradient", value: "Gradients", variant: "LINEAR_GRADIENT" },
] as const;

const bareVariants = [
  { label: "Triangle", value: "Triangle", variant: "TRIANGLE" },
  { label: "Dot", value: "Dots", variant: "DOT" },
] as const;

export default function QRCodeScreen() {
  const router = useRouter();
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const [demoLoading, setDemoLoading] = useState(true);

  const refreshLoading = () => {
    setDemoLoading(true);
    setTimeout(() => setDemoLoading(false), 2000);
  };

  useEffect(() => {
    refreshLoading();
  }, []);

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <SystemUIOverlay />
      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: insets.top + spacing.xl,
            paddingBottom: insets.bottom + spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Box row center gap="md" style={styles.topBar}>
          <IconButton
            icon={icon(ChevronLeft)}
            variant="outline"
            onPress={() => router.back()}
          />
          <Box flex={1}>
            <Text variant="labelSmall" color="primary">
              @masumdev/react-native-qr-code-gen
            </Text>
            <Text variant="h3">QR Code Generator</Text>
          </Box>
          <View style={styles.headerSpacer} />
        </Box>

        <Text color="textMuted" align="center">
          Modern custom QR components with presets, states, and gallery preview.
        </Text>

        <Section title="Featured Variants">
          {featuredVariants.map((item) => (
            <PreviewCard key={item.variant} label={item.label}>
              <QRCode
                value={item.value}
                size={180}
                variant={item.variant as keyof typeof QR_CODE_CONFIGS}
              />
            </PreviewCard>
          ))}
        </Section>

        <Section title="Bare Variants">
          <Box row gap="md" style={styles.wrap}>
            {bareVariants.map((item) => (
              <Card key={item.variant} style={styles.bareCard}>
                <Text
                  variant="labelSmall"
                  color="textSubtle"
                  style={styles.uppercase}
                >
                  {item.label}
                </Text>
                <QRCode
                  value={item.value}
                  size={140}
                  variant={item.variant as keyof typeof QR_CODE_CONFIGS}
                />
              </Card>
            ))}
          </Box>
        </Section>

        <Section
          title="Loading & Fallbacks"
          action={
            <Button
              size="sm"
              leftIcon={icon(RefreshCw)}
              disabled={demoLoading}
              onPress={refreshLoading}
            >
              {demoLoading ? "Loading" : "Simulate"}
            </Button>
          }
        >
          <PreviewCard label="Default Loading">
            <QRCode value="loading" size={180} isLoading={demoLoading} />
          </PreviewCard>

          <PreviewCard label="Custom Loading Renderer">
            <QRCode
              value="loading-custom"
              size={180}
              isLoading={demoLoading}
              renderLoading={() => (
                <Box center style={styles.loadingPlaceholder}>
                  <RefreshCw color={colors.primary} size={28} />
                  <Text
                    variant="caption"
                    color="textMuted"
                    style={styles.loadingText}
                  >
                    Generating...
                  </Text>
                </Box>
              )}
            />
          </PreviewCard>
        </Section>

        <Section title="Library Presets Gallery">
          <Text variant="bodySmall" color="textMuted">
            Automatically rendered from `QR_CODE_CONFIGS` presets.
          </Text>

          <Box row style={styles.grid}>
            {Object.keys(QR_CODE_CONFIGS).map((variantKey) => (
              <Card key={variantKey} style={styles.gridItem}>
                <QRCode
                  value={variantKey}
                  size={110}
                  variant={variantKey as keyof typeof QR_CODE_CONFIGS}
                />
                <Text
                  variant="labelSmall"
                  color="textMuted"
                  align="center"
                  style={styles.gridLabel}
                >
                  {variantKey.replace(/_/g, " ")}
                </Text>
              </Card>
            ))}
          </Box>
        </Section>

        <Box center style={styles.footer}>
          <Text variant="caption" color="textSubtle">
            Made by Ma'sum
          </Text>
        </Box>
      </ScrollView>
    </View>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ComponentProps<typeof Box>["children"];
  children: React.ComponentProps<typeof Box>["children"];
}) {
  const styles = useStyles();

  return (
    <Box gap="md" style={styles.section}>
      <Box row center gap="md">
        <Text variant="labelSmall" color="textSubtle" style={styles.uppercase}>
          {title}
        </Text>
        <Box flex={1} />
        {action}
      </Box>
      {children}
    </Box>
  );
}

function PreviewCard({
  label,
  children,
}: {
  label: string;
  children: React.ComponentProps<typeof Box>["children"];
}) {
  const styles = useStyles();

  return (
    <Card style={styles.previewCard}>
      <Text variant="labelSmall" color="textSubtle" style={styles.uppercase}>
        {label}
      </Text>
      {children}
    </Card>
  );
}

function useStyles() {
  return useThemeStyles((theme) => ({
    safeArea: {
      flex: 1,
    },
    topBar: {
      minHeight: 48,
    },
    headerSpacer: {
      width: theme.components.iconButton.size.md,
    },
    contentScroll: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      padding: theme.spacing.xl,
      gap: theme.spacing.xl,
      alignItems: "stretch",
    },
    section: {
      width: "100%",
    },
    uppercase: {
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    previewCard: {
      alignItems: "center",
      gap: theme.spacing.lg,
    },
    wrap: {
      flexWrap: "wrap",
    },
    bareCard: {
      flexGrow: 1,
      minWidth: 140,
      alignItems: "center",
      gap: theme.spacing.md,
    },
    loadingPlaceholder: {
      width: 180,
      height: 180,
      borderRadius: theme.radii.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderStyle: "dashed",
      backgroundColor: theme.colors.backgroundMuted,
    },
    loadingText: {
      marginTop: theme.spacing.sm,
    },
    grid: {
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: theme.spacing.md,
    },
    gridItem: {
      width: "47%",
      alignItems: "center",
      gap: theme.spacing.md,
    },
    gridLabel: {
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },
    footer: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
  }));
}
