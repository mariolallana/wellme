import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { API_CONFIG } from '../services/api/api.config';

const AsyncStorageTest = () => {
  // State management
  const [value, setValue] = useState<string | null>(null);
  const [networkStatus, setNetworkStatus] = useState<string>('unknown');
  const [lastTestedFeature, setLastTestedFeature] = useState<string>('None');

  // Basic AsyncStorage Tests
  const setTestValue = async () => {
    try {
      await AsyncStorage.setItem('testKey', 'TestValue');
      setLastTestedFeature('Basic Set');
      Alert.alert('Success', 'Value set successfully.');
    } catch (error) {
      console.error('Error setting value:', error);
      Alert.alert('Error', 'Failed to set value.');
    }
  };

  const getTestValue = async () => {
    try {
      const result = await AsyncStorage.getItem('testKey');
      setValue(result);
      setLastTestedFeature('Basic Get');
      Alert.alert('Success', `Retrieved value: ${result}`);
    } catch (error) {
      console.error('Error retrieving value:', error);
      Alert.alert('Error', 'Failed to retrieve value.');
    }
  };

  // Authentication Tests
  const testAuthStorage = async () => {
    try {
      // Test token storage
      await AsyncStorage.setItem('userToken', 'test-token-123');
      const token = await AsyncStorage.getItem('userToken');
      
      // Test user data storage
      const mockUserData = {
        id: '123',
        email: 'test@test.com',
        name: 'Test User'
      };
      await AsyncStorage.setItem('userData', JSON.stringify(mockUserData));
      
      setLastTestedFeature('Auth Storage');
      Alert.alert('Auth Test', `Token stored and retrieved: ${token}`);
    } catch (error) {
      Alert.alert('Error', 'Auth storage test failed');
    }
  };

  const testApiConnection = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/health`);
      const data = await response.json();
      setLastTestedFeature('API Connection');
      Alert.alert('API Test', `Connection successful: ${JSON.stringify(data)}`);
    } catch (error) {
      console.error('API Connection Error:', error as Error); // Log the error for more details
      Alert.alert('API Error', `Connection failed: ${(error as Error).message}`);
    }
  };

  // Onboarding Data Tests
  const testOnboardingStorage = async () => {
    try {
      const mockOnboardingData = {
        name: 'Test User',
        age: '25',
        gender: 'male',
        weight: '70',
        height: '175',
        goal: 'weight_loss',
        activityLevel: 'moderate'
      };
      await AsyncStorage.setItem('onboardingData', JSON.stringify(mockOnboardingData));
      const stored = await AsyncStorage.getItem('onboardingData');
      setLastTestedFeature('Onboarding Storage');
      Alert.alert('Onboarding Test', `Data stored successfully: ${stored}`);
    } catch (error) {
      Alert.alert('Error', 'Onboarding storage test failed');
    }
  };

  // Food Tracking Tests
  const testFoodTrackingStorage = async () => {
    try {
      const mockFoodEntry = {
        _id: 'test123',
        name: 'Test Food',
        calories: 200,
        proteins: 10,
        carbohydrates: 25,
        fats: 8,
        servingSize: 100,
        servingUnit: 'g',
        consumedAt: new Date().toISOString()
      };
      await AsyncStorage.setItem('lastFoodEntry', JSON.stringify(mockFoodEntry));
      const stored = await AsyncStorage.getItem('lastFoodEntry');
      setLastTestedFeature('Food Tracking Storage');
      Alert.alert('Food Tracking Test', `Entry stored successfully: ${stored}`);
    } catch (error) {
      Alert.alert('Error', 'Food tracking storage test failed');
    }
  };

  // Clear All Data Test
  const testClearStorage = async () => {
    try {
      await AsyncStorage.clear();
      setLastTestedFeature('Storage Cleared');
      Alert.alert('Success', 'All storage cleared successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear storage');
    }
  };

  // User Registration Test
  const testUserRegistration = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'Irene Martinez',
          email: 'ireneMartinez@test.com',
          password: 'password123456'
        }),
      });
  
      const responseBody = await response.text();
      console.log('Response Status:', response.status);
      console.log('Response Body:', responseBody);
  
      if (!response.ok) {
        const errorData = JSON.parse(responseBody);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
  
      const data = JSON.parse(responseBody);
      setLastTestedFeature('User Registration');
      Alert.alert('Registration Test', `Registration successful: ${JSON.stringify(data)}`);
    } catch (error) {
      console.error('User Registration Error:', error);
      Alert.alert('Registration Error', `Failed to register: ${(error as Error).message}`);
    }
  };

// User Login Test
const testUserLogin = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'ireneMartinez@test.com',
        password: 'password123456',
      }),
    });
    const data = await response.json();
    if (data.token) {
      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(data.user));
    }
    setLastTestedFeature('User Login');
    Alert.alert('Login Test', `Login successful: ${JSON.stringify(data)}`);
  } catch (error) {
    console.error('User Login Error:', error);
    Alert.alert('Login Error', `Failed to log in: ${(error as Error).message}`);
  }
};

// Fetch User Profile Test
const testFetchUserProfile = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error('No token found. Please login first.');
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    setLastTestedFeature('Fetch User Profile');
    Alert.alert('Profile Test', `Profile fetched: ${JSON.stringify(data)}`);
  } catch (error) {
    console.error('Fetch Profile Error:', error);
    Alert.alert('Profile Error', `Failed to fetch profile: ${(error as Error).message}`);
  }
};

const testUpdateUserProfile = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error('No token found. Please login first.');
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'UpdatedUsername',
        email: 'updated.email@test.com',
        profile: {
          age: 30,
          gender: 'female',
          weight: 65,
          height: 170,
          goal: 'maintain',
          activityLevel: 'moderate',
          onboardingCompleted: true
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setLastTestedFeature('Update User Profile');
    Alert.alert('Update Profile Test', `Profile updated: ${JSON.stringify(data)}`);
  } catch (error) {
    console.error('Update Profile Error:', error);
    Alert.alert('Update Profile Error', `Failed to update profile: ${(error as Error).message}`);
  }
};

// Delete User Test
const testDeleteUser = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const userData = await AsyncStorage.getItem('userData');
    if (!token || !userData) {
      throw new Error('No token or user data found. Please login first.');
    }

    const user = JSON.parse(userData);
    const response = await fetch(`${API_CONFIG.BASE_URL}/users/profile`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    await AsyncStorage.multiRemove(['userToken', 'userData']);
    setLastTestedFeature('Delete User');
    Alert.alert('Delete User Test', 'User deleted successfully');
  } catch (error) {
    console.error('Delete User Error:', error);
    Alert.alert('Delete User Error', `Failed to delete user: ${(error as Error).message}`);
    }
  };


  const testAddFoodEntry = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No token found. Please login first.');
      }
  
      const response = await fetch(`${API_CONFIG.BASE_URL}/food-tracking/entries`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test Food',
          calories: 300,
          proteins: 15,
          carbohydrates: 40,
          fats: 10
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setLastTestedFeature('Add Food Entry');
      Alert.alert('Food Entry Test', `Entry added: ${JSON.stringify(data)}`);
    } catch (error) {
      console.error('Food Entry Error:', error);
      Alert.alert('Food Entry Error', `Failed to add food entry: ${(error as Error).message}`);
    }
  };
  
  const testGetDailyNutrients = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No token found. Please login first.');
      }
  
      const response = await fetch(`${API_CONFIG.BASE_URL}/food-tracking/nutrients/daily`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setLastTestedFeature('Get Daily Nutrients');
      Alert.alert('Daily Nutrients Test', `Nutrients retrieved: ${JSON.stringify(data)}`);
    } catch (error) {
      console.error('Daily Nutrients Error:', error);
      Alert.alert('Daily Nutrients Error', `Failed to get nutrients: ${(error as Error).message}`);
    }
  };

  // Network Status Monitoring
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfo.NetInfoState) => { // Explicitly typing 'state'
      setNetworkStatus(
        `Type: ${state.type}, Connected: ${state.isConnected ? 'Yes' : 'No'}`
      );
    });
    return () => unsubscribe();
  }, []);

  // Initial Load
  useEffect(() => {
    const fetchValue = async () => {
      const initialValue = await AsyncStorage.getItem('testKey');
      setValue(initialValue);
    };
    fetchValue();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>AsyncStorage Test Dashboard</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Status Information</Text>
        <Text>Network Status: {networkStatus}</Text>
        <Text>Last Tested Feature: {lastTestedFeature}</Text>
        <Text>Current Test Value: {value}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Basic Tests</Text>
        <Text style={styles.description}>
          Tests basic read/write operations to device storage:
          {'\n'}- Set: Stores "TestValue" under key "testKey"
          {'\n'}- Get: Retrieves value stored under "testKey"
        </Text>
        <Button title="Set Test Value" onPress={setTestValue} />
        <Button title="Get Test Value" onPress={getTestValue} />
        <Text style={styles.testResult}>
          ✓ Pass: If alert shows "Value set/retrieved successfully"
          {'\n'}✗ Fail: If alert shows "Failed to set/retrieve value"
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Authentication Tests</Text>
        <Text style={styles.description}>
          Tests storage of auth-related data:
          {'\n'}- Stores mock token and user data
          {'\n'}- Tests API health endpoint connection
        </Text>
        <Button title="Test Auth Storage" onPress={testAuthStorage} />
        <Button title="Test API Connection" onPress={testApiConnection} />
        <Text style={styles.testResult}>
          ✓ Pass: If alerts show successful storage/connection
          {'\n'}✗ Fail: If alerts show storage/connection errors
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Feature Tests</Text>
        <Text style={styles.description}>
          Tests storage of app-specific data:
          {'\n'}- Onboarding: User profile data storage
          {'\n'}- Food Tracking: Food entry data storage
        </Text>
        <Button title="Test Onboarding Storage" onPress={testOnboardingStorage} />
        <Button title="Test Food Tracking" onPress={testFoodTrackingStorage} />
        <Text style={styles.testResult}>
          ✓ Pass: If alerts show data stored successfully
          {'\n'}✗ Fail: If alerts show storage failed
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Maintenance</Text>
        <Text style={styles.description}>
          Clears all stored data from AsyncStorage
          {'\n'}Warning: This will reset all storage tests
        </Text>
        <Button title="Clear All Storage" onPress={testClearStorage} />
        <Text style={styles.testResult}>
          ✓ Pass: If alert shows "All storage cleared successfully"
          {'\n'}✗ Fail: If alert shows "Failed to clear storage"
        </Text>
      </View>

      <View style={styles.section}>
    <Text style={styles.sectionHeader}>User Tests</Text>
    <Text style={styles.description}>
        Tests user-related operations:
        {'\n'}- Registration: Creates a new user account
        {'\n'}- Login: Authenticates the user
        {'\n'}- Fetch Profile: Retrieves the user's profile information
        {'\n'}- Update Profile: Updates the user's profile information
        {'\n'}- Delete User: Deletes the user account
    </Text>
    <Button title="Test User Registration" onPress={testUserRegistration} />
    <Button title="Test User Login" onPress={testUserLogin} />
    <Button title="Test Fetch User Profile" onPress={testFetchUserProfile} />
    <Button title="Test Update User Profile" onPress={testUpdateUserProfile} />
    <Button title="Test Delete User" onPress={testDeleteUser} />
    <Text style={styles.testResult}>
        ✓ Pass: If alerts show successful registration/login/profile fetch/update/delete
        {'\n'}✗ Fail: If alerts show errors during any of the operations
        </Text>
      </View>

      <View style={styles.section}>
  <Text style={styles.sectionHeader}>Food Tracking Tests</Text>
  <Text style={styles.description}>
    Tests food tracking functionality:
    {'\n'}- Add food entry
    {'\n'}- Get daily nutrients
  </Text>
  <Button title="Test Add Food Entry" onPress={testAddFoodEntry} />
  <Button title="Test Get Daily Nutrients" onPress={testGetDailyNutrients} />
  <Text style={styles.testResult}>
    ✓ Pass: If alerts show successful operations
    {'\n'}✗ Fail: If alerts show any errors
        </Text>
      </View> 


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  testResult: {
    fontSize: 12,
    color: '#888',
    marginTop: 10,
    fontStyle: 'italic',
  },
});

export default AsyncStorageTest;