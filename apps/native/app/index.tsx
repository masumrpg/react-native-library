import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { QrCode, BookOpen, ChevronRight } from "lucide-react-native";

export default function Native() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.welcomeText}>MasumDev Mobile</Text>
          <Text style={styles.titleText}>Component Libraries</Text>
          <Text style={styles.subtitleText}>
            Interact with our premium custom React Native & Expo packages.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore Showcase Screens</Text>

          <TouchableOpacity
            style={styles.menuCard}
            activeOpacity={0.7}
            onPress={() => router.push("/qr-code")}
          >
            <View style={styles.cardHeader}>
              <View
                style={[styles.iconContainer, { backgroundColor: "#e0e7ff" }]}
              >
                <QrCode color="#4f46e5" size={24} />
              </View>
              <View style={styles.cardHeaderTexts}>
                <View style={styles.badgeContainer}>
                  <Text style={[styles.badgeText, { color: "#4f46e5" }]}>
                    QR-CODE-GEN
                  </Text>
                </View>
                <Text style={styles.cardTitle}>QR Code Generator</Text>
              </View>
            </View>
            <Text style={styles.cardDesc}>
              A modern, customizable QR code generator supporting custom shapes
              (HEART, TRIANGLE, DOT), linear gradients, and logo integration.
            </Text>
            <View style={styles.cardFooter}>
              <Text style={styles.arrowText}>Explore Screen</Text>
              <ChevronRight color="#4f46e5" size={18} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            activeOpacity={0.7}
            onPress={() => router.push("/tajweed-verse")}
          >
            <View style={styles.cardHeader}>
              <View
                style={[styles.iconContainer, { backgroundColor: "#ecfdf5" }]}
              >
                <BookOpen color="#059669" size={24} />
              </View>
              <View style={styles.cardHeaderTexts}>
                <View style={styles.badgeContainer}>
                  <Text style={[styles.badgeText, { color: "#059669" }]}>
                    RN-TAJWEED-VERSE
                  </Text>
                </View>
                <Text style={styles.cardTitle}>Tajweed Verse Renderer</Text>
              </View>
            </View>
            <Text style={styles.cardDesc}>
              Parse Quranic script with Tajweed markup. Features interactive
              rule tooltips, multiple color themes, custom rules, and plain
              reading mode.
            </Text>
            <View style={styles.cardFooter}>
              <Text style={[styles.arrowText, { color: "#059669" }]}>
                Explore Screen
              </Text>
              <ChevronRight color="#059669" size={18} />
            </View>
          </TouchableOpacity>
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
  container: {
    padding: 24,
  },
  headerContainer: {
    width: "100%",
    alignItems: "flex-start",
    marginTop: 20,
    marginBottom: 36,
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6366f1",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  titleText: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0f172a",
    lineHeight: 38,
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 15,
    color: "#64748b",
    lineHeight: 22,
  },
  section: {
    width: "100%",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  menuCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  cardHeaderTexts: {
    flex: 1,
    justifyContent: "center",
  },
  badgeContainer: {
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  cardDesc: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 22,
    marginBottom: 20,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  arrowText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4f46e5",
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
