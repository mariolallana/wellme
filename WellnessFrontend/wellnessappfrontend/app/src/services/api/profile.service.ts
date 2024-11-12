import { api } from './config';
import { UserProfile, ApiResponse, OnboardingFormData } from './types';
import { getAuthHeader } from '../../utils/auth.utils';

export class ProfileService {
  static async saveOnboardingProfile(data: OnboardingFormData): Promise<ApiResponse<UserProfile>> {
    try {
      const headers = await getAuthHeader();
      const response = await api.post<UserProfile>('/users/profile/onboarding', data, { headers });
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
      const headers = await getAuthHeader();
      const response = await api.get<UserProfile>('/users/profile', { headers });
      
      return {
        success: true,
        data: response.data
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