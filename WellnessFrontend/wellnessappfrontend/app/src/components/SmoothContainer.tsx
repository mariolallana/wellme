import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

type SmoothContainerProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export const SmoothContainer: React.FC<SmoothContainerProps> = ({ children, style }) => (
  <View style={[styles.container, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});