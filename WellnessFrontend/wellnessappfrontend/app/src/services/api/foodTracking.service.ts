import { api } from './config';

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  carbohydrates: number;
  proteins: number;
  fats: number;
  time: Date;
}

export class FoodTrackingService {
  static async addFoodEntry(foodData: Partial<FoodEntry>) {
    try {
      const response = await api.post('/food-tracking/entries', foodData);
      return response.data;
    } catch (error) {
      console.error('Error adding food entry:', error);
      throw error;
    }
  }

  static async getDailyEntries(date: Date) {
    try {
      const response = await api.get('/food-tracking/entries/daily', {
        params: { date: date.toISOString() }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting daily entries:', error);
      throw error;
    }
  }

  static async getDailyNutrients(date: Date) {
    try {
      const response = await api.get('/food-tracking/nutrients/daily', {
        params: { date: date.toISOString() }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting daily nutrients:', error);
      throw error;
    }
  }
}