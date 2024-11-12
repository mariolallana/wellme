import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import { Onboarding } from '../screens/Onboarding';
import { RootStackParamList } from './types';
import { StatusBar } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Keeping import commented for future reference
// import AsyncStorageTest from '../screens/AsyncStorageTest';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isAuthenticated } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');
        console.log('[RootNavigator] Onboarding Completed:', onboardingCompleted);
        setHasCompletedOnboarding(onboardingCompleted === 'true');
      } catch (error) {
        console.error('[RootNavigator] Error checking onboarding state:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkOnboarding();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Keeping AsyncStorageTest screen commented for future reference
        <Stack.Screen name="AsyncStorageTest" component={AsyncStorageTest} /> */}
        { !isAuthenticated && <Stack.Screen name="Auth" component={AuthNavigator} /> }
        { isAuthenticated && !hasCompletedOnboarding && <Stack.Screen name="Onboarding" component={Onboarding} /> }
        { isAuthenticated && hasCompletedOnboarding && <Stack.Screen name="MainTabs" component={MainTabNavigator} /> }
      </Stack.Navigator>
    </>
  );
};