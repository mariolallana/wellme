export type Gender = 'male' | 'female';
export type Goal = 'lose' | 'maintain' | 'gain';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active';

export interface DietaryPreferences {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  lowCholesterol: boolean;
  diabetesFriendly: boolean;
}

export interface NutrientNeeds {
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
  fiber: number;
  iron: number;
  calcium: number;
  vitaminD: number;
}