import { Gender, ActivityLevel, Goal, DietaryPreferences } from '../types/user.types';
import { NutrientNeeds } from '../types/nutrient.types';

interface PersonalData {
  age: number;
  gender: Gender;
  weight: number; // in kg
  height: number; // in cm
  goal: Goal;
  activityLevel: ActivityLevel;
  dietaryPreferences: DietaryPreferences;
}

export class NutrientCalculatorService {
  static calculateBMR({ age, gender, weight, height }: PersonalData): number {
    return gender === 'male'
      ? (10 * weight) + (6.25 * height) - (5 * age) + 5
      : (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }

  static calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725
    };
    return bmr * multipliers[activityLevel as keyof typeof multipliers];
  }

  static calculateDailyNeeds(data: PersonalData): NutrientNeeds {
    const bmr = this.calculateBMR(data);
    const tdee = this.calculateTDEE(bmr, data.activityLevel);
    
    let targetCalories = tdee;
    switch (data.goal) {
      case 'lose': targetCalories *= 0.8; break;
      case 'gain': targetCalories *= 1.1; break;
    }

    let macroRatios;
    if (data.dietaryPreferences.vegan) {
      macroRatios = { protein: 0.25, carbs: 0.55, fats: 0.2 }; // Vegan ratios
    } else if (data.dietaryPreferences.vegetarian) {
      macroRatios = { protein: 0.3, carbs: 0.5, fats: 0.2 }; // Vegetarian ratios
    } else if (data.dietaryPreferences.glutenFree) {
      macroRatios = { protein: 0.3, carbs: 0.45, fats: 0.25 }; // Gluten-free ratios
    } else if (data.dietaryPreferences.lowCholesterol) {
      macroRatios = { protein: 0.3, carbs: 0.45, fats: 0.25 }; // Low cholesterol ratios
    } else if (data.dietaryPreferences.diabetesFriendly) {
      macroRatios = { protein: 0.3, carbs: 0.4, fats: 0.3 }; // Diabetes-friendly ratios
    } else {
      macroRatios = { protein: 0.3, carbs: 0.45, fats: 0.25 }; // Default ratios
    }

    return {
      calories: Math.round(targetCalories),
      proteins: Math.round((targetCalories * macroRatios.protein) / 4),
      carbohydrates: Math.round((targetCalories * macroRatios.carbs) / 4),
      fats: Math.round((targetCalories * macroRatios.fats) / 9),
      fiber: Math.round(targetCalories / 1000 * 14),
      iron: data.gender === 'female' ? 18 : 8,
      calcium: 1000,
      vitaminD: 600
    };
  }
}