import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  children: React.ReactNode;
  width: number;
  backgroundColor: string;
};

const QRBgStyle = ({
  children,
  width,
  backgroundColor,
}: Props): React.JSX.Element => {
  return (
    <View
      style={[
        styles.card,
        { width: width + 50, height: width + 50, backgroundColor },
      ]}
    >
      {children}
    </View>
  );
};

export { QRBgStyle };

const styles = StyleSheet.create({
  card: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
