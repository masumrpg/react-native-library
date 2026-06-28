import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import TajweedVerse, { TajweedThemes } from "@masumdev/rn-tajweed-verse";
import {
  ChevronLeft,
  Sliders,
  Type,
  BookOpen,
  Palette,
  Eye,
  Info,
  Code,
  Zap,
} from "lucide-react-native";

// Real Quran Tajweed samples from the database
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

export default function TajweedVerseScreen() {
  const router = useRouter();
  const [isColored, setIsColored] = useState(true);
  const [isInteractive, setIsInteractive] = useState(true);
  const [selectedFont, setSelectedFont] = useState<
    | "system"
    | "amiri"
    | "amiri-quran"
    | "noto"
    | "scheherazade"
    | "mirza"
    | "harmattan"
    | "katibeh"
    | "handjet"
    | "reem-fun"
    | "reem-ink"
  >("amiri");
  const [selectedTheme, setSelectedTheme] = useState<
    "classic" | "dark" | "pastel" | "accessible"
  >("classic");
  const [verseText, setVerseText] = useState<string>(quranSamples[0].verse);
  const [customInfoText, setCustomInfoText] = useState<string>(
    "Tap a colored word to see the Tajweed rule explanation here!",
  );
  const [customInfoTitle, setCustomInfoTitle] =
    useState<string>("Interactive Guide");
  const [renderCount, setRenderCount] = useState(0);

  // Merged config depending on selected theme
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

    switch (selectedTheme) {
      case "dark":
        return {
          style: { ...baseStyle, color: "#e2e8f0" },
          tajweed: TajweedThemes.dark,
        };
      case "pastel":
        return {
          style: { ...baseStyle, color: "#1e293b" },
          tajweed: TajweedThemes.pastel,
        };
      case "accessible":
        return {
          style: { ...baseStyle, color: "#000000" },
          tajweed: TajweedThemes.accessible,
        };
      case "classic":
      default:
        return {
          style: { ...baseStyle, color: "black" },
          tajweed: TajweedThemes.classic,
        };
    }
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <ChevronLeft color="#334155" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tajweed Verse Renderer</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.subHeader}>
          Quranic text parsing, coloring, and interactions
        </Text>

        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Sliders color="#6366f1" size={18} style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Configurations</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Color-Coding (colored)</Text>
              <Switch value={isColored} onValueChange={setIsColored} />
            </View>
            <View
              style={[
                styles.row,
                {
                  borderTopWidth: 1,
                  borderTopColor: "#f1f5f9",
                  paddingTop: 12,
                  marginTop: 12,
                },
              ]}
            >
              <Text style={styles.rowLabel}>
                Interactive Guides (interactive)
              </Text>
              <Switch value={isInteractive} onValueChange={setIsInteractive} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Type color="#6366f1" size={18} style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Quranic Arabic Fonts</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollList}
          >
            {(
              [
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
              ] as const
            ).map((font) => (
              <TouchableOpacity
                key={font.key}
                style={[
                  styles.selectorItem,
                  selectedFont === font.key && styles.selectorItemActive,
                ]}
                onPress={() => setSelectedFont(font.key)}
              >
                <Text
                  style={[
                    styles.selectorItemText,
                    selectedFont === font.key && styles.selectorItemTextActive,
                  ]}
                >
                  {font.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <BookOpen color="#6366f1" size={18} style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Quran Database Samples</Text>
          </View>
          <Text style={styles.description}>
            Select an Ayah containing real database tags (e.g. [h:1[ٱ])
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollList}
          >
            {quranSamples.map((sample) => (
              <TouchableOpacity
                key={sample.label}
                style={[
                  styles.selectorItem,
                  verseText === sample.verse && styles.selectorItemActive,
                ]}
                onPress={() => {
                  setVerseText(sample.verse);
                  setCustomInfoTitle("Interactive Guide");
                  setCustomInfoText(
                    "Tap a colored word to see the Tajweed rule explanation here!",
                  );
                }}
              >
                <Text
                  style={[
                    styles.selectorItemText,
                    verseText === sample.verse && styles.selectorItemTextActive,
                  ]}
                >
                  {sample.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Palette color="#6366f1" size={18} style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Theme Presets</Text>
          </View>
          <View style={styles.themeSelector}>
            {(["classic", "dark", "pastel", "accessible"] as const).map(
              (theme) => (
                <TouchableOpacity
                  key={theme}
                  style={[
                    styles.themeButton,
                    selectedTheme === theme && styles.themeButtonActive,
                  ]}
                  onPress={() => setSelectedTheme(theme)}
                >
                  <Text
                    style={[
                      styles.themeButtonText,
                      selectedTheme === theme && styles.themeButtonTextActive,
                    ]}
                  >
                    {theme}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </View>
        </View>

        <View
          style={[
            styles.section,
            selectedTheme === "dark" && styles.sectionDarkBg,
            { borderRadius: 24, padding: 16 },
          ]}
        >
          <View style={styles.sectionTitleContainer}>
            <Eye
              color={selectedTheme === "dark" ? "#e2e8f0" : "#6366f1"}
              size={18}
              style={{ marginRight: 8 }}
            />
            <Text
              style={[
                styles.sectionTitle,
                selectedTheme === "dark" && { color: "#e2e8f0" },
              ]}
            >
              Live Preview
            </Text>
          </View>

          <View
            style={[
              styles.previewCard,
              selectedTheme === "dark" && {
                backgroundColor: "#1e293b",
                borderColor: "#334155",
              },
            ]}
          >
            <TajweedVerse
              verse={verseText}
              colored={isColored}
              interactive={isInteractive}
              config={getThemeConfig()}
              onRulePress={handleCustomRulePress}
            />
          </View>
        </View>

        {isInteractive && isColored && (
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <Info color="#6366f1" size={18} style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>{customInfoTitle}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>{customInfoText}</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Code color="#6366f1" size={18} style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Custom Rule Injection</Text>
          </View>
          <Text style={styles.description}>
            Demonstrates highlights (e.g. bold underline styling for specific
            words)
          </Text>

          <View style={styles.previewCard}>
            <TajweedVerse
              verse="This is a [custom[special word] inside the Arabic script [q[خَلَقَ] with custom rules."
              colored={true}
              interactive={true}
              config={{
                style: { fontSize: 18, color: "#334155", lineHeight: 30 },
              }}
              customRules={[
                {
                  pattern: /\[custom\[([^\]]+)\]/,
                  style: {
                    color: "#6366f1",
                    fontWeight: "bold",
                    textDecorationLine: "underline",
                  },
                  renderText: (text: string) =>
                    text.replace(/\[custom\[/, "").replace(/\]/, ""),
                  onPress: (text: string) =>
                    Alert.alert(
                      "Custom Highlight Rule",
                      `Tapped custom matched text: ${text}`,
                    ),
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Zap color="#6366f1" size={18} style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Performance Memoization</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.perfText}>
              The TajweedVerse component is memoized using React.memo.
              Re-renders on parent state changes (like the counter below) do not
              trigger parser runs.
            </Text>
            <Text style={styles.counterText}>
              Parent Render Count: {renderCount}
            </Text>
            <TouchableOpacity
              style={styles.perfButton}
              activeOpacity={0.7}
              onPress={() => setRenderCount((prev) => prev + 1)}
            >
              <Text style={styles.perfButtonText}>Trigger Re-render</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ by Ma'sum</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  contentScroll: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    padding: 24,
    alignItems: "center",
  },
  subHeader: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 24,
    textAlign: "center",
  },
  section: {
    width: "100%",
    marginBottom: 32,
  },
  sectionDarkBg: {
    backgroundColor: "#0f172a",
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  description: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 14,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
  scrollList: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  selectorItem: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginRight: 10,
  },
  selectorItemActive: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  selectorItemText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },
  selectorItemTextActive: {
    color: "#ffffff",
  },
  themeSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  themeButton: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginHorizontal: 4,
  },
  themeButtonActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  themeButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "capitalize",
  },
  themeButtonTextActive: {
    color: "#ffffff",
  },
  previewCard: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    minHeight: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  infoCard: {
    backgroundColor: "#eff6ff",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  infoText: {
    fontSize: 13,
    color: "#1e40af",
    lineHeight: 22,
  },
  perfText: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 22,
    marginBottom: 16,
  },
  counterText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 14,
  },
  perfButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  perfButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },
  footer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  footerText: {
    color: "#cbd5e1",
    fontSize: 12,
  },
});
