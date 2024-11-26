import { api } from './config';
import { UserProfile, ApiResponse, OnboardingFormData } from './apiTypes';
import { getAuthHeader } from '../../utils/auth.utils';

export class ProfileService {
  static async saveOnboardingProfile(data: OnboardingFormData): Promise<ApiResponse<UserProfile>> {
    try {
      const headers = await getAuthHeader();
      console.log('Sending onboarding data:', data);
      
      const response = await api.post('/users/profile/handle-onboarding', {
        name: data.name,
        age: Number(data.age),
        gender: data.gender,
        weight: Number(data.weight),
        height: Number(data.height),
        goal: data.goal,
        activityLevel: data.activityLevel,
        dietaryPreferences: data.dietaryPreferences
      }, { headers });
      
      console.log('Server response:', response.data);
      
      if (response.data.success && response.data.data) {
        return {
          success: true,
          data: response.data.data
        };
      }
      
      throw new Error(response.data.error || 'Failed to save profile');
    } catch (error: any) {
      console.error('Profile save error:', error.response?.data || error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to save profile'
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
  
  static async updateUserProfile(data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    try {
      const headers = await getAuthHeader();
      const response = await api.put('/users/profile', data, { headers });
      
      if (response.data.success && response.data.data) {
        return {
          success: true,
          data: response.data.data
        };
      }
      
      throw new Error(response.data.error || 'Failed to update profile');
    } catch (error: any) {
      console.error('Profile update error:', error.response?.data || error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update profile'
      };
    }
  }
}