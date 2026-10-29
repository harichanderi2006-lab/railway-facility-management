import axios from 'axios';

// Base API instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('railway_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for centralized error response handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If backend returns 401 Unauthorized, handle token removal
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('railway_admin_token');
      localStorage.removeItem('railway_admin_user');
    }
    return Promise.reject(error);
  }
);

export default api;
