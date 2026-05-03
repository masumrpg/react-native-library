import { StyleSheet, Text, View } from "react-native";
import {} from "@masum/react-native-qr-code-gen";

export default function Native() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{reactNativeQrCodeGen.greet("Hay")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontWeight: "bold",
    marginBottom: 20,
    fontSize: 36,
  },
});
