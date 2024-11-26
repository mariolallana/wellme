import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type Period = 'daily' | 'weekly' | 'monthly';

interface Props {
  selectedPeriod: Period;
  onPeriodChange: (period: Period) => void;
}

const NutritionPeriodSelector: React.FC<Props> = ({ selectedPeriod, onPeriodChange }) => {
  return (
    <View style={styles.container}>
      {['daily', 'weekly', 'monthly'].map((period) => (
        <TouchableOpacity
          key={period}
          style={[styles.periodButton, selectedPeriod === period ? styles.selectedButton : null]}
          onPress={() => onPeriodChange(period as Period)}
        >
          <Text style={[
            styles.periodText,
            selectedPeriod === period ? styles.selectedText : null
          ]}>
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    padding: 4,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    zIndex: 1,
  },
  selectedButton: {
    backgroundColor: '#e0f7fa',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  periodText: {
    fontSize: 16,
    color: '#666',
  },
  selectedText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

export default NutritionPeriodSelector;