// src/navigation/MainTabNavigator.tsx
import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import FoodTracking from '../screens/FoodTracking';
import { MainTabParamList } from './types';
import { Ionicons } from '@expo/vector-icons';
import LogoutButton from '../components/LogoutButton';
import { View, TouchableOpacity } from 'react-native';
import OptionsModal from '../components/OptionsModal';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);

  return (
    <>
      <View style={{ flex: 1 }}>
        <LogoutButton />
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: {
              backgroundColor: 'white',
              borderTopWidth: 1,
              borderTopColor: '#E5E5E5',
            },
            tabBarActiveTintColor: '#4CAF50',
            tabBarInactiveTintColor: '#9E9E9E',
            headerShown: false,
          }}
        >
          <Tab.Screen 
            name="Home" 
            component={Home}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen 
            name="FoodTracking" 
            component={FoodTracking}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="restaurant-outline" size={size} color={color} />
              ),
              tabBarLabel: 'Nutrition'
            }}
          />
          <Tab.Screen
            name="Options"
            component={EmptyComponent}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="menu" size={size} color={color} />
              ),
              tabBarButton: (props) => (
                <TouchableOpacity
                  {...props}
                  onPress={() => setIsOptionsVisible(true)}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </View>

      <OptionsModal
        visible={isOptionsVisible}
        onClose={() => setIsOptionsVisible(false)}
      />
    </>
  );
};

// Placeholder component
const EmptyComponent = () => null;

// Change the export to default
export default MainTabNavigator;