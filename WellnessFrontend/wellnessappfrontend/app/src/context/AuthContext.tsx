import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../services/api/types';

type AuthContextType = {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  login: (token: string, userData: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (profile: UserProfile) => void;
  completeOnboarding: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const [storedToken, userDataString] = await Promise.all([
        AsyncStorage.getItem('token'),
        AsyncStorage.getItem('userData'),
      ]);

      if (storedToken && userDataString) {
        const userData = JSON.parse(userDataString);
        setToken(storedToken);
        setUser(userData);
        // Only set authenticated if user exists and has completed onboarding
        setIsAuthenticated(userData.hasCompletedOnboarding === true);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    }
  };

  const login = async (newToken: string, userData: UserProfile) => {
    try {
      console.log('Login function called with userData:', userData); // Debug log
      await Promise.all([
        AsyncStorage.setItem('token', newToken),
        AsyncStorage.setItem('userData', JSON.stringify(userData))
      ]);
      setToken(newToken);
      setUser(userData);
      console.log('User data after setting:', userData); // Debug log
      console.log('Has completed onboarding:', userData.profile.onboardingCompleted); // Debug log
      setIsAuthenticated(true); // Set this based on successful login, not onboarding status
      console.log('Authentication state:', true); // Debug log
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

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
        const updatedUser = { ...user, hasCompletedOnboarding: true };
        await updateUserProfile(updatedUser);
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
      login,
      logout,
      updateUserProfile,
      completeOnboarding
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