// API Response Types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type UserProfile = {
  _id: string;
  email: string;
  username: string;
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