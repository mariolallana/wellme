import { api } from './config';
import { ProfileResponse, UserProfile, ApiResponse } from './types';

export class ProfileService {
    static async saveOnboardingProfile(data: ProfileResponse): Promise<ApiResponse<UserProfile>> {
      try {
        const response = await api.post('/users/profile/onboarding', data);
        return {
          success: true,
          data: response.data
        };
      } catch (error) {
        console.error('Onboarding save error:', error);
        return {
          success: false,
          error: 'Failed to save profile'
        };
      }
    }
  
    static async getUserProfile(): Promise<ApiResponse<UserProfile>> {
      try {
        const response = await api.get<ProfileResponse>('/users/profile');
        return {
          success: true,
          data: {
            name: response.data.name,
            email: response.data.email,
            profile: response.data.profile
          }
        };
      } catch (error) {
        console.error('Profile fetch error:', error);
        return {
          success: false,
          error: 'Failed to fetch profile'
        };
      }
    }
}