import React, { useEffect, useRef, useState } from "react";
import { Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RefreshCw, Share2, Sparkles } from "lucide-react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";
import type Svg from "react-native-svg";
import { QRCode, QR_CODE_CONFIGS } from "@masumdev/rn-qr-code";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Progress,
  Skeleton,
  Text,
  useTheme,
  useThemeStyles,
  useToast,
  type RenderIcon,
} from "@masumdev/rn-ui";
import { SystemUIOverlay } from "../components/system-ui-overlay";
import { ScreenHeader } from "../components/ScreenHeader";
import { useHeaderScroll } from "../components/useHeaderScroll";

const icon =
  (Icon: React.ComponentType<{ color?: string; size?: number }>): RenderIcon =>
  ({ color, size }) => <Icon color={color} size={size} />;

const DOCS_URL = "https://react-native-library-docs.netlify.app/";

async function shareQRCodeFile(
  base64Data: string,
  filename: string,
  dialogTitle: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const cleanBase64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, "");

    if (Platform.OS === "web") {
      if (typeof document !== "undefined") {
        const link = document.createElement("a");
        link.href = `data:image/png;base64,${cleanBase64}`;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return {
          success: true,
          message: `Saved ${filename} to browser downloads.`,
        };
      }
    }

    const fileUri = `${FileSystem.cacheDirectory || FileSystem.documentDirectory || ""}${filename}`;
    await FileSystem.writeAsStringAsync(fileUri, cleanBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: "image/png",
        dialogTitle,
        UTI: "public.png",
      });
      return {
        success: true,
        message: "Share dialog opened successfully.",
      };
    }

    return {
      success: true,
      message: `File ready at ${fileUri}`,
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Unknown sharing error",
    };
  }
}

const featuredVariants = [
  {
    label: "Basic Variant",
    value: DOCS_URL,
    variant: "BASIC",
  },
  {
    label: "Heart Variant",
    value: DOCS_URL,
    variant: "HEART",
  },
  {
    label: "Linear Gradient",
    value: DOCS_URL,
    variant: "LINEAR_GRADIENT",
  },
] as const;

const bareVariants = [
  {
    label: "Triangle",
    value: DOCS_URL,
    variant: "TRIANGLE",
  },
  {
    label: "Dot",
    value: DOCS_URL,
    variant: "DOT",
  },
] as const;

export default function QRCodeScreen() {
  const toast = useToast();
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const [demoLoading, setDemoLoading] = useState(true);

  const bareExportRef = useRef<Svg>(null);
  const brandedCardRef = useRef<View>(null);

  const { onScroll, headerStyle, scrollEventThrottle } = useHeaderScroll({
    headerHeight: 220,
  });

  const refreshLoading = () => {
    setDemoLoading(true);
    setTimeout(() => setDemoLoading(false), 2000);
  };

  useEffect(() => {
    refreshLoading();
  }, []);

  const handleShareBare = () => {
    if (!bareExportRef.current) {
      toast.show({
        title: "Share Error",
        description: "QR Code component ref is not ready yet.",
        tone: "warning",
      });
      return;
    }

    bareExportRef.current.toDataURL(async (data) => {
      if (!data) {
        toast.show({
          title: "Share Error",
          description: "Failed to generate Base64 data from SVG.",
          tone: "danger",
        });
        return;
      }

      const filename = `qrcode-transparent-${Date.now()}.png`;
      const result = await shareQRCodeFile(
        data,
        filename,
        "Share Transparent QR Code",
      );

      if (result.success) {
        toast.show({
          title: "Sharing Pure QR! 📤",
          description: "Native share dialog opened for transparent QR PNG.",
          tone: "success",
          icon: icon(Share2),
        });
      } else {
        toast.show({
          title: "Share Failed",
          description: result.message,
          tone: "danger",
        });
      }
    });
  };

  const handleShareBranded = async () => {
    if (!brandedCardRef.current) {
      toast.show({
        title: "Share Error",
        description: "Branded Card view ref is not ready yet.",
        tone: "warning",
      });
      return;
    }

    try {
      const uri = await captureRef(brandedCardRef, {
        format: "png",
        quality: 1.0,
        result: "tmpfile",
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "image/png",
          dialogTitle: "Share Branded Masum Dev Card",
          UTI: "public.png",
        });

        toast.show({
          title: "Sharing Branded Card! 🚀",
          description: "Full card design & background captured successfully.",
          tone: "success",
          icon: icon(Sparkles),
        });
      } else {
        toast.show({
          title: "Sharing Unsupported",
          description: `Card image generated at: ${uri}`,
          tone: "info",
        });
      }
    } catch (err) {
      toast.show({
        title: "Capture Error",
        description:
          err instanceof Error ? err.message : "Failed to capture card view.",
        tone: "danger",
      });
    }
  };

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <SystemUIOverlay />

      <ScreenHeader
        showBack
        eyebrow="@masumdev/rn-qr-code"
        title="QR Code Generator"
        subtitle="Modern custom QR components with presets, states, and gallery preview."
        headerStyle={headerStyle}
      />

      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
        style={styles.contentScroll}
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: spacing.md,
            paddingBottom: insets.bottom + spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Section title="Export & Share Demos">
          {/* Option 1: Super Cool Branded Custom Card (With Custom BG) */}
          <View ref={brandedCardRef} collapsable={false} style={styles.brandedCardWrapper}>
            <Card style={styles.brandedCard}>
              <Box row style={styles.spaceBetween}>
                <Box row gap="md" style={styles.alignCenter}>
                  <Avatar size="sm" tone="primary">
                    <Text variant="labelSmall" color="textInverse">MD</Text>
                  </Avatar>
                  <Box>
                    <Text variant="label" style={styles.brandedTitle}>
                      Masum Dev Ecosystem
                    </Text>
                    <Text variant="caption" color="textMuted">
                      Official Mobile & Web Docs
                    </Text>
                  </Box>
                </Box>
                <Badge tone="success" variant="subtle" size="sm">
                  Verified
                </Badge>
              </Box>

              <Divider style={styles.brandedDivider} />

              <Box center style={styles.brandedQrContainer}>
                <QRCode
                  value={DOCS_URL}
                  size={170}
                  variant="LINEAR_GRADIENT"
                />
              </Box>

              <Box center gap="xs" style={styles.brandedFooter}>
                <Text variant="labelSmall" color="textMuted" align="center">
                  Scan to explore live documentation & components
                </Text>
                <Badge tone="primary" variant="outline" size="sm">
                  react-native-library-docs.netlify.app
                </Badge>
              </Box>
            </Card>
          </View>

          <Button
            leftIcon={icon(Sparkles)}
            tone="primary"
            variant="filled"
            onPress={handleShareBranded}
            style={styles.exportBtn}
          >
            Share Branded Card (With Full BG)
          </Button>

          {/* Option 2: Bare Transparent QR (Without Background) */}
          <Card style={styles.bareExportCard}>
            <Box row style={styles.spaceBetween}>
              <Box>
                <Text variant="label">Bare Transparent Export</Text>
                <Text variant="caption" color="textMuted">
                  Pure vector SVG with zero background padding
                </Text>
              </Box>
              <Badge tone="info" variant="subtle" size="sm">
                No Background
              </Badge>
            </Box>

            <Box center style={styles.bareQrContainer}>
              <QRCode
                ref={bareExportRef}
                value={DOCS_URL}
                size={140}
                variant="HEART"
                backgroundColor="transparent"
              />
            </Box>

            <Button
              leftIcon={icon(Share2)}
              tone="primary"
              variant="soft"
              onPress={handleShareBare}
              style={styles.exportBtn}
            >
              Share Pure QR (Without BG)
            </Button>
          </Card>
        </Section>

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
              {demoLoading ? "Loading..." : "Simulate Async"}
            </Button>
          }
        >
          <PreviewCard label="Skeleton Shimmer Fallback">
            <QRCode
              value={DOCS_URL}
              size={180}
              isLoading={demoLoading}
              renderLoading={() => (
                <Skeleton
                  style={{ width: 180, height: 180 }}
                  radius="lg"
                />
              )}
            />
          </PreviewCard>

          <PreviewCard label="Progress & Shimmer Fallback">
            <QRCode
              value={DOCS_URL}
              size={180}
              isLoading={demoLoading}
              renderLoading={() => (
                <Box center gap="sm" style={styles.loadingPlaceholder}>
                  <Skeleton style={{ width: 120, height: 120 }} radius="md" />
                  <Box style={{ width: 160, marginTop: 8 }}>
                    <Progress indeterminate tone="primary" size="sm" />
                  </Box>
                  <Text
                    variant="caption"
                    color="textMuted"
                    style={styles.loadingText}
                  >
                    Fetching dynamic QR payload...
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
                  value={DOCS_URL}
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
    contentScroll: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      paddingHorizontal: theme.spacing.xl,
      paddingBottom: theme.spacing.xl,
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
    brandedCardWrapper: {
      width: "100%",
    },
    brandedCard: {
      padding: theme.spacing.lg,
      borderRadius: theme.radii.xl,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      gap: theme.spacing.md,
    },
    spaceBetween: {
      width: "100%",
      justifyContent: "space-between",
      alignItems: "center",
    },
    alignCenter: {
      alignItems: "center",
    },
    brandedTitle: {
      fontWeight: "700",
    },
    brandedDivider: {
      marginVertical: theme.spacing.xs,
    },
    brandedQrContainer: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.backgroundMuted,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      borderColor: theme.colors.borderMuted,
    },
    brandedFooter: {
      marginVertical: theme.spacing.xs,
    },
    bareExportCard: {
      padding: theme.spacing.lg,
      borderRadius: theme.radii.xl,
      gap: theme.spacing.md,
    },
    bareQrContainer: {
      padding: theme.spacing.lg,
      borderRadius: theme.radii.lg,
      backgroundColor: theme.colors.backgroundMuted,
    },
    exportBtn: {
      width: "100%",
      marginTop: theme.spacing.xs,
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
