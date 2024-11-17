import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  ActivityIndicator,
  StyleSheet, 
  StyleProp, 
  ViewStyle 
} from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  isLoading?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({ 
  title, 
  onPress, 
  color = '#4CAF50',
  disabled = false,
  style,
  isLoading = false 
}) => (
  <TouchableOpacity 
    style={[
      styles.button, 
      { backgroundColor: color },
      disabled && styles.buttonDisabled,
      style
    ]} 
    onPress={onPress}
    disabled={disabled || isLoading}
  >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonDisabled: {
    opacity: 0.6,
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
});