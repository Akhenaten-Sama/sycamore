import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved preference, default to light mode
    const saved = localStorage.getItem('sycamore-theme');
    const darkMode = saved ? JSON.parse(saved) : false;
    
    // Set initial background immediately
    document.documentElement.style.background = darkMode ? '#121212' : '#ffffff';
    document.body.style.background = darkMode ? '#121212' : '#ffffff';
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    
    return darkMode;
  });

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('sycamore-theme', JSON.stringify(isDarkMode));
    
    // Apply theme data attribute to body for CSS styling
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    
    // Update html and body backgrounds
    document.documentElement.style.background = isDarkMode ? '#121212' : '#ffffff';
    document.body.style.background = isDarkMode ? '#121212' : '#ffffff';
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const value = {
    isDarkMode,
    toggleTheme,
    theme: isDarkMode ? 'dark' : 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
