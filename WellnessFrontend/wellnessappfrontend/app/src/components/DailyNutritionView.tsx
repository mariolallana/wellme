import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { FoodEntry, DailyNutrients } from '../services/api/apiTypes';
import NutrientSummary from './NutrientSummary';
import MacroNutrientDisplay from './macroNutrientDisplay';
import SmoothContainer from './SmoothContainer';

interface Props {
  meals: FoodEntry[];
  nutrients: DailyNutrients;
  nutrientSummaryProps: any;
  selectedPeriod: 'daily' | 'weekly' | 'monthly';
}

const DailyNutritionView: React.FC<Props> = ({ 
  meals, 
  nutrients, 
  nutrientSummaryProps,
  selectedPeriod 
}) => {
  const renderMeal = ({ item }: { item: FoodEntry }) => {
    const mealTime = new Date(item.time).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
      <SmoothContainer style={styles.mealCard}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealName}>{item.name}</Text>
          <Text style={styles.calories}>{item.calories.toFixed(0)} kcal</Text>
        </View>
        <Text style={styles.mealTime}>{mealTime}</Text>
        <View style={styles.macroContainer}>
          <MacroNutrientDisplay
            label="Carbs"
            value={item.carbohydrates}
            unit="g"
            color="#4CAF50"
          />
          <MacroNutrientDisplay
            label="Protein"
            value={item.proteins}
            unit="g"
            color="#4CAF50"
          />
          <MacroNutrientDisplay
            label="Fat"
            value={item.fats}
            unit="g"
            color="#4CAF50"
          />
        </View>
      </SmoothContainer>
    );
  };

  const renderPeriodSummary = () => {
    switch (selectedPeriod) {
      case 'weekly':
      case 'monthly':
        return (
          <>
            <NutrientSummary {...nutrientSummaryProps} title="Total for Period" />
            <NutrientSummary 
              current={{
                calories: nutrients.calories / (selectedPeriod === 'weekly' ? 7 : 30),
                carbohydrates: nutrients.carbohydrates / (selectedPeriod === 'weekly' ? 7 : 30),
                proteins: nutrients.proteins / (selectedPeriod === 'weekly' ? 7 : 30),
                fats: nutrients.fats / (selectedPeriod === 'weekly' ? 7 : 30),
              }}
              goals={nutrients.goals}
              title="Daily Average"
            />
          </>
        );
      default:
        return <NutrientSummary {...nutrientSummaryProps} title="Today's Summary" />;
    }
  };

  return (
    <View style={styles.container}>
      {renderPeriodSummary()}
      <FlatList
        data={meals}
        renderItem={renderMeal}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mealsList}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>
            No meals tracked for this period. Add your first meal!
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  macroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
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
});

export default DailyNutritionView;