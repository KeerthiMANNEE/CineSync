import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark

  useEffect(() => {
    const savedTheme = localStorage.getItem('cinesync-theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('cinesync-theme', newTheme ? 'dark' : 'light');
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      primary: isDarkMode 
        ? 'linear-gradient(135deg, #ff6b6b, #ee5a24, #c44569)'
        : 'linear-gradient(135deg, #ff8a80, #ff7043, #e91e63)',
      background: isDarkMode ? '#0a0a0a' : '#f5f5f5',
      surface: isDarkMode ? '#1a1a1a' : '#ffffff',
      card: isDarkMode ? '#2a2a2a' : '#ffffff',
      text: isDarkMode ? '#ffffff' : '#333333',
      textSecondary: isDarkMode ? '#b0b0b0' : '#666666',
      border: isDarkMode ? '#333333' : '#e0e0e0',
      success: '#4caf50',
      error: '#f44336',
      warning: '#ff9800',
      shadow: isDarkMode 
        ? 'rgba(0, 0, 0, 0.3)' 
        : 'rgba(0, 0, 0, 0.1)'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};