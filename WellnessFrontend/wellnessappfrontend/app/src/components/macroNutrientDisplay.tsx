import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MacroNutrientDisplayProps {
  label: string;
  value: number;
  unit: string;
  color: string;
}

const MacroNutrientDisplay: React.FC<MacroNutrientDisplayProps> = ({
  label,
  value,
  unit,
  color,
}) => {
  return (
    <View style={[styles.container, { borderColor: color }]}>
      <View style={styles.content}>
        <Text style={styles.value}>{value.toFixed(0)}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  unit: {
    fontSize: 12,
    marginLeft: 4,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default MacroNutrientDisplay;