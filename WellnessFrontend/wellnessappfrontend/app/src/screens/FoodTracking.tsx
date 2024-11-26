import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MainTabScreenProps } from '../navigation/types';
import { FoodEntry, DailyNutrients } from '../services/api/apiTypes';
import { FoodTrackingService } from '../services/api/foodTracking.service';
import { useAuth } from '../context/AuthContext';
import CameraModal from '../components/CameraModal';
import AddFoodModal from '../components/AddFoodModal';
import NutritionPeriodSelector from '../components/NutritionPeriodSelector';
import DailyNutritionView from '../components/DailyNutritionView';
import MicronutrientsPanel from '../components/MicronutrientsPanel';

const FoodTracking = ({ navigation }: MainTabScreenProps<'FoodTracking'>) => {
  // State declarations
  const [meals, setMeals] = useState<FoodEntry[]>([]);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isAddFoodVisible, setIsAddFoodVisible] = useState(false);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [isLoading, setIsLoading] = useState(true);
  const { getToken } = useAuth();
  const [animatedHeight] = useState(new Animated.Value(0));

  const [nutrients, setNutrients] = useState<DailyNutrients>({
    calories: 0,
    carbohydrates: 0,
    proteins: 0,
    fats: 0,
    goals: {
      calories: 2000,
      carbohydrates: 250,
      proteins: 150,
      fats: 65
    }
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      if (!token) throw new Error('No token available');

      const response = await FoodTrackingService.getDailyNutrients(new Date(), token);
      if (response.success && response.data) {
        setNutrients(response.data);
        const mealsResponse = await FoodTrackingService.getDailyEntries(new Date(), token);
        if (mealsResponse.success && mealsResponse.data) {
          setMeals(mealsResponse.data);
        }
      }
    } catch (error) {
      console.error('Error loading nutrition data:', error);
      Alert.alert('Error', 'Failed to load nutrition data');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAddOptions = () => {
    setShowAddOptions(!showAddOptions);
    Animated.timing(animatedHeight, {
      toValue: showAddOptions ? 0 : 1,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const handleCameraCapture = async (foodData: Partial<FoodEntry>) => {
    try {
      const token = await getToken();
      if (!token) throw new Error('No token available');

      const response = await FoodTrackingService.addFoodEntry(foodData, token);
      if (response.success) {
        await loadData(); // Reload data after adding
      } else {
        throw new Error(response.error || 'Failed to add food entry');
      }
    } catch (error) {
      console.error('Error adding food from camera:', error);
      Alert.alert('Error', 'Failed to add food from camera');
    }
  };

  const handleCameraClose = () => {
    setIsCameraVisible(false);
    setShowAddOptions(false); // Also reset the add options state
  };

  const handleAddFood = async (foodData: Partial<FoodEntry>) => {
    try {
      const token = await getToken();
      if (!token) throw new Error('No token available');
      const response = await FoodTrackingService.addFoodEntry(foodData, token);
      if (response.success) {
        await loadData();
        setIsAddFoodVisible(false);
      } else {
        throw new Error(response.error || 'Failed to add food');
      }
    } catch (error) {
      console.error('Error adding food:', error);
      Alert.alert('Error', 'Failed to add food entry');
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      );
    }

    return (
      <DailyNutritionView
        meals={meals}
        nutrients={nutrients}
        nutrientSummaryProps={{
          current: {
            calories: nutrients.calories,
            carbohydrates: nutrients.carbohydrates,
            proteins: nutrients.proteins,
            fats: nutrients.fats
          },
          goals: nutrients.goals,
          isLoading: isLoading
        }}
        selectedPeriod={selectedPeriod}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <NutritionPeriodSelector
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />
      
      {renderContent()}

      {/* Add Food Button */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={toggleAddOptions}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Add Options */}
        {showAddOptions && (
          <Animated.View style={[
            styles.addOptions,
            {
              transform: [{
                translateY: animatedHeight.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0]
                })
              }]
            }
          ]}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                setShowAddOptions(false);
                setIsCameraVisible(true);
              }}
            >
              <Ionicons name="camera-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                setShowAddOptions(false);
                setIsAddFoodVisible(true);
              }}
            >
              <Ionicons name="create-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      {/* Modals */}
      <CameraModal
        visible={isCameraVisible}
        onClose={handleCameraClose}
        onCapture={handleCameraCapture}
      />
      <AddFoodModal
        visible={isAddFoodVisible}
        onClose={() => setIsAddFoodVisible(false)}
        onSubmit={handleAddFood}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addOptions: {
    position: 'absolute',
    bottom: 70,
    right: 0,
    gap: 10,
  },
  optionButton: {
    backgroundColor: '#4CAF50',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default FoodTracking;