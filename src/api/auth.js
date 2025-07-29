import axios from 'axios';
import Cookies from 'js-cookie';

// Create axios instance with base config
const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
});

// Add request interceptor to inject token
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  // Login user
  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },

  // Get current user data
  getUser: async () => {
    const response = await api.get('/users/getUser');
    return response.data;
  },



};