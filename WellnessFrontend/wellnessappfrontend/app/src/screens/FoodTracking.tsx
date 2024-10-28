import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  TextInput,
  Button,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MainTabScreenProps } from '../navigation/types';
import { CustomButton } from '../components/CustomButton';
import { ProgressBar } from '../components/ProgressBar';
import { SmoothContainer } from '../components/SmoothContainer';
import { Animated, Easing } from 'react-native';

type FoodItem = {
  id: string;
  name: string;
  calories: number;
  carbohydrates: number;
  proteins: number;
  fats: number;
  time: string;
};

export const FoodTracking = ({ navigation }: MainTabScreenProps<'FoodTracking'>) => {
  const [meals, setMeals] = useState<FoodItem[]>([]);
  const [foodInput, setFoodInput] = useState('');
  const [isAddFoodVisible, setIsAddFoodVisible] = useState(false);
  const animatedHeight = useState(new Animated.Value(0))[0];

  const handleAddFood = () => {
    // Placeholder for adding food logic
    console.log('Food added:', foodInput);
    setFoodInput('');
  };

  const toggleAddFood = () => {
    setIsAddFoodVisible(!isAddFoodVisible);
    Animated.timing(animatedHeight, {
      toValue: isAddFoodVisible ? 0 : 1,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const renderMeal = ({ item }: { item: FoodItem }) => (
    <View style={styles.mealCard}>
      <View style={styles.mealInfo}>
        <Text style={styles.mealName}>{item.name}</Text>
        <Text style={styles.mealTime}>{item.time}</Text>
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
              outputRange: [0, 500]  // Increased from 300 to 500
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
              style={styles.input}
              placeholder="Enter food item"
              value={foodInput}
              onChangeText={setFoodInput}
            />
            <View style={styles.inputButtons}>
              <CustomButton title="Add" onPress={handleAddFood} />
              <CustomButton title="Camera" onPress={() => console.log('Camera access')} color="#2196F3" />
              <CustomButton title="Gallery" onPress={() => console.log('Gallery access')} color="#FF9800" />
            </View>
          </SmoothContainer>
        </Animated.View>

  
        <SmoothContainer>
          <Text style={styles.sectionTitle}>Macronutrients</Text>
          <ProgressBar progress={60} color="#9c27b0" label="Proteins" />
          <ProgressBar progress={80} color="#4caf50" label="Carbs" />
          <ProgressBar progress={95} color="#ffeb3b" label="Fats" />
        </SmoothContainer>
  
        <SmoothContainer style={styles.summary}>
          <View style={styles.calorieInfo}>
            <Text style={styles.calorieTitle}>Calories Today</Text>
            <Text style={styles.calorieValue}>1,200 / 2,000</Text>
          </View>
        </SmoothContainer>
  
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          <FlatList
            data={meals}
            renderItem={renderMeal}
            keyExtractor={item => item.id}
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