import { api } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginResponse, ApiResponse, UserProfile } from './apiTypes';

export class AuthService {
  static async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await api.post<LoginResponse>('/users/login', { 
        email, 
        password 
      });
      
      const { token, user } = response.data;
      console.log('Received user data:', user); // Debug log

      await Promise.all([
        AsyncStorage.setItem('token', token),
        AsyncStorage.setItem('userData', JSON.stringify(user))
      ]);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Invalid credentials'
      };
    }
  }

  static async register(name: string, email: string, password: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.post('/users/register', {
        username: name,  // match backend expectation
        email,
        password
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  }
}