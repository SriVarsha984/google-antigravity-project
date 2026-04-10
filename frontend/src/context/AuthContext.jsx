import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Rehydrate user from storage if available
    const storedUser = localStorage.getItem('forum_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    }
    setLoading(false);
  }, []);

  const loginUser = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    setUser(data);
    localStorage.setItem('forum_user', JSON.stringify(data));
    localStorage.setItem('forum_token', data.token);
    return data;
  };

  const registerUser = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    setUser(data);
    localStorage.setItem('forum_user', JSON.stringify(data));
    localStorage.setItem('forum_token', data.token);
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('forum_user');
    localStorage.removeItem('forum_token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
