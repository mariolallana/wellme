import { Types } from 'mongoose';
import FoodEntry, { IFoodEntry } from '../models/FoodEntry';

/**
 * Service handling food tracking operations
 */
export class FoodTrackingService {
  /**
   * Creates a new food entry for a user
   * @param userId - The ID of the user creating the entry
   * @param foodData - The food entry data (calories, nutrients, etc.)
   * @returns The created food entry
   */
  async addFoodEntry(userId: string, foodData: Partial<IFoodEntry>): Promise<IFoodEntry> {
    const newEntry = new FoodEntry({
      userId: new Types.ObjectId(userId),
      ...foodData,
      time: foodData.time || new Date(), // Default to current time if not provided
    });
    return await newEntry.save();
  }

  /**
   * Retrieves all food entries for a user within a specific day
   * @param userId - The ID of the user
   * @param date - The date to get entries for
   * @returns Array of food entries for the specified day
   */
  async getDailyEntries(userId: string, date: Date): Promise<IFoodEntry[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await FoodEntry.find({
      userId: new Types.ObjectId(userId),
      time: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ time: 'asc' });
  }

  /**
   * Calculates total nutrients for all food entries in a day
   * @param userId - The ID of the user
   * @param date - The date to calculate nutrients for
   * @returns Object containing total nutrients (calories, carbs, proteins, fats)
   */
  async getDailyNutrients(userId: string, date: Date): Promise<{
    calories: number;
    carbohydrates: number;
    proteins: number;
    fats: number;
  }> {
    const entries = await this.getDailyEntries(userId, date);
    
    return entries.reduce((acc, entry) => ({
      calories: acc.calories + (entry.calories || 0),
      carbohydrates: acc.carbohydrates + (entry.carbohydrates || 0),
      proteins: acc.proteins + (entry.proteins || 0),
      fats: acc.fats + (entry.fats || 0),
    }), {
      calories: 0,
      carbohydrates: 0,
      proteins: 0,
      fats: 0,
    });
  }

  /**
   * Updates an existing food entry
   * @param entryId - The ID of the entry to update
   * @param foodData - The updated food data
   * @returns The updated food entry
   */
  async updateFoodEntry(entryId: string, foodData: Partial<IFoodEntry>): Promise<IFoodEntry | null> {
    return await FoodEntry.findByIdAndUpdate(
      entryId,
      { $set: foodData },
      { new: true }
    );
  }

  /**
   * Deletes a food entry
   * @param entryId - The ID of the entry to delete
   * @returns True if deletion was successful
   */
  async deleteFoodEntry(entryId: string): Promise<boolean> {
    const result = await FoodEntry.deleteOne({ _id: new Types.ObjectId(entryId) });
    return result.deletedCount === 1;
  }
}