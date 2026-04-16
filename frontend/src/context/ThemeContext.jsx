import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user, updateProfile } = useContext(AuthContext);
  const [theme, setTheme] = useState(localStorage.getItem('forum_theme') || 'Dark');

  const applyTheme = useCallback((targetTheme) => {
    let activeTheme = targetTheme;
    
    if (targetTheme === 'Auto') {
      activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light';
    }

    if (activeTheme === 'Light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  // Sync with User Settings if logged in
  useEffect(() => {
    if (user?.theme) {
      setTheme(user.theme);
      localStorage.setItem('forum_theme', user.theme);
    }
  }, [user?.theme]);

  // Handle system theme changes for 'Auto'
  useEffect(() => {
    applyTheme(theme);
    
    if (theme === 'Auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme('Auto');
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme, applyTheme]);

  const toggleTheme = async (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('forum_theme', newTheme);
    
    if (user) {
      try {
        await updateProfile({ theme: newTheme });
      } catch (err) {
        console.error('Failed to sync theme to profile:', err);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
