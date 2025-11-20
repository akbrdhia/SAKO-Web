/**
 * Security Configuration for SAKO Web Application
 * Production-ready security settings and constants
 */

export const SECURITY_CONFIG = {
  // Session Configuration
  SESSION: {
    DURATION: 3600000, // 1 hour in milliseconds
    REFRESH_THRESHOLD: 300000, // Refresh 5 minutes before expiry
    STORAGE_KEY: 'sako_session',
    COOKIE_NAME: 'sako_auth',
  },

  // Password Requirements
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: false, // Optional for better UX
  },

  // Rate Limiting
  RATE_LIMIT: {
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 300000, // 5 minutes
    RESET_AFTER_SUCCESS: true,
  },

  // Token Configuration
  TOKEN: {
    ALGORITHM: 'HS256',
    ACCESS_TOKEN_EXPIRY: 3600, // 1 hour in seconds
    REFRESH_TOKEN_EXPIRY: 86400, // 24 hours in seconds
  },

  // CSRF Protection
  CSRF: {
    ENABLED: true,
    HEADER_NAME: 'X-CSRF-Token',
    COOKIE_NAME: 'csrf_token',
  },

  // CORS Settings (for API)
  CORS: {
    ALLOWED_ORIGINS: [
      'https://sako.kemenkop.go.id',
      'https://app.sako.id',
    ],
    ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'DELETE'],
    ALLOW_CREDENTIALS: true,
  },

  // Content Security Policy
  CSP: {
    DEFAULT_SRC: ["'self'"],
    SCRIPT_SRC: ["'self'", "'unsafe-inline'"],
    STYLE_SRC: ["'self'", "'unsafe-inline'"],
    IMG_SRC: ["'self'", 'data:', 'https:'],
    FONT_SRC: ["'self'"],
    CONNECT_SRC: ["'self'", 'https://api.sako.id'],
  },

  // API Configuration
  API: {
    BASE_URL: import.meta.env.VITE_API_URL || 'https://api.sako.id',
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
  },

  // 2FA Configuration
  MFA: {
    ENABLED: true,
    TYPES: ['totp', 'sms', 'email'],
    CODE_LENGTH: 6,
    CODE_EXPIRY: 300, // 5 minutes in seconds
  },

  // Audit Logging
  AUDIT: {
    LOG_FAILED_LOGINS: true,
    LOG_SUCCESSFUL_LOGINS: true,
    LOG_LOGOUT: true,
    LOG_PASSWORD_CHANGES: true,
    LOG_PROFILE_UPDATES: true,
  },
};

// Environment-specific overrides
if (import.meta.env.MODE === 'development') {
  SECURITY_CONFIG.SESSION.DURATION = 86400000; // 24 hours for dev
  SECURITY_CONFIG.RATE_LIMIT.MAX_LOGIN_ATTEMPTS = 10;
  SECURITY_CONFIG.CORS.ALLOWED_ORIGINS.push('http://localhost:5173');
}

// Security headers configuration for production
export const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};
