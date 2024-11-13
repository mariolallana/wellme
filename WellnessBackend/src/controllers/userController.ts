import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// Register User
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      res.status(400).json({ message: 'Email or username already exists' });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
};

// Login User response should also return username instead of name
// Login User
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    
    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    
    // Ensure we send the complete user data with correct profile structure
    const userData = {
      _id: user._id,
      email: user.email,
      username: user.username,
      profile: {
        age: user.profile?.age || 0,
        gender: user.profile?.gender || '',
        weight: user.profile?.weight || 0,
        height: user.profile?.height || 0,
        goal: user.profile?.goal || '',
        activityLevel: user.profile?.activityLevel || '',
        onboardingCompleted: user.profile?.onboardingCompleted || false
      }
    };

    console.log('Sending user data:', userData); // Debug log
    
    res.json({ 
      token,
      user: userData
    });
  } catch (error) {
    next(error);
  }
};

// Get Profile
export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    console.log('Attempting to fetch profile for userId:', userId);
    
    const user = await User.findById(userId).select('-password');
    console.log('Found user:', user);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    next(error);
  }
};

// Update Profile
export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { username, email, profile } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { username, email, profile },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Delete User
export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.body; // Assuming userId is passed in the body
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const saveOnboardingProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { username, age, gender, weight, height, goal, activityLevel } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        username,
        profile: {
          age: Number(age),
          gender,
          weight: Number(weight),
          height: Number(height),
          goal,
          activityLevel,
          onboardingCompleted: true
        }
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};