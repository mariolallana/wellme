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
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);