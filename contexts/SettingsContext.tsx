import React, { createContext, useState, useCallback, ReactNode, useContext } from 'react';

const API_KEY_STORAGE_KEY = 'google_api_key';
// Fix: Add storage key for zoom setting
const ZOOM_ENABLED_STORAGE_KEY = 'zoom_enabled';

interface SettingsContextType {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  // Fix: Add properties for zoom feature setting
  isZoomEnabled: boolean;
  setIsZoomEnabled: (enabled: boolean) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(API_KEY_STORAGE_KEY);
  });

  // Fix: Add state for zoom setting, initialized from localStorage
  const [isZoomEnabled, setIsZoomEnabledState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const storedValue = window.localStorage.getItem(ZOOM_ENABLED_STORAGE_KEY);
    return storedValue !== null ? JSON.parse(storedValue) : true;
  });

  const setApiKey = useCallback((key: string | null) => {
    setApiKeyState(key);
    if (key) {
      localStorage.setItem(API_KEY_STORAGE_KEY, key);
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
  }, []);

  // Fix: Add callback to update zoom setting state and localStorage
  const setIsZoomEnabled = useCallback((enabled: boolean) => {
    setIsZoomEnabledState(enabled);
    localStorage.setItem(ZOOM_ENABLED_STORAGE_KEY, JSON.stringify(enabled));
  }, []);

  return (
    // Fix: Provide zoom settings through context
    <SettingsContext.Provider value={{ apiKey, setApiKey, isZoomEnabled, setIsZoomEnabled }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
