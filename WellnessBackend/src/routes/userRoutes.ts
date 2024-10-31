import express from 'express';
import { authenticateUser } from '../middleware/auth';
import { register, login, getProfile, updateProfile, deleteUser, saveOnboardingProfile } from '../controllers/userController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateUser, getProfile);
router.put('/profile', authenticateUser, updateProfile);
router.delete('/profile', authenticateUser, deleteUser);
router.post('/profile/onboarding', authenticateUser, saveOnboardingProfile);

export { router as userRouter };