import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import {
  getToken,
  setToken,
  getStoredUser,
  setStoredUser,
  clearSession,
} from '../utils/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  // Check auth state on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await authAPI.getMe();
        setUser(userData);
        setStoredUser(userData);
      } catch (err) {
        console.error('Session expired or invalid:', err);
        clearSession();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    setToken(data.access_token);
    const userData = await authAPI.getMe();
    setUser(userData);
    setStoredUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    await authAPI.register(name, email, password);
    // Automatically log in after registration
    return login(email, password);
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
