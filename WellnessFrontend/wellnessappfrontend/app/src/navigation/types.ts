// src/navigation/types.ts
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';


export type RootStackParamList = {
  Auth: undefined; // Add other screens as needed
  Onboarding: undefined; // Add other screens as needed
  MainTabs: undefined; // Add other screens as needed
  AsyncStorageTest: undefined; // Add this line
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  FoodTracking: undefined;
};

// Navigation Props Types
export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = 
  NativeStackScreenProps<AuthStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = 
  BottomTabScreenProps<MainTabParamList, T>;