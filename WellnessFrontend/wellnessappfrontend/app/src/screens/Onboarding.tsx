// src/screens/Onboarding.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackScreenProps } from '../navigation/types';
import { ProfileService } from '../services/api/profile.service';
import { OnboardingFormData } from '../services/api/types';
import { useAuth } from '../context/AuthContext';




type GoalOption = {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const GOALS: GoalOption[] = [
  { id: 'lose', title: 'Lose Weight', icon: 'trending-down-outline' },
  { id: 'maintain', title: 'Maintain Weight', icon: 'fitness-outline' },
  { id: 'gain', title: 'Gain Weight', icon: 'trending-up-outline' },
];

const ACTIVITY_LEVELS = [
  { id: 'sedentary', title: 'Sedentary', description: 'Little or no exercise' },
  { id: 'light', title: 'Light', description: '1-3 days/week' },
  { id: 'moderate', title: 'Moderate', description: '3-5 days/week' },
  { id: 'active', title: 'Active', description: '6-7 days/week' },
];

export const Onboarding = ({ navigation }: RootStackScreenProps<'Onboarding'>) => {
    const [step, setStep] = useState(1);
    const { completeOnboarding } = useAuth();
    const [formData, setFormData] = useState<OnboardingFormData>({
      name: '',
      age: '',
      gender: '',
      weight: '',
      height: '',
      goal: '',
      activityLevel: '',
    });

  const updateForm = (key: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      try {
        // Updated to match the expected OnboardingFormData structure
        const profileData = {
          name: formData.name,
          age: formData.age,
          gender: formData.gender,
          weight: formData.weight,
          height: formData.height,
          goal: formData.goal,
          activityLevel: formData.activityLevel,
        };
  
        const response = await ProfileService.saveOnboardingProfile(profileData);
  
        if (response.success) {
          await completeOnboarding();
          console.log('[Onboarding] Onboarding completed flag set to true');
          navigation.navigate('MainTabs');
        } else {
          Alert.alert('Error', response.error || 'Failed to save profile data');
        }
      } catch (error) {
        console.error('Error during onboarding:', error);
        Alert.alert('Error', 'An unexpected error occurred');
      }
    }
  };


  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name.length >= 2;
      case 2:
        return formData.age !== '' && formData.gender !== '';
      case 3:
        return formData.weight !== '' && formData.height !== '';
      case 4:
        return formData.goal !== '' && formData.activityLevel !== '';
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.question}>What's your name?</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={formData.name}
              onChangeText={(value) => updateForm('name', value)}
              autoFocus
              returnKeyType="next"
              onSubmitEditing={handleNext}
            />
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.question}>Tell us about yourself</Text>
            <TextInput
              style={styles.input}
              placeholder="Age"
              value={formData.age}
              onChangeText={(value) => updateForm('age', value)}
              keyboardType="number-pad"
              returnKeyType="next"
            />
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  formData.gender === 'male' && styles.selectedGender,
                ]}
                onPress={() => updateForm('gender', 'male')}
              >
                <Ionicons name="male" size={24} color={formData.gender === 'male' ? '#fff' : '#666'} />
                <Text style={[styles.genderText, formData.gender === 'male' && styles.selectedGenderText]}>
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  formData.gender === 'female' && styles.selectedGender,
                ]}
                onPress={() => updateForm('gender', 'female')}
              >
                <Ionicons name="female" size={24} color={formData.gender === 'female' ? '#fff' : '#666'} />
                <Text style={[styles.genderText, formData.gender === 'female' && styles.selectedGenderText]}>
                  Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.question}>What are your measurements?</Text>
            <View style={styles.measurementContainer}>
              <View style={styles.measurementInput}>
                <TextInput
                  style={styles.input}
                  placeholder="Weight (kg)"
                  value={formData.weight}
                  onChangeText={(value) => updateForm('weight', value)}
                  keyboardType="decimal-pad"
                  returnKeyType="next"
                />
              </View>
              <View style={styles.measurementInput}>
                <TextInput
                  style={styles.input}
                  placeholder="Height (cm)"
                  value={formData.height}
                  onChangeText={(value) => updateForm('height', value)}
                  keyboardType="decimal-pad"
                  returnKeyType="next"
                />
              </View>
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.question}>What's your goal?</Text>
            <View style={styles.goalsContainer}>
              {GOALS.map((goal) => (
                <TouchableOpacity
                  key={goal.id}
                  style={[
                    styles.goalCard,
                    formData.goal === goal.id && styles.selectedGoal,
                  ]}
                  onPress={() => updateForm('goal', goal.id)}
                >
                  <Ionicons
                    name={goal.icon}
                    size={24}
                    color={formData.goal === goal.id ? '#fff' : '#666'}
                  />
                  <Text
                    style={[
                      styles.goalText,
                      formData.goal === goal.id && styles.selectedGoalText,
                    ]}
                  >
                    {goal.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.question, { marginTop: 20 }]}>
              How active are you?
            </Text>
            <View style={styles.activityContainer}>
              {ACTIVITY_LEVELS.map((activity) => (
                <TouchableOpacity
                  key={activity.id}
                  style={[
                    styles.activityCard,
                    formData.activityLevel === activity.id && styles.selectedActivity,
                  ]}
                  onPress={() => updateForm('activityLevel', activity.id)}
                >
                  <Text
                    style={[
                      styles.activityTitle,
                      formData.activityLevel === activity.id && styles.selectedActivityText,
                    ]}
                  >
                    {activity.title}
                  </Text>
                  <Text
                    style={[
                      styles.activityDescription,
                      formData.activityLevel === activity.id && styles.selectedActivityText,
                    ]}
                  >
                    {activity.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          {step > 1 && (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          )}
          <View style={styles.progressContainer}>
            {[1, 2, 3, 4].map((i) => (
              <View
                key={i}
                style={[
                  styles.progressDot,
                  i === step && styles.activeDot,
                  i < step && styles.completedDot,
                ]}
              />
            ))}
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {renderStep()}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, !isStepValid() && styles.buttonDisabled]}
            onPress={handleNext}
            disabled={!isStepValid()}
          >
            <Text style={styles.buttonText}>
              {step === 4 ? 'Get Started' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
  },
  activeDot: {
    backgroundColor: '#4CAF50',
    transform: [{ scale: 1.2 }],
  },
  completedDot: {
    backgroundColor: '#4CAF50',
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  stepContainer: {
    flex: 1,
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 10,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    gap: 10,
  },
  selectedGender: {
    backgroundColor: '#4CAF50',
  },
  genderText: {
    fontSize: 16,
    color: '#666',
  },
  selectedGenderText: {
    color: '#fff',
  },
  measurementContainer: {
    gap: 15,
  },
  measurementInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unit: {
    marginLeft: -40,
    marginRight: 20,
    color: '#666',
  },
  goalsContainer: {
    gap: 15,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    gap: 15,
  },
  selectedGoal: {
    backgroundColor: '#4CAF50',
  },
  goalText: {
    fontSize: 16,
    color: '#666',
  },
  selectedGoalText: {
    color: '#fff',
  },
  activityContainer: {
    gap: 10,
    marginTop: 10,
  },
  activityCard: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  selectedActivity: {
    backgroundColor: '#4CAF50',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
  },
  selectedActivityText: {
    color: '#fff',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});