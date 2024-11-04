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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MainTabScreenProps } from '../navigation/types';
import { CustomButton } from '../components/CustomButton';
import { ProgressBar } from '../components/ProgressBar';
import { SmoothContainer } from '../components/SmoothContainer';
import { Animated, Easing } from 'react-native';
import { FoodTrackingService } from '../services/api/foodTracking.service';
import { FoodEntry, DailyNutrients } from '../services/api/types';
import { NutrientInferenceService } from '../services/api/nutrientInference.service';


export const FoodTracking = ({ navigation }: MainTabScreenProps<'FoodTracking'>) => {
  const [meals, setMeals] = useState<FoodEntry[]>([]);
  const [nutrients, setNutrients] = useState<DailyNutrients>({
    calories: 0,
    carbohydrates: 0,
    proteins: 0,
    fats: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [foodInput, setFoodInput] = useState('');
  const [isAddFoodVisible, setIsAddFoodVisible] = useState(false);
  const [animatedHeight] = useState(new Animated.Value(0));

  const handleAddFood = async () => {
    try {
      if (!foodInput.trim()) return;
      
      setIsLoading(true); // Add loading state while processing
      
      // First, infer nutrients from the food description
      const inferenceResponse = await NutrientInferenceService.inferNutrients(foodInput);
      
      if (!inferenceResponse.success) {
        Alert.alert('Error', 'Failed to analyze food nutrients');
        return;
      }
  
      const { calories, carbohydrates, proteins, fats } = inferenceResponse.data;
      
      // Then add the food entry with the inferred nutrients
      const response = await FoodTrackingService.addFoodEntry({
        name: foodInput,
        calories,
        carbohydrates,
        proteins,
        fats,
        consumedAt: new Date(),
      });
  
      if (response.data) {
        setMeals(prevMeals => [...prevMeals, response.data as FoodEntry]);
        setFoodInput('');
        toggleAddFood();
  
        // Refresh nutrients
        const nutrientsResponse = await FoodTrackingService.getDailyNutrients(new Date());
        if (nutrientsResponse.data) {
          setNutrients(nutrientsResponse.data);
        }
        
        // Show success message
        Alert.alert('Success', 'Food added successfully!');
      }
    } catch (error) {
      console.error('Error adding food:', error);
      Alert.alert('Error', 'Failed to add food entry');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const entriesResponse = await FoodTrackingService.getDailyEntries(new Date());
        if (entriesResponse.data) {
          setMeals(entriesResponse.data);
        }
        
        const nutrientsResponse = await FoodTrackingService.getDailyNutrients(new Date());
        if (nutrientsResponse.data) {
          setNutrients(nutrientsResponse.data);
        }
      } catch (error) {
        console.error('Error loading food data:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
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
    <View style={styles.mealCard}>
      <View style={styles.mealInfo}>
        <Text style={styles.mealName}>{item.name}</Text>
        <Text style={styles.mealTime}>
        {new Date(item.consumedAt).toLocaleString()}
      </Text>
      </View>
      <Text style={styles.calories}>{item.calories} cal</Text>
      <View style={{ backgroundColor: '#4CAF50', width: `${(item.calories / 2000) * 100}%`, height: 5 }} />
      <View style={{ backgroundColor: '#FF9800', width: `${(item.carbohydrates / 300) * 100}%`, height: 5 }} />
      <View style={{ backgroundColor: '#2196F3', width: `${(item.proteins / 150) * 100}%`, height: 5 }} />
      <View style={{ backgroundColor: '#FFC107', width: `${(item.fats / 70) * 100}%`, height: 5 }} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Food Tracking</Text>
          <TouchableOpacity style={styles.addButton} onPress={toggleAddFood}>
            <Ionicons name={isAddFoodVisible ? "close" : "add"} size={24} color="#fff" />
          </TouchableOpacity>
        </View>
  
        <Animated.View style={[
          styles.addFoodContainer,
          {
            maxHeight: animatedHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 500]
            }),
            opacity: animatedHeight,
            transform: [{
              translateY: animatedHeight.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0]
              })
            }],
            overflow: 'hidden',
          }
        ]}>
      <SmoothContainer>
        <Text style={styles.sectionTitle}>Add Food</Text>
        <TextInput
          style={[styles.input, isLoading && styles.inputDisabled]}
          placeholder="Enter food item (e.g., '2 scrambled eggs with toast')"
          value={foodInput}
          onChangeText={setFoodInput}
          editable={!isLoading}
        />
        <View style={styles.inputButtons}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#4CAF50" />
              <Text style={styles.loadingText}>Analyzing food...</Text>
            </View>
          ) : (
            <>
              <CustomButton 
                title="Add" 
                onPress={handleAddFood} 
                disabled={!foodInput.trim()}
              />
              <CustomButton 
                title="Camera" 
                onPress={() => console.log('Camera access')} 
                color="#2196F3" 
              />
              <CustomButton 
                title="Gallery" 
                onPress={() => console.log('Gallery access')} 
                color="#FF9800" 
              />
            </>
          )}
        </View>
      </SmoothContainer>
        </Animated.View>

  
        <SmoothContainer>
          <Text style={styles.sectionTitle}>Macronutrients</Text>
          <ProgressBar 
            progress={(nutrients.proteins / 150) * 100} 
            color="#9c27b0" 
            label="Proteins" 
          />
          <ProgressBar 
            progress={(nutrients.carbohydrates / 300) * 100} 
            color="#4caf50" 
            label="Carbs" 
          />
          <ProgressBar 
            progress={(nutrients.fats / 70) * 100} 
            color="#ffeb3b" 
            label="Fats" 
          />
        </SmoothContainer>
  
        <SmoothContainer style={styles.summary}>
          <View style={styles.calorieInfo}>
            <Text style={styles.calorieTitle}>Calories Today</Text>
            <Text style={styles.calorieValue}>
              {nutrients.calories.toLocaleString()} / 2,000
            </Text>
          </View>
        </SmoothContainer>
  
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          <FlatList
            data={meals}
            renderItem={renderMeal}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.mealsList}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
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
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  progressBar: {
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    flex: 1,
    marginRight: 10,
    overflow: 'hidden',
  },
  filledBar: {
    height: '100%',
    borderRadius: 10,
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
  mealsList: {
    gap: 10,
  },
  mealCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '500',
  },
  mealTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  calories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});