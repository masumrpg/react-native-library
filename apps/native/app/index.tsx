import React from 'react'
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from "react-native";
import { QRCode, QR_CODE_CONFIGS } from "@masumdev/react-native-qr-code-gen";

export default function Native() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>QR Code Samples</Text>
        <Text style={styles.subHeader}>Modern & Custom QR Components</Text>

        {/* --- Variant With Cards (No Shadow) --- */}
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

        {/* --- Variant Without Cards (Bare) --- */}
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

        {/* --- Preset Gallery Section --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Library Presets Gallery</Text>
          <Text style={styles.description}>Automatically rendered from QR_CODE_CONFIGS</Text>

          <View style={styles.grid}>
            {Object.keys(QR_CODE_CONFIGS).map((variantKey) => (
              <View key={variantKey} style={styles.gridItem}>
                <QRCode
                  value={variantKey}
                  size={120}
                  variant={variantKey as keyof typeof QR_CODE_CONFIGS}
                />
                <Text style={styles.gridLabel}>{variantKey}</Text>
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
    backgroundColor: "#f8fafc",
  },
  container: {
    padding: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1e293b",
    marginTop: 20,
  },
  subHeader: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 30,
  },
  section: {
    width: "100%",
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 5,
    paddingLeft: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#6366f1",
  },
  description: {
    fontSize: 13,
    color: "#94a3b8",
    marginBottom: 20,
    paddingLeft: 14,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 25,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  bareContainer: {
    alignItems: "center",
    marginBottom: 30,
    padding: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  gridItem: {
    width: '48%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  gridLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 10,
    textTransform: 'uppercase',
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94a3b8",
    marginBottom: 15,
    textTransform: "uppercase",
    letterSpacing: 1.2,
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
