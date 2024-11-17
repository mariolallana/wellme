import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MainTabScreenProps } from '../navigation/types';
import { CustomButton } from '../components/CustomButton';
import { ProgressBar } from '../components/ProgressBar';
import { SmoothContainer } from '../components/SmoothContainer';
import { Animated } from 'react-native';
import { FoodTrackingService } from '../services/api/foodTracking.service';
import { FoodEntry, DailyNutrients } from '../services/api/apiTypes';
import { NutrientInferenceService } from '../services/api/nutrientInference.service';
import MacroNutrientDisplay from '../components/macroNutrientDisplay';
import { useAuth } from '../context/AuthContext';
import { Camera } from 'expo-camera';
import CameraModal from '../components/CameraModal';
import NutrientSummary from '../components/NutrientSummary';

export const FoodTracking = ({ navigation }: MainTabScreenProps<'FoodTracking'>) => {
  const [meals, setMeals] = useState<FoodEntry[]>([]);
  const [nutrients, setNutrients] = useState<DailyNutrients>(() => {
    console.log('Initializing nutrients state');
    return {
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
    };
  });
  const nutrientSummaryProps = React.useMemo(() => {
    console.log('Calculating nutrientSummaryProps with nutrients:', nutrients);
    if (!nutrients || !nutrients.goals) {
      console.warn('Missing nutrients or goals');
      return null;
    }
    return {
      current: {
        calories: nutrients.calories || 0,
        carbohydrates: nutrients.carbohydrates || 0,
        proteins: nutrients.proteins || 0,
        fats: nutrients.fats || 0,
      },
      goals: nutrients.goals
    };
  }, [nutrients]);

  console.log('Current nutrientSummaryProps:', nutrientSummaryProps);
  const [isLoading, setIsLoading] = useState(true);
  const [foodInput, setFoodInput] = useState('');
  const [isAddFoodVisible, setIsAddFoodVisible] = useState(false);
  const [animatedHeight] = useState(new Animated.Value(0));
  const { getToken } = useAuth();

  // New camera-related states
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Request camera permission on component mount
  useEffect(() => {
    (async () => {
      console.log('Requesting camera permission...');
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      console.log('Camera permission status:', status);
  
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'This app requires access to the camera. Please enable it in your device settings.',
          [{ text: 'OK' }]
        );
      }
    })();
  }, []);


  // New function to handle camera capture
  const handleCameraCapture = async (base64Image: string) => {
    console.log('Received captured image in FoodTracking:'); // Log the received image
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      console.log('Sending image to nutrient inference service...');
      const response = await NutrientInferenceService.inferNutrients(
        `data:image/jpeg;base64,${base64Image}`,
        true // indicate this is an image
      );
  
      if (!response.success) {
        throw new Error('Failed to analyze food nutrients');
      }
  
      const foodData = {
        name: response.data.foodLabel || 'Unknown Food',
        calories: response.data.calories,
        carbohydrates: response.data.carbohydrates,
        proteins: response.data.proteins,
        fats: response.data.fats,
        time: new Date(),
      };
  
      const foodEntry = await FoodTrackingService.addFoodEntry(foodData, token);
      
      if (foodEntry.data) {
        setMeals(prevMeals => [...prevMeals, foodEntry.data as FoodEntry]);
        await loadData(); // Refresh all data
        Alert.alert('Success', 'Food added successfully!');
      }
    } catch (error) {
      console.error('Error processing food image:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to process food image');
    } finally {
      setIsLoading(false);
      setIsCameraVisible(false);
    }
  };

  // Add this to your existing JSX, where you want the camera button to appear
  const renderCameraButton = () => (
    <TouchableOpacity
      style={styles.cameraButton}
      onPress={() => {
        console.log('Opening camera...');
        setIsCameraVisible(true);
      }}
    >
      <Ionicons name="camera" size={24} color="white" />
    </TouchableOpacity>
  );

  const handleAddFood = async () => {
    try {
      if (!foodInput.trim()) return;

      setIsLoading(true);

      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'No authentication token found');
        return;
      }

      const inferenceResponse = await NutrientInferenceService.inferNutrients(foodInput);

      if (!inferenceResponse.success) {
        Alert.alert('Error', 'Failed to analyze food nutrients');
        return;
      }

      const { calories, carbohydrates, proteins, fats } = inferenceResponse.data;

      const response = await FoodTrackingService.addFoodEntry({
        name: foodInput,
        calories,
        carbohydrates,
        proteins,
        fats,
        time: new Date(),
      }, token);

      if (response.data) {
        setMeals(prevMeals => [...prevMeals, response.data as FoodEntry]);
        setFoodInput('');
        toggleAddFood();

        const nutrientsResponse = await FoodTrackingService.getDailyNutrients(new Date(), token);
        console.log('Received nutrients response:', nutrientsResponse.data);
        if (nutrientsResponse.data) {
          setNutrients(prevNutrients => {
            const defaultGoals = {
              calories: 2000,
              carbohydrates: 250,
              proteins: 150,
              fats: 65
            };
        
            const newNutrients = {
              calories: nutrientsResponse.data?.calories || 0,
              carbohydrates: nutrientsResponse.data?.carbohydrates || 0,
              proteins: nutrientsResponse.data?.proteins || 0,
              fats: nutrientsResponse.data?.fats || 0,
              goals: {
                ...defaultGoals,
                ...(prevNutrients?.goals || {}),
                ...(nutrientsResponse.data?.goals || {})
              }
            };
        
            console.log('Setting new nutrients:', newNutrients);
            return newNutrients;
          });
        }

        Alert.alert('Success', 'Food added successfully!');
      }
    } catch (error) {
      console.error('Error adding food:', error);
      Alert.alert('Error', 'Failed to add food entry');
    } finally {
      setIsLoading(false);
    }
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'No authentication token found');
        return;
      }

      const entriesResponse = await FoodTrackingService.getDailyEntries(new Date(), token);
      const mealsData = entriesResponse.data || [];

      if (Array.isArray(mealsData)) {
        const today = new Date();
        const todayMeals = mealsData.filter((meal: FoodEntry) => {
          const consumedAtDate = new Date(meal.time);
          if (isNaN(consumedAtDate.getTime())) {
            console.error('Invalid time:', meal.time);
            return false;
          }
          return isSameDay(consumedAtDate, today);
        });

        console.log('Filtered Meals:', todayMeals);
        setMeals(todayMeals);
      }

      const nutrientsResponse = await FoodTrackingService.getDailyNutrients(new Date(), token);
      if (nutrientsResponse.data) {
        setNutrients(prevNutrients => ({
          calories: nutrientsResponse.data?.calories || 0,
          carbohydrates: nutrientsResponse.data?.carbohydrates || 0,
          proteins: nutrientsResponse.data?.proteins || 0,
          fats: nutrientsResponse.data?.fats || 0,
          goals: {
            ...prevNutrients.goals, // Preserve existing goals
            calories: nutrientsResponse.data?.goals?.calories || 2000,
            carbohydrates: nutrientsResponse.data?.goals?.carbohydrates || 250,
            proteins: nutrientsResponse.data?.goals?.proteins || 150,
            fats: nutrientsResponse.data?.goals?.fats || 65
          }
        }));
      }
    } catch (error) {
      console.error('Error loading food data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isSameDay = (date1: string | Date, date2: Date) => {
    // Ensure we have a valid Date object for date1
    const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
    
    // Add validation to ensure we have valid dates
    if (isNaN(d1.getTime())) {
      console.error('Invalid date1:', date1);
      return false;
    }
  
    console.log('Comparing dates:', {
      date1: d1.toISOString(),
      date2: date2.toISOString()
    });
    
    return (
      d1.getFullYear() === date2.getFullYear() &&
      d1.getMonth() === date2.getMonth() &&
      d1.getDate() === date2.getDate()
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleAddFood = () => {
    setIsAddFoodVisible(!isAddFoodVisible);
    Animated.timing(animatedHeight, {
      toValue: isAddFoodVisible ? 0 : 1,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const renderMeal = ({ item }: { item: FoodEntry }) => (
    <SmoothContainer style={styles.mealCard}>
      <View style={styles.mealHeader}>
        <Text style={styles.mealName}>{item.name}</Text>
        <Text style={styles.calories}>{item.calories} cal</Text>
      </View>
      <Text style={styles.mealTime}>
        {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
      <View style={styles.macroContainer}>
        <MacroNutrientDisplay
          label="Carbs"
          value={nutrients?.carbohydrates || 0}
          unit="g"
          color="#4CAF50"
        />
        <MacroNutrientDisplay
          label="Protein"
          value={nutrients?.proteins || 0}
          unit="g"
          color="#2196F3"
        />
        <MacroNutrientDisplay
          label="Fat"
          value={nutrients?.fats || 0}
          unit="g"
          color="#FFC107"
        />
      </View>
    </SmoothContainer>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : nutrientSummaryProps ? (
          <NutrientSummary {...nutrientSummaryProps} />
        ) : (
          <ActivityIndicator size="small" color="#4CAF50" />
        )}
  
          {/* Action Buttons Row */}
          <View style={styles.actionButtons}>
            {/* Camera Button */}
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => {
                console.log('Opening camera...');
                setIsCameraVisible(true);
              }}
            >
              <Ionicons name="camera" size={24} color="white" />
            </TouchableOpacity>
  
            {/* Existing Add Food Button */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                console.log('Opening food input...');
                setIsAddFoodVisible(true);
              }}
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
  
          {/* Food Input Section */}
          {isAddFoodVisible && (
            <View style={styles.input}>
              <TextInput
                style={styles.input}
                value={foodInput}
                onChangeText={setFoodInput}
                placeholder="Describe your food..."
                placeholderTextColor="#999"
              />
              <CustomButton
                title="Add Food"
                onPress={handleAddFood}
                isLoading={isLoading}
              />
            </View>
          )}
  
          {/* Meals List */}
          <View style={styles.mealsList}>
            {meals.length > 0 ? (
              meals.map((meal, index) => (
                <View key={meal._id || index} style={styles.mealCard}>
                  <View style={styles.mealHeader}>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <Text style={styles.calories}>{meal.calories.toFixed(0)} cal</Text>
                  </View>
                  <Text style={styles.mealTime}>
                    {new Date(meal.time).toLocaleTimeString()}
                  </Text>
                  <View style={styles.macronutrientContainer}>
                    <MacroNutrientDisplay
                      label="Carbs"
                      value={meal.carbohydrates}
                      unit="g"
                      color="#4CAF50"
                    />
                    <MacroNutrientDisplay
                      label="Protein"
                      value={meal.proteins}
                      unit="g"
                      color="#2196F3"
                    />
                    <MacroNutrientDisplay
                      label="Fat"
                      value={meal.fats}
                      unit="g"
                      color="#FFC107"
                    />
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No meals added today</Text>
            )}
          </View>
        </View>
      </ScrollView>
  
      {/* Camera Modal */}
            
      {isCameraVisible && (
        <CameraModal
          isVisible={isCameraVisible}
          onClose={() => {
            console.log('Closing camera...');
            setIsCameraVisible(false);
          }}
          onPhotoTaken={handleCameraCapture}
        />
      )}
  
      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  addFoodContainer: {
    marginHorizontal: 20,
  },
  inputDisabled: {
    backgroundColor: '#f5f5f5',
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    gap: 10,
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    margin: 20,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  inputButtons: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 10,
    marginHorizontal: 20,
  },
  cameraButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  progressBarsContainer: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
  progressBarWrapper: {
    marginVertical: 5,
  },
  progressLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  filledBar: {
    height: '100%',
    borderRadius: 8,
  },
  proteinBar: {
    backgroundColor: '#9c27b0',
  },
  carbBar: {
    backgroundColor: '#4caf50',
  },
  fatBar: {
    backgroundColor: '#ffeb3b',
  },
  progressText: {
    width: 40,
    textAlign: 'center',
  },
  summary: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  calorieInfo: {
    alignItems: 'center',
  },
  calorieTitle: {
    fontSize: 16,
    color: '#666',
  },
  calorieValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  mealCard: {
    marginVertical: 5,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  mealTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  calories: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: 8,
  },
  macronutrientContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 5,
  },
  mealsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginTop: 20,
  },
  mealInfo: {
    flex: 1,
  },
  macroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  cameraButton: {
    backgroundColor: '#4CAF50',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
});