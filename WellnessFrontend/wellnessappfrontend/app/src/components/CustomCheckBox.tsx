import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { StyleSheet } from "react-native";

const CustomCheckbox = ({ label, value, onValueChange }: {
    label: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
}) => (
    <TouchableOpacity 
      style={styles.checkboxContainer} 
      onPress={() => onValueChange(!value)}
    >
      <View style={[styles.checkbox, value && styles.checkboxChecked]}>
        {value && <Ionicons name="checkmark" size={16} color="white" />}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
);

export default CustomCheckbox;

const styles = StyleSheet.create({
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 8,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: '#4CAF50',
      marginRight: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxChecked: {
      backgroundColor: '#4CAF50',
    },
    checkboxLabel: {
      fontSize: 16,
      color: '#333',
    },
});