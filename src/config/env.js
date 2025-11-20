/**
 * Environment Configuration
 * Centralized configuration management for different environments
 */

// Get environment variables with fallbacks
const getEnv = (key, defaultValue = '') => {
  return import.meta.env[key] || defaultValue;
};

const isDevelopment = import.meta.env.MODE === 'development';
const isProduction = import.meta.env.MODE === 'production';

export const ENV = {
  // Environment info
  MODE: import.meta.env.MODE,
  IS_DEV: isDevelopment,
  IS_PROD: isProduction,
  APP_NAME: getEnv('VITE_APP_NAME', 'SAKO Web'),
  
  // API Configuration
  API: {
    BASE_URL: getEnv('VITE_API_URL', 'http://localhost:3000/api'),
    TIMEOUT: parseInt(getEnv('VITE_API_TIMEOUT', '30000')),
  },
  
  // Authentication
  AUTH: {
    SESSION_DURATION: parseInt(getEnv('VITE_SESSION_DURATION', '3600000')),
    MAX_LOGIN_ATTEMPTS: parseInt(getEnv('VITE_MAX_LOGIN_ATTEMPTS', '5')),
    LOCKOUT_DURATION: parseInt(getEnv('VITE_LOCKOUT_DURATION', '300000')),
  },
  
  // Security
  SECURITY: {
    HTTPS_ONLY: getEnv('VITE_ENABLE_HTTPS_ONLY', 'false') === 'true',
    ENABLE_2FA: getEnv('VITE_ENABLE_2FA', 'false') === 'true',
    CSRF_ENABLED: getEnv('VITE_CSRF_ENABLED', 'true') === 'true',
    ALLOW_INSECURE_HASH: getEnv('VITE_ALLOW_INSECURE_HASH', 'false') === 'true',
  },
  
  // Features
  FEATURES: {
    DEV_TOOLS: getEnv('VITE_ENABLE_DEV_TOOLS', 'false') === 'true',
    CONSOLE_LOGS: getEnv('VITE_ENABLE_CONSOLE_LOGS', 'false') === 'true',
    DEBUG_MODE: getEnv('VITE_ENABLE_DEBUG_MODE', 'false') === 'true',
  },
};

// Console log helper that respects environment
export const logger = {
  log: (...args) => {
    if (ENV.FEATURES.CONSOLE_LOGS) {
      console.log(...args);
    }
  },
  warn: (...args) => {
    if (ENV.FEATURES.CONSOLE_LOGS) {
      console.warn(...args);
    }
  },
  error: (...args) => {
    // Always log errors, even in production
    console.error(...args);
  },
  debug: (...args) => {
    if (ENV.FEATURES.DEBUG_MODE) {
      console.debug(...args);
    }
  },
  info: (...args) => {
    if (ENV.FEATURES.CONSOLE_LOGS) {
      console.info(...args);
    }
  },
};

// Validate production environment
if (isProduction) {
  if (ENV.SECURITY.ALLOW_INSECURE_HASH) {
    console.error('CRITICAL: Insecure hash is enabled in production!');
  }
  if (!ENV.SECURITY.HTTPS_ONLY) {
    console.warn('WARNING: HTTPS is not enforced in production!');
  }
  if (!ENV.SECURITY.CSRF_ENABLED) {
    console.warn('WARNING: CSRF protection is disabled in production!');
  }
}

// Log environment info in development
if (isDevelopment) {
  console.log('SAKO Web - Development Mode');
  console.log('Environment:', ENV);
}

export default ENV;
