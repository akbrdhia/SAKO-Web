/**
 * Base API Service
 * Handles all HTTP requests to backend API
 */

import axios from 'axios';
import { ENV } from '../config/env';

// Create axios instance
const apiClient = axios.create({
  baseURL: ENV.API.BASE_URL,
  timeout: ENV.API.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Request interceptor
 * Adds auth token to requests
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get token from session storage
    const sessionStr = sessionStorage.getItem('sako_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session.token) {
          config.headers.Authorization = `Bearer ${session.token}`;
        }
      } catch (error) {
        console.error('Error parsing session:', error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handles common response errors
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return response data directly
    return response.data;
  },
  (error) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear session and redirect to login
          sessionStorage.removeItem('sako_session');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
          
        case 403:
          // Forbidden - user doesn't have access
          console.error('Access forbidden:', data.message);
          break;
          
        case 404:
          // Not found
          console.error('Resource not found:', data.message);
          break;
          
        case 422:
          // Validation error
          console.error('Validation error:', data.errors);
          break;
          
        case 500:
          // Server error
          console.error('Server error:', data.message);
          break;
          
        default:
          console.error('API error:', data.message);
      }
      
      // Return standardized error
      return Promise.reject({
        status,
        message: data.message || 'Terjadi kesalahan',
        errors: data.errors || null,
        success: false,
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response from server:', error.message);
      return Promise.reject({
        status: 0,
        message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
        errors: null,
        success: false,
      });
    } else {
      // Something happened in setting up the request
      console.error('Request error:', error.message);
      return Promise.reject({
        status: 0,
        message: error.message || 'Terjadi kesalahan',
        errors: null,
        success: false,
      });
    }
  }
);

/**
 * API Service Methods
 */
export const apiService = {
  /**
   * GET request
   */
  get: (url, config = {}) => {
    return apiClient.get(url, config);
  },

  /**
   * POST request
   */
  post: (url, data = {}, config = {}) => {
    return apiClient.post(url, data, config);
  },

  /**
   * PUT request
   */
  put: (url, data = {}, config = {}) => {
    return apiClient.put(url, data, config);
  },

  /**
   * PATCH request
   */
  patch: (url, data = {}, config = {}) => {
    return apiClient.patch(url, data, config);
  },

  /**
   * DELETE request
   */
  delete: (url, config = {}) => {
    return apiClient.delete(url, config);
  },

  /**
   * Set auth token manually
   */
  setAuthToken: (token) => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
  },

  /**
   * Clear auth token
   */
  clearAuthToken: () => {
    delete apiClient.defaults.headers.common['Authorization'];
  },
};

export default apiService;
