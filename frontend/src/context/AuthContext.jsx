import React, { createContext, useState, useEffect } from 'react';
import { login, register, logout, getCurrentUser } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (err) {
          console.error('Failed to get current user:', err);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      setError(null);
      const data = await login(credentials);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to login');
      return false;
    }
  };

  const handleRegister = async (userData) => {
    try {
      setError(null);
      const data = await register(userData);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to register');
      return false;
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};