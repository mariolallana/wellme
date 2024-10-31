import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// For web development
const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/api'
  : 'http://192.168.1.100:3000/api'; // Replace with your production URL


export const api = axios.create({
  baseURL: API_URL,
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