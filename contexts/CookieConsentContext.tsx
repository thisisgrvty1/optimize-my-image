import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CookieConsent } from '../types';

const COOKIE_CONSENT_KEY = 'cookie_consent';

interface CookieConsentContextType {
  consent: CookieConsent | null;
  showBanner: boolean;
  showSettings: boolean;
  acceptAll: () => void;
  declineAll: () => void;
  savePreferences: (prefs: CookieConsent) => void;
  openSettings: () => void;
  closeSettings: () => void;
  runAnalyticsScripts: () => void;
}

export const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

const getInitialConsent = (): CookieConsent | null => {
  if (typeof window === 'undefined') return null;
  try {
    const item = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Error reading cookie consent from localStorage", error);
    return null;
  }
};

export const CookieConsentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [consent, setConsent] = useState<CookieConsent | null>(getInitialConsent);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!consent) {
      setShowBanner(true);
    }
  }, [consent]);

  const updateConsent = (newConsent: CookieConsent) => {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newConsent));
      setConsent(newConsent);
      setShowBanner(false);
      setShowSettings(false);
    } catch (error) {
      console.error("Error saving cookie consent to localStorage", error);
    }
  };

  const acceptAll = useCallback(() => {
    updateConsent({ necessary: true, analytics: true });
  }, []);

  const declineAll = useCallback(() => {
    updateConsent({ necessary: true, analytics: false });
  }, []);

  const savePreferences = useCallback((prefs: CookieConsent) => {
    updateConsent({ ...prefs, necessary: true });
  }, []);
  
  const openSettings = useCallback(() => {
    setShowBanner(false);
    setShowSettings(true);
  }, []);

  const closeSettings = useCallback(() => {
    setShowSettings(false);
    if (!consent) {
        setShowBanner(true);
    }
  }, [consent]);
  
  const runAnalyticsScripts = useCallback(() => {
    if (consent?.analytics) {
      // Placeholder for your analytics scripts
      console.log("Analytics scripts would run here.");
    }
  }, [consent]);

  const value = {
    consent,
    showBanner,
    showSettings,
    acceptAll,
    declineAll,
    savePreferences,
    openSettings,
    closeSettings,
    runAnalyticsScripts,
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
};
