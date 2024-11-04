import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { NutrientInferenceService } from '../services/nutrientInference.service';

const nutrientInferenceService = new NutrientInferenceService();

export const getNutrientInference = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { description } = req.body;
    
    if (!description) {
      res.status(400).json({ 
        success: false, 
        message: 'Food description is required' 
      });
      return;
    }

    const nutrients = await nutrientInferenceService.inferNutrients(description);
    res.json({
      success: true,
      data: nutrients
    });
  } catch (error) {
    next(error);
  }
};