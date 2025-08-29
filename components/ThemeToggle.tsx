import React from 'react';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { useI8n } from '../hooks/useI8n';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { t } = useI8n();
  const { themeMode, toggleThemeMode } = useTheme();

  return (
    <button
      onClick={toggleThemeMode}
      className="relative inline-flex items-center h-10 w-20 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light dark:focus:ring-offset-background-dark dark:focus:ring-primary-dark"
      aria-label={t('toggleTheme')}
    >
      <span className="sr-only">{t('toggleTheme')}</span>
      <span
        className={`${
          themeMode === 'dark' ? 'translate-x-10' : 'translate-x-1'
        } inline-block w-8 h-8 transform bg-card-light dark:bg-gray-900 rounded-full transition-transform duration-300 ease-in-out-quad shadow-lg flex items-center justify-center`}
      >
        {themeMode === 'dark' ? (
          <MoonIcon className="h-5 w-5 text-primary-dark" />
        ) : (
          <SunIcon className="h-5 w-5 text-yellow-500" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
