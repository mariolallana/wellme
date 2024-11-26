import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import Onboarding from '../screens/Onboarding';
import { RootStackParamList } from './types';
import { StatusBar } from 'react-native';
import { useAuth } from '../context/AuthContext';
import NutritionPreferences from './NutritionPreferences';

const Stack = createNativeStackNavigator<RootStackParamList>();

//  Keeping AsyncStorageTest screen commented for future reference
// <Stack.Screen name="AsyncStorageTest" component={AsyncStorageTest} /> */}

const RootNavigator = () => {
  const { isAuthenticated, hasCompletedOnboarding } = useAuth();

  useEffect(() => {
    console.log('Auth State:', { isAuthenticated, hasCompletedOnboarding });
  }, [isAuthenticated, hasCompletedOnboarding]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : !hasCompletedOnboarding ? (
          <Stack.Screen name="Onboarding" component={Onboarding} />
        ) : (
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        )}
        <Stack.Screen 
          name="NutritionPreferences" 
          component={NutritionPreferences}
          options={{
            title: 'Nutrition Preferences',
            headerShown: true,
          }}
        />
      </Stack.Navigator>
    </>
  );
};

export default RootNavigator;

