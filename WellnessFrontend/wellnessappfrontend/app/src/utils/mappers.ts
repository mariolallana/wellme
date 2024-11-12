import { LoginResponse, UserProfile } from '../services/api/types';

export const mapLoginResponseToUserProfile = (user: LoginResponse['user']): UserProfile => ({
  _id: user.id,
  email: user.email,
  name: user.name,
  profile: {
    age: 0,
    gender: '',
    weight: 0,
    height: 0,
    goal: '',
    activityLevel: '',
    onboardingCompleted: false
  }
});