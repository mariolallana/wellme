import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { FoodTrackingService } from '../services/foodTracking.service';

const foodTrackingService = new FoodTrackingService();

// Add Food Entry
export const addFoodEntry = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    const entry = await foodTrackingService.addFoodEntry(userId, req.body);
    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
};

// Get Daily Entries
export const getDailyEntries = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    const date = new Date(req.query.date as string || new Date());
    const entries = await foodTrackingService.getDailyEntries(userId, date);
    res.json(entries);
  } catch (error) {
    next(error);
  }
};

// Get Daily Nutrients
export const getDailyNutrients = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    const date = new Date(req.query.date as string || new Date());
    const nutrients = await foodTrackingService.getDailyNutrients(userId, date);
    res.json(nutrients);
  } catch (error) {
    next(error);
  }
};