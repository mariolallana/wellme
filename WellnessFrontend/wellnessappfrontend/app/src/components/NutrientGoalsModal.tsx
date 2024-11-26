import React from 'react';
import { Modal, View, Text, StyleSheet, Animated } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NutrientNeeds } from '../types/nutrient.types';


interface NutrientGoalsModalProps {
  visible: boolean;
  nutrientNeeds: NutrientNeeds;
  onClose: () => void;
}

const NutrientItem = ({ label, value, icon }: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
}) => (
  <View style={styles.nutrientItem}>
    <View style={styles.iconContainer}>
      <Ionicons name={icon} size={24} color="#4CAF50" />
    </View>
    <View style={styles.nutrientInfo}>
      <Text style={styles.nutrientLabel}>{label}</Text>
      <Text style={styles.nutrientValue}>{value}</Text>
    </View>
  </View>
);

const NutrientGoalsModal = ({ visible, nutrientNeeds, onClose }: NutrientGoalsModalProps) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7
      }).start();
    }
  }, [visible]);

  React.useEffect(() => {
    console.log('Modal visibility changed:', visible);
    console.log('Nutrient needs:', nutrientNeeds);
  }, [visible, nutrientNeeds]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={[
          styles.modalContent,
          { transform: [{ scale: scaleAnim }] }
        ]}>
          <Text style={styles.title}>Your Daily Nutrient Needs</Text>
          <Text style={styles.subtitle}>Based on your profile data</Text>
          
          <View style={styles.nutrientList}>
            <NutrientItem 
              label="Calories" 
              value={`${nutrientNeeds.calories} kcal`}
              icon="flame-outline"
            />
            <NutrientItem 
              label="Protein" 
              value={`${nutrientNeeds.proteins}g`}
              icon="barbell-outline"
            />
            <NutrientItem 
              label="Carbohydrates" 
              value={`${nutrientNeeds.carbohydrates}g`}
              icon="pizza-outline"
            />
            <NutrientItem 
              label="Fats" 
              value={`${nutrientNeeds.fats}g`}
              icon="water-outline"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Got it!</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default NutrientGoalsModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  nutrientList: {
    gap: 16,
    marginBottom: 24,
  },
  nutrientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nutrientInfo: {
    flex: 1,
  },
  nutrientLabel: {
    fontSize: 16,
    color: '#666',
  },
  nutrientValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});