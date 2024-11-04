import express from 'express';
import { getNutrientInference } from '../controllers/nutrientInference.controller';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

router.post('/', getNutrientInference);

export { router as nutrientInferenceRouter };