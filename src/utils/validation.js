/**
 * Input validation utilities
 * Provides secure validation for various input types
 */

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const trimmedEmail = email.trim();
  
  // Basic format check
  if (!emailRegex.test(trimmedEmail)) {
    return false;
  }
  
  // Additional checks
  if (trimmedEmail.length > 254) {
    return false;
  }
  
  const [localPart, domain] = trimmedEmail.split('@');
  
  if (localPart.length > 64 || domain.length > 253) {
    return false;
  }
  
  return true;
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      errors: ['Password tidak valid']
    };
  }
  
  const errors = [];
  const minLength = 8;
  const maxLength = 128;
  
  // Length check
  if (password.length < minLength) {
    errors.push(`Password minimal ${minLength} karakter`);
  }
  
  if (password.length > maxLength) {
    errors.push(`Password maksimal ${maxLength} karakter`);
  }
  
  // Complexity checks
  if (!/[A-Z]/.test(password)) {
    errors.push('Password harus mengandung minimal 1 huruf besar');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password harus mengandung minimal 1 huruf kecil');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password harus mengandung minimal 1 angka');
  }
  
  // Check for common patterns
  const commonPatterns = [
    /^12345/,
    /password/i,
    /qwerty/i,
    /admin/i,
    /^(.)\1{5,}/, // Repeated characters
  ];
  
  if (commonPatterns.some(pattern => pattern.test(password))) {
    errors.push('Password terlalu umum atau mudah ditebak');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get password strength score
 */
export const getPasswordStrength = (password) => {
  if (!password) {
    return {
      score: 0,
      label: 'Tidak ada',
      color: 'gray'
    };
  }
  
  let score = 0;
  
  // Length scoring
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // Character variety
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  
  // Penalty for common patterns
  if (/^12345/.test(password) || /password/i.test(password)) {
    score = Math.max(0, score - 2);
  }
  
  // Normalize to 0-4 scale
  const normalizedScore = Math.min(4, Math.floor((score / 7) * 4));
  
  const strengthMap = {
    0: { label: 'Sangat Lemah', color: 'red' },
    1: { label: 'Lemah', color: 'orange' },
    2: { label: 'Cukup', color: 'yellow' },
    3: { label: 'Kuat', color: 'green' },
    4: { label: 'Sangat Kuat', color: 'green' }
  };
  
  return {
    score: normalizedScore,
    ...strengthMap[normalizedScore]
  };
};

/**
 * Validate username
 */
export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') {
    return {
      isValid: false,
      error: 'Username tidak valid'
    };
  }
  
  const trimmedUsername = username.trim();
  
  // Length check
  if (trimmedUsername.length < 3) {
    return {
      isValid: false,
      error: 'Username minimal 3 karakter'
    };
  }
  
  if (trimmedUsername.length > 30) {
    return {
      isValid: false,
      error: 'Username maksimal 30 karakter'
    };
  }
  
  // Format check (alphanumeric, underscore, hyphen)
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmedUsername)) {
    return {
      isValid: false,
      error: 'Username hanya boleh berisi huruf, angka, underscore, dan hyphen'
    };
  }
  
  // Must start with letter
  if (!/^[a-zA-Z]/.test(trimmedUsername)) {
    return {
      isValid: false,
      error: 'Username harus diawali dengan huruf'
    };
  }
  
  return {
    isValid: true,
    error: null
  };
};

/**
 * Validate phone number (Indonesian format)
 */
export const validatePhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a valid Indonesian phone number
  // Format: 08xx-xxxx-xxxx or +628xx-xxxx-xxxx or 628xx-xxxx-xxxx
  if (cleaned.startsWith('08') && cleaned.length >= 10 && cleaned.length <= 13) {
    return true;
  }
  
  if (cleaned.startsWith('628') && cleaned.length >= 11 && cleaned.length <= 14) {
    return true;
  }
  
  return false;
};

/**
 * Sanitize input to prevent XSS
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

/**
 * Validate URL
 */
export const validateURL = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  try {
    const parsedURL = new URL(url);
    // Only allow http and https protocols
    return parsedURL.protocol === 'http:' || parsedURL.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Validate date
 */
export const validateDate = (dateString) => {
  if (!dateString) {
    return false;
  }
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

/**
 * Validate Indonesian ID number (NIK)
 */
export const validateNIK = (nik) => {
  if (!nik || typeof nik !== 'string') {
    return false;
  }
  
  // NIK must be 16 digits
  const cleaned = nik.replace(/\D/g, '');
  return cleaned.length === 16;
};
