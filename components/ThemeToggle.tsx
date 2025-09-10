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
      className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-foreground-light dark:text-foreground-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-light dark:focus-visible:ring-offset-background-dark dark:focus-visible:ring-primary-dark"
      aria-label={t('toggleTheme')}
    >
      <span className="sr-only">{t('toggleTheme')}</span>
      {themeMode === 'dark' ? (
        <MoonIcon className="h-5 w-5 text-primary-dark" />
      ) : (
        <SunIcon className="h-5 w-5 text-yellow-500" />
      )}
    </button>
  );
};

export default ThemeToggle;