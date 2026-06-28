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
      "ذَ[n[َٰ]لِكَ [h:11[ٱ]لْكِتَٰبُ لَا رَيْبَۛ فِيهِۛ هُ[u:12[دًى ل]ِّ لْمُتَّقِ[p[ِي]نَ",
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
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tajweed Verse Renderer</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.subHeader}>
          Quranic text parsing, coloring, and interactions
        </Text>

        {/* --- Interactive & Plain Mode Toggles --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Render Configurations</Text>
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
                  paddingTop: 10,
                  marginTop: 10,
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

        {/* --- Arabic Font Selector --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quranic Arabic Fonts</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sampleSelector}
          >
            {(
              [
                { key: "system", label: "System Default" },
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
                  styles.sampleButton,
                  selectedFont === font.key && styles.sampleButtonActive,
                ]}
                onPress={() => setSelectedFont(font.key)}
              >
                <Text
                  style={[
                    styles.sampleButtonText,
                    selectedFont === font.key && styles.sampleButtonTextActive,
                  ]}
                >
                  {font.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* --- Quran Database Samples --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quran Database Samples</Text>
          <Text style={styles.description}>
            Select an Ayah containing real database tags (e.g. [h:1[ٱ])
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sampleSelector}
          >
            {quranSamples.map((sample) => (
              <TouchableOpacity
                key={sample.label}
                style={[
                  styles.sampleButton,
                  verseText === sample.verse && styles.sampleButtonActive,
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
                    styles.sampleButtonText,
                    verseText === sample.verse && styles.sampleButtonTextActive,
                  ]}
                >
                  {sample.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* --- Theme Presets Selection --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Theme Presets</Text>
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

        {/* --- Live Preview Screen --- */}
        <View
          style={[
            styles.section,
            selectedTheme === "dark" && styles.sectionDarkBg,
            { borderRadius: 24, padding: 15 },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              selectedTheme === "dark" && { color: "#e2e8f0" },
            ]}
          >
            Live Preview
          </Text>

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

        {/* --- Interactive Rule Info Display --- */}
        {isInteractive && isColored && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{customInfoTitle}</Text>
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>{customInfoText}</Text>
            </View>
          </View>
        )}

        {/* --- Custom Parser Rules --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Custom Rule Pattern Injection</Text>
          <Text style={styles.description}>
            Demonstrates custom rules (e.g. bold underline styling for specific
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

        {/* --- Memoization Test --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Memoization Performance Check</Text>
          <View style={styles.card}>
            <Text style={styles.perfText}>
              The TajweedVerse component is memoized using React.memo. When
              other parts of the parent component update (like the counter
              below), the verse is NOT re-parsed.
            </Text>
            <Text style={styles.counterText}>
              Parent Render Check: {renderCount}
            </Text>
            <TouchableOpacity
              style={styles.perfButton}
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
    backgroundColor: "#f8fafc",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  container: {
    padding: 20,
    alignItems: "center",
  },
  subHeader: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    width: "100%",
    marginBottom: 24,
  },
  sectionDarkBg: {
    backgroundColor: "#0f172a",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 10,
    paddingLeft: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#6366f1",
  },
  description: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 12,
    paddingLeft: 14,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
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
  sampleSelector: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  sampleButton: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginRight: 8,
  },
  sampleButtonActive: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  sampleButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },
  sampleButtonTextActive: {
    color: "#ffffff",
  },
  selectorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  themeSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  themeButton: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginHorizontal: 3,
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
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    minHeight: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  infoCard: {
    backgroundColor: "#eff6ff",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  infoText: {
    fontSize: 13,
    color: "#1e40af",
    lineHeight: 20,
  },
  perfText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
    marginBottom: 15,
  },
  counterText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 12,
  },
  perfButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  perfButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },
  footer: {
    marginTop: 20,
    marginBottom: 40,
  },
  footerText: {
    color: "#cbd5e1",
    fontSize: 12,
  },
});
