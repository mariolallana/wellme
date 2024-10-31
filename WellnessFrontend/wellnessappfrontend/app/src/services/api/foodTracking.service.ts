import { api } from './config';
import { FoodEntry, ApiResponse, DailyNutrients } from './types';

export class FoodTrackingService {
  static async addFoodEntry(foodData: Partial<FoodEntry>): Promise<ApiResponse<FoodEntry>> {
    try {
      const response = await api.post('/food-tracking/entries', foodData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error adding food entry:', error);
      return {
        success: false,
        error: 'Failed to add food entry'
      };
    }
  }

  static async getDailyEntries(date: Date): Promise<ApiResponse<FoodEntry[]>> {
    try {
      const response = await api.get(`/food-tracking/entries/daily?date=${date}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add this line
        }
      });
      return response.data;
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
      const response = await api.get('/food-tracking/nutrients/daily', {
        params: { date: date.toISOString() }
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