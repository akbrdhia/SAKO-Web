/**
 * Authentication Service
 * Handles authentication operations with backend API integration
 */

import { apiService } from './apiService';
import { ENV, logger } from '../config/env';

const SESSION_KEY = 'sako_session';
const SESSION_DURATION = ENV.AUTH.SESSION_DURATION;
const MAX_LOGIN_ATTEMPTS = ENV.AUTH.MAX_LOGIN_ATTEMPTS;
const LOCKOUT_DURATION = ENV.AUTH.LOCKOUT_DURATION;

// Generate CSRF token (for local session tracking)
const generateCSRFToken = () => {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  // Fallback for dev
  return Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

// Encrypt sensitive data before storing (simplified for demo)
const encryptData = (data) => {
  try {
    return btoa(JSON.stringify(data));
  } catch (error) {
    console.error('Encryption failed:', error);
    return null;
  }
};

// Decrypt sensitive data (simplified for demo)
const decryptData = (encryptedData) => {
  try {
    return JSON.parse(atob(encryptedData));
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};

// Store session securely
const storeSession = (sessionData) => {
  try {
    const encrypted = encryptData(sessionData);
    if (encrypted) {
      sessionStorage.setItem(SESSION_KEY, encrypted);
      
      // Also set a secure cookie flag (in production, use httpOnly cookies)
      document.cookie = `sako_auth=true; path=/; secure; samesite=strict; max-age=${SESSION_DURATION / 1000}`;
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to store session:', error);
    return false;
  }
};

// Get current session
const getCurrentSession = () => {
  try {
    const encrypted = sessionStorage.getItem(SESSION_KEY);
    if (!encrypted) return null;
    
    const session = decryptData(encrypted);
    
    // Validate session integrity
    if (!session || !session.token || !session.user || !session.expiresAt) {
      return null;
    }
    
    // Check if session expired
    if (Date.now() >= session.expiresAt) {
      clearSession();
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Failed to get session:', error);
    return null;
  }
};

// Clear session
const clearSession = () => {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(`${SESSION_KEY}_refresh`);
  document.cookie = 'sako_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

// Rate limiting check
const checkRateLimit = (identifier) => {
  const rateLimitKey = `rate_limit_${identifier}`;
  const attempts = JSON.parse(localStorage.getItem(rateLimitKey) || '[]');
  const now = Date.now();
  
  // Remove old attempts (older than lockout duration)
  const recentAttempts = attempts.filter(timestamp => now - timestamp < LOCKOUT_DURATION);
  
  if (recentAttempts.length >= MAX_LOGIN_ATTEMPTS) {
    return {
      allowed: false,
      remainingTime: LOCKOUT_DURATION - (now - recentAttempts[0])
    };
  }
  
  return { allowed: true };
};

// Record login attempt
const recordLoginAttempt = (identifier) => {
  const rateLimitKey = `rate_limit_${identifier}`;
  const attempts = JSON.parse(localStorage.getItem(rateLimitKey) || '[]');
  attempts.push(Date.now());
  localStorage.setItem(rateLimitKey, JSON.stringify(attempts));
};

// Clear login attempts on successful login
const clearLoginAttempts = (identifier) => {
  const rateLimitKey = `rate_limit_${identifier}`;
  localStorage.removeItem(rateLimitKey);
};

// Validate password strength
const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
    hasMinLength: password.length >= minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar
  };
};

// Main authentication service
export const authService = {
  /**
   * Login user with email and password
   */
  login: async (email, password) => {
    try {
      // Rate limiting check
      const rateLimitCheck = checkRateLimit(email);
      if (!rateLimitCheck.allowed) {
        return {
          success: false,
          message: `Terlalu banyak percobaan login. Silakan coba lagi dalam ${Math.ceil(rateLimitCheck.remainingTime / 60000)} menit.`
        };
      }
      
      // Call backend API
      const response = await apiService.post('/auth/login', {
        email: email.trim(),
        password
      });
      
      // Backend returns: { success, message, data: { user, token, token_type } }
      if (!response.success || !response.data) {
        recordLoginAttempt(email);
        return {
          success: false,
          message: response.message || 'Email atau password salah'
        };
      }
      
      // Clear failed attempts
      clearLoginAttempts(email);
      
      const { user, token } = response.data;
      
      // Generate CSRF token locally
      const csrfToken = generateCSRFToken();
      
      const now = Date.now();
      const expiresAt = now + SESSION_DURATION;
      
      // Create session data
      const sessionData = {
        token, // JWT from backend
        csrfToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.nama, // Backend uses 'nama'
          role: user.role,
          no_anggota: user.no_anggota,
          koperasi: user.koperasi
        },
        expiresAt,
        createdAt: now
      };
      
      // Store session
      const stored = storeSession(sessionData);
      
      if (!stored) {
        return {
          success: false,
          message: 'Gagal menyimpan sesi. Silakan coba lagi.'
        };
      }
      
      // Log successful login
      logger.info('Successful login:', {
        userId: user.id,
        timestamp: new Date(now).toISOString()
      });
      
      return {
        success: true,
        user: sessionData.user,
        expiresAt
      };
      
    } catch (error) {
      console.error('Login error:', error);
      recordLoginAttempt(email);
      
      return {
        success: false,
        message: error.message || 'Terjadi kesalahan saat login. Silakan coba lagi.'
      };
    }
  },
  
  /**
   * Logout user
   */
  logout: async () => {
    const session = getCurrentSession();
    if (session) {
      try {
        // Call backend API to invalidate token
        await apiService.post('/auth/logout');
        
        logger.info('User logged out:', {
          userId: session.user.id,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Logout error:', error);
        // Continue with local logout even if API call fails
      }
    }
    
    clearSession();
  },
  
  /**
   * Get current session
   */
  getCurrentSession,
  
  /**
   * Get current user from backend
   */
  getCurrentUser: async () => {
    try {
      const response = await apiService.get('/auth/me');
      
      if (!response.success || !response.data) {
        return null;
      }
      
      return response.data; // User data from backend
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },
  
  /**
   * Refresh access token
   */
  refreshToken: async () => {
    try {
      const currentSession = getCurrentSession();
      if (!currentSession) return null;
      
      // Call backend API to refresh token
      const response = await apiService.post('/auth/refresh');
      
      if (!response.success || !response.data) {
        clearSession();
        return null;
      }
      
      const { token } = response.data;
      const now = Date.now();
      const newExpiresAt = now + SESSION_DURATION;
      
      const newSession = {
        ...currentSession,
        token, // New JWT from backend
        expiresAt: newExpiresAt
      };
      
      storeSession(newSession);
      
      logger.info('Token refreshed successfully');
      
      return newSession;
    } catch (error) {
      console.error('Token refresh error:', error);
      clearSession();
      return null;
    }
  },
  
  /**
   * Update session data
   */
  updateSession: (updates) => {
    const session = getCurrentSession();
    if (!session) return false;
    
    const updatedSession = { ...session, ...updates };
    return storeSession(updatedSession);
  },
  
  /**
   * Validate password strength
   */
  validatePasswordStrength,
  
  /**
   * Get CSRF token
   */
  getCSRFToken: () => {
    const session = getCurrentSession();
    return session ? session.csrfToken : null;
  },
  
  /**
   * Verify CSRF token
   */
  verifyCSRFToken: (token) => {
    const session = getCurrentSession();
    return session && session.csrfToken === token;
  },
  
  /**
   * Change password
   */
  changePassword: async (currentPassword, newPassword, newPasswordConfirmation) => {
    try {
      const response = await apiService.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirmation
      });
      
      return {
        success: response.success,
        message: response.message
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: error.message || 'Gagal mengubah password'
      };
    }
  }
};
