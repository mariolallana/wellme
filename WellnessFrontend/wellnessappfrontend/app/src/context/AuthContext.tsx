import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../services/api/apiTypes';
import { API_CONFIG } from '../services/api/api.config';

type AuthContextType = {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  hasCompletedOnboarding: boolean;
  login: (token: string, userData: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (profile: UserProfile) => void;
  completeOnboarding: () => Promise<void>;
  getToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const login = async (newToken: string, userData: UserProfile) => {
    try {
      console.log('Raw login data received:', userData);
  
      // Fetch user data from the API using the new token
      const fetchedUserData = await fetchUserData(newToken);
  
      await Promise.all([
        AsyncStorage.setItem('token', newToken),
        AsyncStorage.setItem('userData', JSON.stringify(fetchedUserData))
      ]);
  
      setToken(newToken);
      setUser(fetchedUserData);
      setIsAuthenticated(true);
      setHasCompletedOnboarding(fetchedUserData.profile.onboardingCompleted);
  
      console.log('Final auth state:', {
        isAuthenticated: true,
        hasCompletedOnboarding: fetchedUserData.profile.onboardingCompleted,
        user: fetchedUserData
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

// Example function to fetch user data from the API
const fetchUserData = async (token: string): Promise<UserProfile> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/users/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    return await response.json();
  } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  const initializeAuth = async () => {
    try {
      const [storedToken, userDataString] = await Promise.all([
        AsyncStorage.getItem('token'),
        AsyncStorage.getItem('userData'),
      ]);
  
      if (storedToken && userDataString) {
        const userData = JSON.parse(userDataString);
        console.log('Loaded user data:', userData);
        
        // Check if the token is valid (you might want to add a function to validate the token)
        if (isTokenValid(storedToken)) { // {{ edit_1 }}
          const onboardingStatus = userData.profile?.onboardingCompleted || false;
          console.log('Loaded onboarding status:', onboardingStatus);
          
          setToken(storedToken);
          setUser(userData);
          setIsAuthenticated(true);
          setHasCompletedOnboarding(onboardingStatus);
        } else {
          // If the token is invalid, clear the stored data
          await logout(); // {{ edit_2 }}
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    }
  };

  const getToken = async (): Promise<string | null> => {
    return await AsyncStorage.getItem('token');
  };
  
  const isTokenValid = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode the JWT payload
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      return payload.exp > currentTime; // Check if the token is still valid
    } catch (error) {
      console.error('Token validation error:', error);
      return false; // If there's an error, consider the token invalid
    }
  }; // {{ edit_1 }}

  const logout = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('token'),
        AsyncStorage.removeItem('userData')
      ]);
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateUserProfile = (profile: UserProfile) => {
    setUser(profile);
    AsyncStorage.setItem('userData', JSON.stringify(profile));
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      if (user) {
        const updatedUser = {
          ...user,
          profile: {
            ...user.profile,
            onboardingCompleted: true
          }
        };
        await updateUserProfile(updatedUser);
        setHasCompletedOnboarding(true);
      }
    } catch (error) {
      console.error('Onboarding completion error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      token,
      hasCompletedOnboarding,
      login,
      logout,
      updateUserProfile,
      completeOnboarding,
      getToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};