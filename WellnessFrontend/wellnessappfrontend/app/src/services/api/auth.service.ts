import { api } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginResponse, ApiResponse } from './types';

export class AuthService {
  static async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await api.post<LoginResponse>('/users/login', { 
        email, 
        password 
      });
      
      const { token } = response.data;
      await AsyncStorage.setItem('token', token);
      
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
}