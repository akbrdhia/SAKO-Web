import { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpiry, setSessionExpiry] = useState(null);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setSessionExpiry(null);
    }
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = authService.getCurrentSession();
        if (session && session.user && session.expiresAt > Date.now()) {
          setUser(session.user);
          setIsAuthenticated(true);
          setSessionExpiry(session.expiresAt);
        } else {
          // Clear invalid session
          authService.logout();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Session timeout monitoring
  useEffect(() => {
    if (!sessionExpiry) return;

    const checkExpiry = setInterval(() => {
      if (Date.now() >= sessionExpiry) {
        logout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkExpiry);
  }, [sessionExpiry, logout]);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!sessionExpiry) return;

    const timeUntilExpiry = sessionExpiry - Date.now();
    const refreshTime = timeUntilExpiry - 300000; // Refresh 5 minutes before expiry

    if (refreshTime > 0) {
      const refreshTimer = setTimeout(async () => {
        try {
          const newSession = await authService.refreshToken();
          if (newSession) {
            setSessionExpiry(newSession.expiresAt);
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          logout();
        }
      }, refreshTime);

      return () => clearTimeout(refreshTimer);
    }
  }, [sessionExpiry, logout]);

  const login = useCallback(async (email, password) => {
    try {
      const result = await authService.login(email, password);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        setSessionExpiry(result.expiresAt);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: result.message 
        };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        message: 'Terjadi kesalahan saat login' 
      };
    }
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(prev => ({ ...prev, ...userData }));
    authService.updateSession({ user: { ...user, ...userData } });
  }, [user]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    sessionExpiry
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
