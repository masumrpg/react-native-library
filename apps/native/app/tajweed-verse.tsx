import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import TajweedVerse, { TajweedThemes } from "@masumdev/rn-tajweed-verse";
import {
  BookOpen,
  ChevronLeft,
  Code,
  Eye,
  Info,
  Palette,
  Sliders,
  Type,
  Zap,
} from "lucide-react-native";
import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  Switch,
  Text,
  useTheme,
  useThemeStyles,
  useToast,
  type RenderIcon,
} from "@masumdev/rn-ui";
import { SystemUIOverlay } from "../components/system-ui-overlay";

const icon =
  (Icon: React.ComponentType<{ color?: string; size?: number }>): RenderIcon =>
  ({ color, size }) => <Icon color={color} size={size} />;

const quranSamples = [
  {
    id: 1,
    label: "Al-Fatihah 1",
    verse:
      "بِسْمِ [h:1[ٱ]للَّهِ [h:2[ٱ][l[ل]رَّحْمَ[n[ـٰ]نِ [h:3[ٱ][l[ل]رَّح[p[ِي]مِ",
  },
  {
    id: 2,
    label: "Al-Fatihah 2",
    verse: "ٱلْحَمْدُ لِلَّهِ رَبِّ [h:4[ٱ]لْعَ[n[ـٰ]لَم[p[ِي]نَ",
  },
  {
    id: 3,
    label: "Al-Fatihah 3",
    verse: "ٱ[l[ل]رَّحْمَ[n[ـٰ]نِ [h:3[ٱ][l[ل]رَّح[p[ِي]مِ",
  },
  {
    id: 4,
    label: "Al-Fatihah 4",
    verse: "مَ[n[ـٰ]لِكِ يَوۡمِ [h:5[ٱ][l[ل]دَّ[p[ِي]نِ",
  },
  {
    id: 7,
    label: "Al-Fatihah 7",
    verse:
      "صِرَ[n[َٰ]طَ [h:8[ٱ]لَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ [h:9[ٱ]لْمَغْضُوبِ عَلَيْهِمْ وَلَا [h:10[ٱ][l[ل]ضَّ[m[َا]ٓلّ[p[ِي]نَ",
  },
  {
    id: 8,
    label: "Al-Baqarah 1",
    verse: "ا[m[لٓ][m[مٓ]",
  },
  {
    id: 9,
    label: "Al-Baqarah 2",
    verse:
      "ذَ[n[َٰ]لِكَ [h:11[ٱ]لْكِتَٰبُ لَا رَيْبَۛ فِيهِۛ هُ[u:12[دًى ل]ِّ لْمُtَّقِ[p[ِي]نَ",
  },
];

const fonts = [
  { key: "system", label: "System" },
  { key: "amiri", label: "Amiri" },
  { key: "amiri-quran", label: "Amiri Quran" },
  { key: "noto", label: "Noto Naskh" },
  { key: "scheherazade", label: "Scheherazade" },
  { key: "mirza", label: "Mirza" },
  { key: "harmattan", label: "Harmattan" },
  { key: "katibeh", label: "Katibeh" },
  { key: "handjet", label: "Handjet" },
  { key: "reem-fun", label: "Reem Kufi Fun" },
  { key: "reem-ink", label: "Reem Kufi Ink" },
] as const;

type FontKey = (typeof fonts)[number]["key"];
type TajweedThemeKey = "classic" | "dark" | "pastel" | "accessible";

const tajweedThemeOptions: TajweedThemeKey[] = [
  "classic",
  "dark",
  "pastel",
  "accessible",
];

export default function TajweedVerseScreen() {
  const router = useRouter();
  const toast = useToast();
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const [isColored, setIsColored] = useState(true);
  const [isInteractive, setIsInteractive] = useState(true);
  const [selectedFont, setSelectedFont] = useState<FontKey>("amiri");
  const [selectedTheme, setSelectedTheme] =
    useState<TajweedThemeKey>("classic");
  const [verseText, setVerseText] = useState(quranSamples[0].verse);
  const [customInfoText, setCustomInfoText] = useState(
    "Tap a colored word to see the Tajweed rule explanation here!",
  );
  const [customInfoTitle, setCustomInfoTitle] = useState("Interactive Guide");
  const [renderCount, setRenderCount] = useState(0);

  const getThemeConfig = () => {
    let fontFamily: string | undefined;
    let lineHeight = 54;

    if (selectedFont === "amiri") {
      fontFamily = "Amiri-Regular";
      lineHeight = 62;
    } else if (selectedFont === "amiri-quran") {
      fontFamily = "AmiriQuran-Regular";
      lineHeight = 62;
    } else if (selectedFont === "noto") {
      fontFamily = "NotoNaskhArabic-Regular";
      lineHeight = 60;
    } else if (selectedFont === "scheherazade") {
      fontFamily = "ScheherazadeNew-Regular";
      lineHeight = 64;
    } else if (selectedFont === "mirza") {
      fontFamily = "Mirza-Regular";
      lineHeight = 58;
    } else if (selectedFont === "harmattan") {
      fontFamily = "Harmattan-Regular";
      lineHeight = 56;
    } else if (selectedFont === "katibeh") {
      fontFamily = "Katibeh-Regular";
      lineHeight = 58;
    } else if (selectedFont === "handjet") {
      fontFamily = "Handjet-Regular";
      lineHeight = 66;
    } else if (selectedFont === "reem-fun") {
      fontFamily = "ReemKufiFun-Regular";
      lineHeight = 58;
    } else if (selectedFont === "reem-ink") {
      fontFamily = "ReemKufiInk-Regular";
      lineHeight = 58;
    }

    const baseStyle = {
      fontSize: 28,
      lineHeight,
      direction: "rtl" as const,
      ...(fontFamily ? { fontFamily } : {}),
    };

    if (selectedTheme === "dark") {
      return {
        style: { ...baseStyle, color: "#E2E8F0" },
        tajweed: TajweedThemes.dark,
      };
    }

    if (selectedTheme === "pastel") {
      return {
        style: { ...baseStyle, color: "#1E293B" },
        tajweed: TajweedThemes.pastel,
      };
    }

    if (selectedTheme === "accessible") {
      return {
        style: { ...baseStyle, color: "#000000" },
        tajweed: TajweedThemes.accessible,
      };
    }

    return {
      style: { ...baseStyle, color: "#000000" },
      tajweed: TajweedThemes.classic,
    };
  };

  const handleCustomRulePress = (
    ruleName: string,
    description: string,
    matchedText: string,
  ) => {
    setCustomInfoTitle(ruleName);
    setCustomInfoText(`Matched: "${matchedText}"\n\n${description}`);
  };

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
              @masumdev/rn-tajweed-verse
            </Text>
            <Text variant="h2">Tajweed Verse Renderer</Text>
          </Box>
        </Box>

        <Text color="textMuted">
          Quranic text parsing, coloring, and interactive rule previews.
        </Text>

        <Section title="Configurations" icon={icon(Sliders)}>
          <Card>
            <SettingRow
              label="Color-Coding"
              value={isColored}
              onValueChange={setIsColored}
            />
            <Divider style={styles.settingDivider} />
            <SettingRow
              label="Interactive Guides"
              value={isInteractive}
              onValueChange={setIsInteractive}
            />
          </Card>
        </Section>

        <Section title="Quranic Arabic Fonts" icon={icon(Type)}>
          <HorizontalSelector
            items={fonts}
            selected={selectedFont}
            onSelect={setSelectedFont}
          />
        </Section>

        <Section title="Quran Database Samples" icon={icon(BookOpen)}>
          <Text variant="bodySmall" color="textMuted">
            Select an Ayah containing real database tags such as `[h:1[ٱ]`.
          </Text>
          <HorizontalSelector
            items={quranSamples.map((sample) => ({
              key: sample.verse,
              label: sample.label,
            }))}
            selected={verseText}
            onSelect={(next) => {
              setVerseText(next);
              setCustomInfoTitle("Interactive Guide");
              setCustomInfoText(
                "Tap a colored word to see the Tajweed rule explanation here!",
              );
            }}
          />
        </Section>

        <Section title="Theme Presets" icon={icon(Palette)}>
          <Box row gap="sm" style={styles.wrap}>
            {tajweedThemeOptions.map((theme) => (
              <Button
                key={theme}
                size="sm"
                variant={selectedTheme === theme ? "filled" : "outline"}
                tone={theme === "dark" ? "secondary" : "primary"}
                onPress={() => setSelectedTheme(theme)}
              >
                {theme}
              </Button>
            ))}
          </Box>
        </Section>

        <Section title="Live Preview" icon={icon(Eye)}>
          <Card
            style={[
              styles.previewCard,
              selectedTheme === "dark" && styles.previewCardDark,
            ]}
          >
            <TajweedVerse
              verse={verseText}
              colored={isColored}
              interactive={isInteractive}
              config={getThemeConfig()}
              onRulePress={handleCustomRulePress}
            />
          </Card>
        </Section>

        {isInteractive && isColored && (
          <Section title={customInfoTitle} icon={icon(Info)}>
            <Card style={styles.infoCard}>
              <Text variant="bodySmall" color="info">
                {customInfoText}
              </Text>
            </Card>
          </Section>
        )}

        <Section title="Custom Rule Injection" icon={icon(Code)}>
          <Text variant="bodySmall" color="textMuted">
            Demonstrates custom highlights for specific words.
          </Text>
          <Card style={styles.previewCard}>
            <TajweedVerse
              verse="This is a [custom[special word] inside the Arabic script [q[خَلَقَ] with custom rules."
              colored
              interactive
              config={{
                style: {
                  fontSize: 18,
                  color: colors.text,
                  lineHeight: 30,
                },
              }}
              customRules={[
                {
                  pattern: /\[custom\[([^\]]+)\]/,
                  style: {
                    color: colors.primary,
                    fontWeight: "bold",
                    textDecorationLine: "underline",
                  },
                  renderText: (text: string) =>
                    text.replace(/\[custom\[/, "").replace(/\]/, ""),
                  onPress: (text: string) =>
                    toast.show({
                      title: "Custom Highlight Rule",
                      description: `Tapped custom matched text: ${text}`,
                      tone: "info",
                      icon: icon(Info),
                    }),
                },
              ]}
            />
          </Card>
        </Section>

        <Section title="Performance Memoization" icon={icon(Zap)}>
          <Card>
            <Box gap="md">
              <Text variant="bodySmall" color="textMuted">
                The TajweedVerse component is memoized using React.memo.
                Re-renders on parent state changes do not trigger parser runs.
              </Text>
              <Badge tone="secondary" variant="outline">
                {`Parent Render Count: ${renderCount}`}
              </Badge>
              <Button onPress={() => setRenderCount((prev) => prev + 1)}>
                Trigger Re-render
              </Button>
            </Box>
          </Card>
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
  icon: sectionIcon,
  children,
}: {
  title: string;
  icon: RenderIcon;
  children: React.ComponentProps<typeof Box>["children"];
}) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <Box gap="md" style={styles.section}>
      <Box row center gap="sm">
        {typeof sectionIcon === "function"
          ? sectionIcon({ color: colors.primary, size: 18 })
          : sectionIcon}
        <Text variant="labelSmall" color="textSubtle" style={styles.uppercase}>
          {title}
        </Text>
      </Box>
      {children}
    </Box>
  );
}

function SettingRow({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <Box row center gap="md">
      <Text variant="bodySmall" color="textMuted" style={{ flex: 1 }}>
        {label}
      </Text>
      <Switch value={value} onValueChange={onValueChange} />
    </Box>
  );
}

function HorizontalSelector<T extends string>({
  items,
  selected,
  onSelect,
}: {
  items: readonly { key: T; label: string }[];
  selected: T;
  onSelect: (value: T) => void;
}) {
  const styles = useStyles();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollList}
    >
      {items.map((item) => (
        <Button
          key={item.key}
          size="sm"
          variant={selected === item.key ? "filled" : "outline"}
          tone="success"
          style={styles.selectorButton}
          onPress={() => onSelect(item.key)}
        >
          {item.label}
        </Button>
      ))}
    </ScrollView>
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
    },
    section: {
      width: "100%",
    },
    uppercase: {
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    settingDivider: {
      marginVertical: theme.spacing.md,
    },
    scrollList: {
      paddingVertical: theme.spacing.xs,
      gap: theme.spacing.sm,
    },
    selectorButton: {
      marginRight: theme.spacing.sm,
    },
    wrap: {
      flexWrap: "wrap",
    },
    previewCard: {
      minHeight: 180,
      justifyContent: "center",
      alignItems: "center",
    },
    previewCardDark: {
      backgroundColor: "#0F172A",
      borderColor: "#334155",
    },
    infoCard: {
      backgroundColor: theme.colors.infoSoft,
      borderColor: theme.colors.info,
    },
    footer: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
  }));
}
