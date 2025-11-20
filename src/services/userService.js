/**
 * User Management Service
 * Handles all user-related API calls
 */

import { apiService } from './apiService';

export const userService = {
  /**
   * Get list of users with pagination and filters
   */
  getUsers: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.koperasi_id) queryParams.append('koperasi_id', params.koperasi_id);
      if (params.role) queryParams.append('role', params.role);
      if (params.status) queryParams.append('status', params.status);
      if (params.search) queryParams.append('search', params.search);
      if (params.per_page) queryParams.append('per_page', params.per_page);
      if (params.page) queryParams.append('page', params.page);
      
      const url = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);
      
      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Gagal mengambil data user',
        data: null
      };
    }
  },

  /**
   * Get user detail by ID
   */
  getUserById: async (userId) => {
    try {
      const response = await apiService.get(`/users/${userId}`);
      
      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Gagal mengambil detail user',
        data: null
      };
    }
  },

  /**
   * Create new user
   */
  createUser: async (userData) => {
    try {
      const response = await apiService.post('/users', {
        nik: userData.nik,
        nama: userData.nama,
        alamat: userData.alamat,
        no_hp: userData.no_hp,
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.password_confirmation,
        role: userData.role
      });
      
      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Gagal membuat user baru',
        errors: error.errors,
        data: null
      };
    }
  },

  /**
   * Update user
   */
  updateUser: async (userId, userData) => {
    try {
      const response = await apiService.put(`/users/${userId}`, userData);
      
      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Gagal mengupdate user',
        errors: error.errors,
        data: null
      };
    }
  },

  /**
   * Delete user
   */
  deleteUser: async (userId) => {
    try {
      const response = await apiService.delete(`/users/${userId}`);
      
      return {
        success: response.success,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Gagal menghapus user'
      };
    }
  },

  /**
   * Suspend user
   */
  suspendUser: async (userId) => {
    try {
      const response = await apiService.put(`/users/${userId}/suspend`);
      
      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Gagal suspend user',
        data: null
      };
    }
  },

  /**
   * Activate user
   */
  activateUser: async (userId) => {
    try {
      const response = await apiService.put(`/users/${userId}/activate`);
      
      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Gagal activate user',
        data: null
      };
    }
  }
};

export default userService;
