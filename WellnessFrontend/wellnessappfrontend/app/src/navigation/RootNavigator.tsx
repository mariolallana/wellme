import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import { Onboarding } from '../screens/Onboarding';
import { RootStackParamList } from './types';
import { StatusBar } from 'react-native';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

//  Keeping AsyncStorageTest screen commented for future reference
// <Stack.Screen name="AsyncStorageTest" component={AsyncStorageTest} /> */}

export const RootNavigator = () => {
  const { isAuthenticated, hasCompletedOnboarding } = useAuth();

  // Add a console log to check the onboarding status
  useEffect(() => {
    console.log('Onboarding Completed:', hasCompletedOnboarding);
  }, [hasCompletedOnboarding]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated && (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
        {isAuthenticated && !hasCompletedOnboarding && (
          <Stack.Screen name="Onboarding" component={Onboarding} />
        )}
        {isAuthenticated && hasCompletedOnboarding && (
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        )}
      </Stack.Navigator>
    </>
  );
};