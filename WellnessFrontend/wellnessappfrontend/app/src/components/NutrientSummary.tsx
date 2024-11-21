import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SmoothContainer } from './SmoothContainer';

interface NutrientSummaryProps {
  current: {
    calories: number;
    carbohydrates: number;
    proteins: number;
    fats: number;
  };
  goals: {
    calories: number;
    carbohydrates: number;
    proteins: number;
    fats: number;
  };
}

export const NutrientSummary = ({ current, goals }: NutrientSummaryProps) => {
    //console.log('NutrientSummary rendering with props:', { current, goals });

    if (!current || !goals) {
        // console.warn('NutrientSummary: Missing required props', { current, goals });
        return null;
    }
    
    const progressValues = React.useMemo(() => {
        if (!current || !goals) {
          //console.warn('Missing current or goals in progressValues calculation');
          return {
            carbs: 0,
            proteins: 0,
            fats: 0
          };
        }
        
        const values = {
          carbs: Math.min((current.carbohydrates / goals.carbohydrates) * 100, 100),
          proteins: Math.min((current.proteins / goals.proteins) * 100, 100),
          fats: Math.min((current.fats / goals.fats) * 100, 100)
        };
        
        // console.log('Calculated progress values:', values);
        return values;
      }, [current, goals]);

  return (
    <SmoothContainer>
      <View style={styles.calorieInfo}>
        <Text style={styles.calorieTitle}>Total Calories</Text>
        <Text style={styles.calorieValue}>
          {current.calories.toFixed(0)} / {goals.calories} kcal
        </Text>
      </View>

      <View style={styles.progressBarsContainer}>
        <View style={styles.progressBarWrapper}>
          <View style={styles.labelContainer}>
            <Text style={styles.progressLabel}>Carbs</Text>
            <Text style={styles.progressValue}>
              {current.carbohydrates.toFixed(0)}g / {goals.carbohydrates}g
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.filledBar, 
                styles.carbBar, 
                { width: `${progressValues.carbs}%` }
              ]} 
            />
          </View>
        </View>

        <View style={styles.progressBarWrapper}>
          <View style={styles.labelContainer}>
            <Text style={styles.progressLabel}>Protein</Text>
            <Text style={styles.progressValue}>
              {current.proteins.toFixed(0)}g / {goals.proteins}g
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.filledBar, 
                styles.proteinBar, 
                { width: `${progressValues.proteins}%` }
              ]} 
            />
          </View>
        </View>

        <View style={styles.progressBarWrapper}>
          <View style={styles.labelContainer}>
            <Text style={styles.progressLabel}>Fat</Text>
            <Text style={styles.progressValue}>
              {current.fats.toFixed(0)}g / {goals.fats}g
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.filledBar, 
                styles.fatBar, 
                { width: `${progressValues.fats}%` }
              ]} 
            />
          </View>
        </View>
      </View>
    </SmoothContainer>
  );
};

const styles = StyleSheet.create({
  calorieInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  calorieTitle: {
    fontSize: 16,
    color: '#666',
  },
  calorieValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  progressBarsContainer: {
    gap: 12,
    marginTop: 8,
  },
  progressBarWrapper: {
    gap: 4,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'left',
    marginLeft: 8, // Adjust margin to move it slightly to the left
  },
  progressValue: {
    fontSize: 12,
    color: '#4CAF50', // Change color to match total calories
    textAlign: 'left',
    marginLeft: 8, // Adjust margin to move it slightly to the left
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  filledBar: {
    height: '100%',
    borderRadius: 4,
  },
  carbBar: {
    backgroundColor: '#4caf50',
  },
  proteinBar: {
    backgroundColor: '#9c27b0',
  },
  fatBar: {
    backgroundColor: '#ffeb3b',
  },
});

export default NutrientSummary;