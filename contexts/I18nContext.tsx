import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Language } from '../types';

// Import translations from TypeScript modules for maximum compatibility.
import enTranslations from '../locales/en';
import deTranslations from '../locales/de';

type Translations = Record<string, string>;
type TranslationsMap = Record<Language, Translations>;

// Create a map of available translations that are now bundled with the app.
const availableTranslations: TranslationsMap = {
  en: enTranslations,
  de: deTranslations,
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Determine initial language based on browser settings, falling back to 'en'.
const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined' && window.navigator) {
    const browserLang = window.navigator.language.split('-')[0];
    // Check if the browser language is one of our supported languages.
    if (browserLang in availableTranslations) {
      return browserLang as Language;
    }
  }
  return 'en';
};

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  // Update the document's lang attribute whenever the language changes for accessibility.
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback((key: string, replacements?: Record<string, string | number>): string => {
      const currentTranslations = availableTranslations[language];
      const fallbackTranslations = availableTranslations['en']; // English is the fallback language.
      
      // Get the translation string from the current language, or fallback, or just use the key itself.
      let translation = currentTranslations[key] || fallbackTranslations[key] || key;
      
      // If replacements are provided (e.g., for "{count}"), substitute them into the string.
      if (replacements) {
          Object.keys(replacements).forEach(placeholder => {
              translation = translation.replace(`{${placeholder}}`, String(replacements[placeholder]));
          });
      }
      return translation;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};
