import { api } from './config';
import { FoodEntry, ApiResponse, DailyNutrients } from './apiTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class FoodTrackingService {
  static async addFoodEntry(foodData: Partial<FoodEntry>, token: string): Promise<ApiResponse<FoodEntry>> {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await api.post('/food-tracking/entries', foodData, { headers });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      if (error.response?.status === 401) {
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

  static async getDailyEntries(date: Date, token: string): Promise<ApiResponse<FoodEntry[]>> {
    try {
      const headers = { Authorization: `Bearer ${token}` };
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

  static async getDailyNutrients(date: Date, token: string): Promise<ApiResponse<DailyNutrients>> {
    try {
      const headers = { Authorization: `Bearer ${token}` };
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