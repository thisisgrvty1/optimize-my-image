import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { I18nProvider } from './contexts/I18nContext';
import { CookieConsentProvider } from './contexts/CookieConsentContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <I18nProvider>
      <CookieConsentProvider>
        <ThemeProvider>
          <SettingsProvider>
            <App />
          </SettingsProvider>
        </ThemeProvider>
      </CookieConsentProvider>
    </I18nProvider>
  </React.StrictMode>
);