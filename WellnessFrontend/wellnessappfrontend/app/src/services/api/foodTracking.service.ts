import { api } from './config';
import { FoodEntry, ApiResponse, DailyNutrients } from './types';
import { getAuthHeader } from '../../utils/auth.utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class FoodTrackingService {
  private static async getAuthHeader() {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return { Authorization: `Bearer ${token}` };
  }

  static async addFoodEntry(foodData: Partial<FoodEntry>): Promise<ApiResponse<FoodEntry>> {
    try {
      const headers = await this.getAuthHeader();
      const response = await api.post('/food-tracking/entries', foodData, { headers });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Handle unauthorized error
        console.error('Unauthorized access:', error);
        return {
          success: false,
          error: 'Unauthorized access'
        };
      }
      console.error('Error adding food entry:', error);
      return {
        success: false,
        error: 'Failed to add food entry'
      };
    }
  }
  
  static async getDailyEntries(date: Date): Promise<ApiResponse<FoodEntry[]>> {
    try {
      const headers = await this.getAuthHeader();
      const response = await api.get('/food-tracking/entries/daily', {
        params: { date: date.toISOString() },
        headers
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error getting daily entries:', error);
      return {
        success: false,
        error: 'Failed to get daily entries'
      };
    }
  }

  static async getDailyNutrients(date: Date): Promise<ApiResponse<DailyNutrients>> {
    try {
      const headers = await this.getAuthHeader();
      const response = await api.get('/food-tracking/nutrients/daily', {
        params: { date: date.toISOString() },
        headers
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error getting daily nutrients:', error);
      return {
        success: false,
        error: 'Failed to get daily nutrients'
      };
    }
  }
}