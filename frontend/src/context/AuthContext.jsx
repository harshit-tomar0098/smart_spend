import React, { createContext, useState, useEffect, useCallback } from 'react';
/* eslint-disable react-refresh/only-export-components, react-hooks/set-state-in-effect */
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Registration failed' };
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  // Idle timeout auto-logout mechanism
  useEffect(() => {
    let timeoutId;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      if (user) {
        // 2 minutes = 120,000 milliseconds
        timeoutId = setTimeout(() => {
          logout();
        }, 120000);
      }
    };

    const events = ['mousemove', 'keydown', 'scroll', 'click'];

    if (user) {
      resetTimer();
      events.forEach(event => window.addEventListener(event, resetTimer));
    }

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [user, logout]);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
