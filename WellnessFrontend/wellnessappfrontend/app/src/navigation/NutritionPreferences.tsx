import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ProfileService } from '../services/api/profile.service';
import { useAuth } from '../context/AuthContext';
import SmoothContainer from '../components/SmoothContainer';
import { Ionicons } from '@expo/vector-icons';

interface NutritionPreferencesState {
  activityLevel: string;
  weightGoal: string;
  calorieGoal: number;
  dietaryPreferences: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
    nutFree: boolean;
  };
}

const activityLevels = [
  { label: 'Sedentary', value: 'sedentary' },
  { label: 'Light', value: 'light' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'Active', value: 'active' },
  { label: 'Very Active', value: 'very_active' },
];

const weightGoals = [
  { label: 'Lose Weight', value: 'lose' },
  { label: 'Maintain Weight', value: 'maintain' },
  { label: 'Gain Weight', value: 'gain' },
];

const NutritionPreferences = () => {
  const { getToken, user, updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState<NutritionPreferencesState>({
    activityLevel: user?.profile?.activityLevel || 'moderate',
    weightGoal: user?.profile?.goal || 'maintain',
    calorieGoal: user?.profile?.calories || 2000,
    dietaryPreferences: user?.profile?.dietaryPreferences || {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
      nutFree: false,
    },
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const token = await getToken();
      if (!token) throw new Error('No token available');

      const response = await ProfileService.getUserProfile(token);
      if (response.success && response.data) {
        setPreferences({
          activityLevel: response.data.activityLevel || 'moderate',
          weightGoal: response.data.weightGoal || 'maintain',
          calorieGoal: response.data.calorieGoal || 2000,
          dietaryPreferences: response.data.dietaryPreferences || {
            vegetarian: false,
            vegan: false,
            glutenFree: false,
            dairyFree: false,
            nutFree: false,
          },
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      Alert.alert('Error', 'Failed to load preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await ProfileService.updateUserProfile(preferences);
      if (response.success) {
        updateUserProfile(response.data);
        Alert.alert('Success', 'Preferences updated successfully');
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      Alert.alert('Error', 'Failed to update preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDietaryPreference = (key: keyof typeof preferences.dietaryPreferences) => {
    setPreferences(prev => ({
      ...prev,
      dietaryPreferences: {
        ...prev.dietaryPreferences,
        [key]: !prev.dietaryPreferences[key]
      }
    }));
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <SmoothContainer>
        <Text style={styles.title}>Nutrition Preferences</Text>

        <View style={styles.preferenceSection}>
          <Text style={styles.label}>Activity Level</Text>
          <View style={styles.optionsContainer}>
            {activityLevels.map((level) => (
              <TouchableOpacity
                key={level.value}
                style={[
                  styles.optionButton,
                  preferences.activityLevel === level.value && styles.selectedOption
                ]}
                onPress={() => setPreferences(prev => ({...prev, activityLevel: level.value}))}
              >
                <Text style={[
                  styles.optionText,
                  preferences.activityLevel === level.value && styles.selectedOptionText
                ]}>
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.preferenceSection}>
          <Text style={styles.label}>Weight Goal</Text>
          <View style={styles.optionsContainer}>
            {weightGoals.map((goal) => (
              <TouchableOpacity
                key={goal.value}
                style={[
                  styles.optionButton,
                  preferences.weightGoal === goal.value && styles.selectedOption
                ]}
                onPress={() => setPreferences(prev => ({...prev, weightGoal: goal.value}))}
              >
                <Text style={[
                  styles.optionText,
                  preferences.weightGoal === goal.value && styles.selectedOptionText
                ]}>
                  {goal.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.preferenceSection}>
          <Text style={styles.label}>Dietary Preferences</Text>
          {Object.entries(preferences.dietaryPreferences).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={[styles.dietaryOption, value && styles.selectedDietaryOption]}
              onPress={() => toggleDietaryPreference(key as keyof typeof preferences.dietaryPreferences)}
            >
              <Text style={[styles.dietaryOptionText, value && styles.selectedDietaryOptionText]}>
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </Text>
              {value && <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </SmoothContainer>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  preferenceSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    minWidth: '45%',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  optionText: {
    color: '#666',
    fontSize: 14,
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  dietaryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginVertical: 5,
  },
  selectedDietaryOption: {
    backgroundColor: '#E8F5E9',
  },
  dietaryOptionText: {
    fontSize: 16,
    color: '#666',
  },
  selectedDietaryOptionText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
});

export default NutritionPreferences;