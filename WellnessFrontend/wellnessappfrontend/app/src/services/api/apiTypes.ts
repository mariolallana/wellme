import { NutrientNeeds } from "../../types/nutrient.types";

// API Response Types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export interface OnboardingFormData {
  name: string;
  age: number;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  goal: 'lose' | 'maintain' | 'gain';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active';
  dietaryPreferences: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    lowCholesterol: boolean;
    diabetesFriendly: boolean;
  };
}

export interface UserProfile {
  _id: string;
  email: string;
  profile: {
    name: string;
    age: number;
    gender: string;
    weight: number;
    height: number;
    goal: string;
    activityLevel: string;
  };
  nutritionalGoals: {
    dailyCalories: number;
    macronutrientRatios: {
      protein: number;
      carbs: number;
      fats: number;
    };
  };
  dietaryPreferences: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    lowCholesterol: boolean;
    diabetesFriendly: boolean;
  };
}


// Rest of the types remain unchanged
export type FoodEntry = {
  _id: string;
  name: string;
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
  servingSize: number;
  servingUnit: string;
  time: Date;
};

export type DailyNutrients = {
  calories: number;
  carbohydrates: number;
  proteins: number;
  fats: number;
  goals: {
    calories: number;
    carbohydrates: number;
    proteins: number;
    fats: number;
  };
};

export type LoginResponse = {
  token: string;
  user: UserProfile;
};


export interface NutrientInferenceResult {
  calories: number;
  carbohydrates: number;
  proteins: number;
  fats: number;
  confidence: number;
  foodLabel: string;
  imageUrl: string;
}

export interface NutrientInferenceResponse {
  success: boolean;
  data: {
    foodLabel: string;
    calories: number;
    carbohydrates: number;
    proteins: number;
    fats: number;
    confidence: number;
  };
  error?: string;
}

export interface NutritionalGoals {
  dailyCalories: number;
  macronutrientRatios: {
    protein: number;
    carbs: number;
    fats: number;
  };
}

export interface ProfileResponse {
  success: boolean;
  error?: string;
  data?: {
    nutrientNeeds: NutrientNeeds;
  };
}