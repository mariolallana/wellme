import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { Onboarding } from '../screens/Onboarding';
import { RootStackParamList } from './types';
import { StatusBar } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
    //const isAuthenticated = false; // This will be managed by your auth state
    //const hasCompletedOnboarding = false; // This will be managed by AsyncStorage
    const isAuthenticated = true; // Temporarily set to true for testing
    const hasCompletedOnboarding = true; // This will be managed by AsyncStorage
    // You can add authentication state management here later
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
        </Stack.Navigator>
      </>
    );
  };