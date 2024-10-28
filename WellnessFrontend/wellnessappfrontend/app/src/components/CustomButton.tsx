import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  color?: string;
};

export const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, color = '#4CAF50' }) => (
  <View style={styles.buttonContainer}>
    <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '80%',
    minWidth: 120,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});