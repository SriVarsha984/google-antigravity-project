import React, { useState, useEffect, useCallback, createContext } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('forum_user');
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch {
      localStorage.removeItem('forum_user');
      localStorage.removeItem('forum_token');
    } finally {
      setLoading(false);
    }
  }, []);

  const loginUser = useCallback(async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    setUser(data);
    localStorage.setItem('forum_user', JSON.stringify(data));
    localStorage.setItem('forum_token', data.token);
    return data;
  }, []);

  const registerUser = useCallback(async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    setUser(data);
    localStorage.setItem('forum_user', JSON.stringify(data));
    localStorage.setItem('forum_token', data.token);
    return data;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('forum_user');
    localStorage.removeItem('forum_token');
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    const { data } = await api.put('/users/profile', profileData);
    setUser((prev) => ({ ...prev, ...data }));
    localStorage.setItem('forum_user', JSON.stringify({ ...user, ...data }));
    return data;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, registerUser, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
