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

export default function Native() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* --- Header Section --- */}
        <View style={styles.headerContainer}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.titleText}>MasumDev Mobile Libraries</Text>
          <Text style={styles.subtitleText}>
            Interact with our custom React Native components
          </Text>
        </View>

        {/* --- Features Navigation List --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select a Feature Screen</Text>

          {/* Feature 1: QR Code Generator */}
          <TouchableOpacity
            style={styles.menuCard}
            activeOpacity={0.8}
            onPress={() => router.push("/qr-code")}
          >
            <View style={styles.badgeContainer}>
              <View style={[styles.badgeDot, { backgroundColor: "#6366f1" }]} />
              <Text style={styles.badgeText}>QR-CODE-GEN</Text>
            </View>
            <Text style={styles.cardTitle}>QR Code Generator</Text>
            <Text style={styles.cardDesc}>
              A modern, customizable QR code generator supporting shapes (HEART,
              TRIANGLE, DOT) and linear gradients.
            </Text>
            <View style={styles.cardFooter}>
              <Text style={styles.arrowText}>Explore Screen →</Text>
            </View>
          </TouchableOpacity>

          {/* Feature 2: Tajweed Verse Renderer */}
          <TouchableOpacity
            style={styles.menuCard}
            activeOpacity={0.8}
            onPress={() => router.push("/tajweed-verse")}
          >
            <View style={styles.badgeContainer}>
              <View style={[styles.badgeDot, { backgroundColor: "#10b981" }]} />
              <Text style={styles.badgeText}>RN-TAJWEED-VERSE</Text>
            </View>
            <Text style={styles.cardTitle}>Tajweed Verse Renderer</Text>
            <Text style={styles.cardDesc}>
              Parse Quranic script with Tajweed markup. Displays interactive
              tooltips, multiple themes, custom rules, and plain mode.
            </Text>
            <View style={styles.cardFooter}>
              <Text style={styles.arrowText}>Explore Screen →</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* --- Monorepo Footer --- */}
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
    alignItems: "center",
  },
  headerContainer: {
    width: "100%",
    alignItems: "flex-start",
    marginTop: 30,
    marginBottom: 40,
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
    fontSize: 28,
    fontWeight: "800",
    color: "#0f172a",
    lineHeight: 36,
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 15,
    color: "#64748b",
    lineHeight: 22,
  },
  section: {
    width: "100%",
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 16,
    paddingLeft: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#6366f1",
  },
  menuCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#64748b",
    letterSpacing: 1.1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: "#f8fafc",
    paddingTop: 12,
    alignItems: "flex-start",
  },
  arrowText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6366f1",
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
