import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { QRCode, QR_CODE_CONFIGS } from "@masumdev/react-native-qr-code-gen";

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
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QR Code Generator</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.subHeader}>Modern & Custom QR Components with Presets</Text>

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

        {/* --- Loading States --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Loading & Fallbacks</Text>
            <TouchableOpacity 
              style={styles.refreshButton} 
              onPress={refreshLoading}
              disabled={demoLoading}
            >
              <Text style={styles.refreshButtonText}>
                {demoLoading ? 'Loading...' : 'Simulate'}
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
                <View style={[styles.loadingPlaceholder, { width: 180, height: 180 }]}>
                  <ActivityIndicator size="large" color="#6366f1" />
                  <Text style={{ marginTop: 10, fontSize: 12, color: '#666' }}>Generating...</Text>
                </View>
              )}
            />
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
                  size={110}
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
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  container: {
    padding: 20,
    alignItems: "center",
  },
  subHeader: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    width: "100%",
    marginBottom: 30,
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
    marginBottom: 15,
    paddingLeft: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  refreshButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  bareContainer: {
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  gridLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 8,
    textTransform: 'uppercase',
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94a3b8",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  loadingPlaceholder: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
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
