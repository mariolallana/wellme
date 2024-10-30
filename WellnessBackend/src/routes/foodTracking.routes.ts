import express from 'express';
import { addFoodEntry, getDailyEntries, getDailyNutrients } from '../controllers/foodTracking.controller';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

router.post('/entries', addFoodEntry);
router.get('/entries/daily', getDailyEntries);
router.get('/nutrients/daily', getDailyNutrients);

export { router as foodTrackingRouter };