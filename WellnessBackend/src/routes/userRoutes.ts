import express from 'express';
import { register, login, getProfile, updateProfile, deleteUser } from '../controllers/userController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.delete('/profile', deleteUser);

export { router as userRouter };
