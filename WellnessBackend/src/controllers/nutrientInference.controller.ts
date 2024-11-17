// In WellnessBackend/src/controllers/nutrientInference.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';

import { NutrientInferenceService } from '../services/nutrientInference.service';

const nutrientInferenceService = new NutrientInferenceService();

export const getNutrientInference = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { description, image } = req.body;
    
    if (!description && !image) {
      res.status(400).json({ 
        success: false, 
        message: 'Either food description or image is required' 
      });
      return;
    }

    const nutrients = await nutrientInferenceService.inferNutrients(
      image || description,
      !!image
    );

    res.json({
      success: true,
      data: nutrients
    });
  } catch (error) {
    next(error);
  }
};