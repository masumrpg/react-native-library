import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { QRCode, QR_CODE_CONFIGS } from "@masumdev/react-native-qr-code-gen";
import { ChevronLeft, RefreshCw } from "lucide-react-native";

export default function QRCodeScreen() {
  const router = useRouter();
  const [demoLoading, setDemoLoading] = useState(true);

  const refreshLoading = () => {
    setDemoLoading(true);
    setTimeout(() => setDemoLoading(false), 2000);
  };

  useEffect(() => {
    refreshLoading();
  }, []);

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
        <Text style={styles.headerTitle}>QR Code Generator</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.subHeader}>
          Modern & Custom QR Components with Presets
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Variants</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Basic Variant</Text>
            <QRCode value="https://google.com" size={180} variant="BASIC" />
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Heart Variant</Text>
            <QRCode value="Love QR" size={180} variant="HEART" />
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Linear Gradient</Text>
            <QRCode value="Gradients" size={180} variant="LINEAR_GRADIENT" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bare Variants (No Card)</Text>

          <View style={styles.bareContainer}>
            <Text style={styles.label}>Triangle (Bare)</Text>
            <QRCode value="Triangle" size={150} variant="TRIANGLE" />
          </View>

          <View style={styles.bareContainer}>
            <Text style={styles.label}>Dot (Bare)</Text>
            <QRCode value="Dots" size={150} variant="DOT" />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Loading & Fallbacks</Text>
            <TouchableOpacity
              style={[
                styles.refreshButton,
                demoLoading && styles.refreshButtonDisabled,
              ]}
              activeOpacity={0.7}
              onPress={refreshLoading}
              disabled={demoLoading}
            >
              <RefreshCw color="white" size={14} style={{ marginRight: 6 }} />
              <Text style={styles.refreshButtonText}>
                {demoLoading ? "Loading..." : "Simulate"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Default Loading</Text>
            <QRCode value="loading" size={180} isLoading={demoLoading} />
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Custom Loading Renderer</Text>
            <QRCode
              value="loading-custom"
              size={180}
              isLoading={demoLoading}
              renderLoading={() => (
                <View
                  style={[
                    styles.loadingPlaceholder,
                    { width: 180, height: 180 },
                  ]}
                >
                  <ActivityIndicator size="large" color="#6366f1" />
                  <Text
                    style={{ marginTop: 10, fontSize: 12, color: "#64748b" }}
                  >
                    Generating...
                  </Text>
                </View>
              )}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Library Presets Gallery</Text>
          <Text style={styles.description}>
            Automatically rendered from QR_CODE_CONFIGS config presets
          </Text>

          <View style={styles.grid}>
            {Object.keys(QR_CODE_CONFIGS).map((variantKey) => (
              <View key={variantKey} style={styles.gridItem}>
                <QRCode
                  value={variantKey}
                  size={110}
                  variant={variantKey as keyof typeof QR_CODE_CONFIGS}
                />
                <Text style={styles.gridLabel}>
                  {variantKey.replace(/_/g, " ")}
                </Text>
              </View>
            ))}
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  description: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  refreshButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  refreshButtonDisabled: {
    opacity: 0.6,
  },
  refreshButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  bareContainer: {
    alignItems: "center",
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "48%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  gridLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#64748b",
    marginTop: 10,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  label: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94a3b8",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  loadingPlaceholder: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderStyle: "dashed",
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
