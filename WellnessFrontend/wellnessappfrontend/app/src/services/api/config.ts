import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from './api.config';

export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: true,
  headers: {
      'Content-Type': 'application/json',
  },
});


// Add a request interceptor to include the auth token
api.interceptors.request.use(
    async (config) => {
      const token = await AsyncStorage.getItem('token');
      console.log('Sending request with token:', token);
      if (token) {
        // Make sure we're using the correct format
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Authorization header:', config.headers.Authorization);
      }
      return config;
    },
    (error) => {
      console.error('Interceptor error:', error);
      return Promise.reject(error);
    }
  );

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
      console.error('API Error:', error.response?.data || error.message);
      return Promise.reject(error);
  }
);