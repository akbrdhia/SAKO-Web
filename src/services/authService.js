/**
 * Authentication Service
 * Handles secure authentication operations with encryption, token management,
 * and security best practices for production environment
 */

const SESSION_KEY = 'sako_session';
const SESSION_DURATION = 3600000; // 1 hour in milliseconds
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 300000; // 5 minutes

// Simulated secure password hashing (In production, use backend API with bcrypt)
const hashPassword = async (password) => {
  // This is a simplified version. In production, this should be done on the backend
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Simulated user database (In production, this would be backend API calls)
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@sako.id',
    username: 'admin',
    passwordHash: null, // Will be set on first call
    name: 'Administrator',
    role: 'admin',
    mfaEnabled: false
  },
  {
    id: '2',
    email: 'user@sako.id',
    username: 'user',
    passwordHash: null,
    name: 'User Demo',
    role: 'user',
    mfaEnabled: false
  }
];

// Initialize password hashes
const initializeUsers = async () => {
  if (!MOCK_USERS[0].passwordHash) {
    MOCK_USERS[0].passwordHash = await hashPassword('Admin123!');
    MOCK_USERS[1].passwordHash = await hashPassword('User123!');
  }
};

// Generate secure random token
const generateToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Generate CSRF token
const generateCSRFToken = () => {
  return generateToken();
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
   * Login user with email/username and password
   */
  login: async (emailOrUsername, password) => {
    try {
      // Initialize users if needed
      await initializeUsers();
      
      // Rate limiting check
      const rateLimitCheck = checkRateLimit(emailOrUsername);
      if (!rateLimitCheck.allowed) {
        return {
          success: false,
          message: `Terlalu banyak percobaan login. Silakan coba lagi dalam ${Math.ceil(rateLimitCheck.remainingTime / 60000)} menit.`
        };
      }
      
      // Input sanitization
      const sanitizedInput = emailOrUsername.trim().toLowerCase();
      
      // Find user
      const user = MOCK_USERS.find(u => 
        u.email.toLowerCase() === sanitizedInput || 
        u.username.toLowerCase() === sanitizedInput
      );
      
      if (!user) {
        recordLoginAttempt(emailOrUsername);
        return {
          success: false,
          message: 'Email/Username atau password salah'
        };
      }
      
      // Verify password
      const passwordHash = await hashPassword(password);
      if (passwordHash !== user.passwordHash) {
        recordLoginAttempt(emailOrUsername);
        return {
          success: false,
          message: 'Email/Username atau password salah'
        };
      }
      
      // Clear failed attempts
      clearLoginAttempts(emailOrUsername);
      
      // Generate tokens
      const accessToken = generateToken();
      const refreshToken = generateToken();
      const csrfToken = generateCSRFToken();
      
      const now = Date.now();
      const expiresAt = now + SESSION_DURATION;
      
      // Create session data (exclude sensitive info)
      const sessionData = {
        token: accessToken,
        refreshToken,
        csrfToken,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          role: user.role,
          mfaEnabled: user.mfaEnabled
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
      
      // Store refresh token separately (more persistent)
      localStorage.setItem(`${SESSION_KEY}_refresh`, encryptData({
        token: refreshToken,
        expiresAt: now + (SESSION_DURATION * 24) // 24 hours
      }));
      
      // Log successful login (in production, send to backend)
      console.info('Successful login:', {
        userId: user.id,
        timestamp: new Date(now).toISOString(),
        userAgent: navigator.userAgent
      });
      
      return {
        success: true,
        user: sessionData.user,
        expiresAt
      };
      
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Terjadi kesalahan saat login. Silakan coba lagi.'
      };
    }
  },
  
  /**
   * Logout user
   */
  logout: () => {
    const session = getCurrentSession();
    if (session) {
      // Log logout event (in production, send to backend)
      console.info('User logged out:', {
        userId: session.user.id,
        timestamp: new Date().toISOString()
      });
    }
    
    clearSession();
  },
  
  /**
   * Get current session
   */
  getCurrentSession,
  
  /**
   * Refresh access token
   */
  refreshToken: async () => {
    try {
      const currentSession = getCurrentSession();
      if (!currentSession) return null;
      
      const refreshTokenData = localStorage.getItem(`${SESSION_KEY}_refresh`);
      if (!refreshTokenData) return null;
      
      const { expiresAt } = decryptData(refreshTokenData);
      
      // Check if refresh token expired
      if (Date.now() >= expiresAt) {
        clearSession();
        return null;
      }
      
      // Generate new access token
      const newAccessToken = generateToken();
      const now = Date.now();
      const newExpiresAt = now + SESSION_DURATION;
      
      const newSession = {
        ...currentSession,
        token: newAccessToken,
        expiresAt: newExpiresAt
      };
      
      storeSession(newSession);
      
      return newSession;
    } catch (error) {
      console.error('Token refresh error:', error);
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
  }
};
