import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface TscheckProps {
  title?: string;
}

export const Tscheck = ({ title = 'Hello' }: TscheckProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title} from @masumdev/tscheck</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
