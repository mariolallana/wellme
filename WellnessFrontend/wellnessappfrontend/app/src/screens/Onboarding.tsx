// src/screens/Onboarding.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackScreenProps } from '../navigation/types';
import { ProfileService } from '../services/api/profile.service';
import { OnboardingFormData } from '../services/api/apiTypes';
import { useAuth } from '../context/AuthContext';
import LogoutButton from '../components/LogoutButton';
import NutrientGoalsModal from '../components/NutrientGoalsModal';
import { NutrientNeeds } from '../types/nutrient.types';
import StepIndicator from '../components/StepIndicator';

const GOALS = [
  { id: 'lose', title: 'Lose Weight' },
  { id: 'maintain', title: 'Maintain Weight' },
  { id: 'gain', title: 'Gain Weight' },
];

const ACTIVITY_LEVELS = [
  { id: 'sedentary', title: 'Sedentary' },
  { id: 'light', title: 'Lightly Active' },
  { id: 'moderate', title: 'Moderately Active' },
  { id: 'active', title: 'Active' },
];

const DIETARY_PREFERENCES = [
  { id: 'vegetarian', title: 'Vegetarian' },
  { id: 'vegan', title: 'Vegan' },
  { id: 'glutenFree', title: 'Gluten Free' },
  { id: 'lowCholesterol', title: 'Low Cholesterol' },
  { id: 'diabetesFriendly', title: 'Diabetes Friendly' },
];

const Onboarding = ({ navigation }: RootStackScreenProps<'Onboarding'>) => {
  const [step, setStep] = useState(1);
  const { completeOnboarding } = useAuth();
  const [formData, setFormData] = useState<OnboardingFormData>({
    name: '',
    age: 0,
    gender: 'male',
    weight: 0,
    height: 0,
    goal: 'lose',
    activityLevel: 'sedentary',
    dietaryPreferences: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      lowCholesterol: false,
      diabetesFriendly: false,
    },
  });
  const [calculatedNeeds, setCalculatedNeeds] = useState<NutrientNeeds | null>(null);
  const [showNutrientModal, setShowNutrientModal] = useState(false);

  useEffect(() => {
    console.log('State changed - calculatedNeeds:', calculatedNeeds);
    console.log('State changed - showNutrientModal:', showNutrientModal);
  }, [calculatedNeeds, showNutrientModal]);

  const handleNext = async () => {
    if (step === 1) {
      if (!formData.name || !formData.age || !formData.weight || !formData.height) {
        Alert.alert('Missing Information', 'Please fill in all fields before continuing.');
        return;
      }
      setStep(2);
      return;
    }

    try {
      console.log('Submitting form data:', formData);
      
      const response = await ProfileService.saveOnboardingProfile(formData);
      console.log('Profile save response:', response);
      
      if (response.success && response.data && response.data.nutritionalGoals) {
        const { nutritionalGoals } = response.data;
        
        const needs = {
          calories: Math.round(nutritionalGoals.dailyCalories),
          proteins: Math.round(nutritionalGoals.macronutrientRatios.protein * nutritionalGoals.dailyCalories / 4),
          carbohydrates: Math.round(nutritionalGoals.macronutrientRatios.carbs * nutritionalGoals.dailyCalories / 4),
          fats: Math.round(nutritionalGoals.macronutrientRatios.fats * nutritionalGoals.dailyCalories / 9)
        };
        
        console.log('Setting calculated needs:', needs);
        
        // Set both states together
        setCalculatedNeeds(needs);
        setShowNutrientModal(true);
        
        // Move completeOnboarding to the modal's onClose callback
        // await completeOnboarding(); // Remove this from here
      } else {
        throw new Error(response.error || 'Failed to save profile data');
      }
    } catch (error: any) {
      console.error('Onboarding error:', error);
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Basic Information</Text>
      <Text style={styles.subtitle}>Let's get to know you better</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Personal Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={formData.name}
          onChangeText={(value) => setFormData({ ...formData, name: value })}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          value={formData.age.toString()}
          onChangeText={(value) => setFormData({ ...formData, age: Number(value) })}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Body Measurements</Text>
        <TextInput
          style={styles.input}
          placeholder="Weight (kg)"
          value={formData.weight.toString()}
          onChangeText={(value) => setFormData({ ...formData, weight: Number(value) })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Height (cm)"
          value={formData.height.toString()}
          onChangeText={(value) => setFormData({ ...formData, height: Number(value) })}
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Goals & Preferences</Text>
      <Text style={styles.subtitle}>Customize your wellness journey</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Your Goal</Text>
        {GOALS.map((goal) => (
          <TouchableOpacity
            key={goal.id}
            style={[
              styles.selectionButton,
              formData.goal === goal.id && styles.selectedButton,
            ]}
            onPress={() => setFormData({ ...formData, goal: goal.id as 'lose' | 'maintain' | 'gain' })}
          >
            <Text style={formData.goal === goal.id ? styles.selectedButtonText : styles.buttonText}>
              {goal.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Dietary Preferences</Text>
        <View style={styles.preferencesGrid}>
          {DIETARY_PREFERENCES.map((preference) => (
            <TouchableOpacity
              key={preference.id}
              style={[
                styles.preferenceButton,
                formData.dietaryPreferences[preference.id as keyof typeof formData.dietaryPreferences] && 
                styles.selectedPreferenceButton,
              ]}
              onPress={() => setFormData({
                ...formData,
                dietaryPreferences: {
                  ...formData.dietaryPreferences,
                  [preference.id as keyof typeof formData.dietaryPreferences]: 
                    !formData.dietaryPreferences[preference.id as keyof typeof formData.dietaryPreferences],
                },
              })}
            >
              <Text style={
                formData.dietaryPreferences[preference.id as keyof typeof formData.dietaryPreferences] 
                  ? styles.selectedButtonText 
                  : styles.buttonText
              }>
                {preference.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoidingView}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <StepIndicator currentStep={step} totalSteps={2} />
          {step === 1 ? renderStep1() : renderStep2()}
          
          <View style={styles.buttonContainer}>
            {step > 1 && (
              <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
                <Text style={styles.secondaryButtonText}>Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.primaryButton, step > 1 && styles.buttonFlex]} 
              onPress={handleNext}
            >
              <Text style={styles.primaryButtonText}>
                {step === 1 ? 'Next' : 'Complete'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {calculatedNeeds && showNutrientModal && (
        <NutrientGoalsModal
          visible={true}
          nutrientNeeds={calculatedNeeds}
          onClose={async () => {
            console.log('Modal closing');
            setShowNutrientModal(false);
            // Complete onboarding and navigate after modal is closed
            try {
              await completeOnboarding();
              navigation.replace('MainTabs');
            } catch (error) {
              console.error('Error completing onboarding:', error);
              Alert.alert('Error', 'Failed to complete onboarding');
            }
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  stepContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    fontSize: 16,
  },
  selectionButton: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
  },
  selectedButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
  selectedButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  preferencesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  preferenceButton: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    minWidth: '48%',
    alignItems: 'center',
  },
  selectedPreferenceButton: {
    backgroundColor: '#4CAF50',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  secondaryButton: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonFlex: {
    flex: 2,
  },
});

export default Onboarding;