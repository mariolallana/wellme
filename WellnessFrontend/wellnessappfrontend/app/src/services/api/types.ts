// API Response Types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type ProfileResponse = {
  _id: string;
  email: string;
  name: string;
  profile: {
    age: number;
    gender: string;
    weight: number;
    height: number;
    goal: string;
    activityLevel: string;
    onboardingCompleted: boolean;
  };
};

export type OnboardingFormData = {
  name: string;
  age: string;
  gender: string;
  weight: string;
  height: string;
  goal: string;
  activityLevel: string;
};

export type UserProfile = {
  name: string;
  email: string;
  profile: {
    age: number;
    gender: string;
    weight: number;
    height: number;
    goal: string;
    activityLevel: string;
    onboardingCompleted: boolean;
  };
};

export type FoodEntry = {
  _id: string;  // Changed from id to _id to match MongoDB
  name: string;
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
  servingSize: number;
  servingUnit: string;
  consumedAt: Date;
};

export type DailyNutrients = {
  calories: number;
  carbohydrates: number;
  proteins: number;
  fats: number;
};

export type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
};

export interface NutrientInferenceResponse {
  calories: number;
  carbohydrates: number;
  proteins: number;
  fats: number;
  confidence: number;
}