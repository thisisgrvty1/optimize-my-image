

import React, { createContext, useState, useEffect, useCallback, ReactNode, useContext } from 'react';
import { ThemeName, ThemeMode } from '../types';

const THEME_NAME_KEY = 'theme_name';
const THEME_MODE_KEY = 'theme_mode';

interface ThemeContextType {
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getInitialThemeName = (): ThemeName => {
  if (typeof window === 'undefined') return 'green';
  const savedTheme = localStorage.getItem(THEME_NAME_KEY);
  return (savedTheme as ThemeName) || 'green';
};

const getInitialThemeMode = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';
  const savedMode = localStorage.getItem(THEME_MODE_KEY);
  if (savedMode) return savedMode as ThemeMode;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeName, setThemeNameState] = useState<ThemeName>(getInitialThemeName);
  const [themeMode, setThemeModeState] = useState<ThemeMode>(getInitialThemeMode);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem(THEME_NAME_KEY, themeName);
  }, [themeName]);

  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_MODE_KEY, themeMode);
  }, [themeMode]);
  
  const setThemeName = (name: ThemeName) => {
    setThemeNameState(name);
  };

  const toggleThemeMode = useCallback(() => {
    setThemeModeState(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  }, []);

  const value = {
    themeName,
    setThemeName,
    themeMode,
    toggleThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}