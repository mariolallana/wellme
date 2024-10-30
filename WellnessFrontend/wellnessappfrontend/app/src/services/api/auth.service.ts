import { api } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class AuthService {
  static async login(email: string, password: string) {
    try {
      const response = await api.post('/users/login', { email, password });
      const { token } = response.data;
      
      // Store the token
      await AsyncStorage.setItem('token', token);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }
}