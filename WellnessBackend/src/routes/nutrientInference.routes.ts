// In WellnessBackend/src/routes/nutrientInference.routes.ts
import express from 'express';
import { getNutrientInference } from '../controllers/nutrientInference.controller';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware if needed
router.use(authenticateUser);

// Define the route
router.post('/', getNutrientInference);

export { router as nutrientInferenceRouter };