import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { ZapIcon } from './icons/ZapIcon';
import { useI8n } from '../hooks/useI8n';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import { KeyIcon } from './icons/KeyIcon';
import ApiKeyModal from './ApiKeyModal';
import { HistoryIcon } from './icons/HistoryIcon';

interface HeaderProps {
  onNavigateHome: () => void;
  onNavigateToChangelog: () => void;
  onNavigateToOptimizer: () => void;
  sessionFileCount: number;
  playIntro: boolean;
}

const Header: React.FC<HeaderProps> = ({ onNavigateHome, onNavigateToChangelog, onNavigateToOptimizer, sessionFileCount, playIntro }) => {
  const { t } = useI8n();
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  return (
    <>
      <header className={`bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark shadow-sm sticky top-0 z-20 ${playIntro ? 'animate-slide-down' : ''}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={onNavigateHome} className="flex items-center space-x-3 group focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark rounded-full p-2 -ml-2">
              <ZapIcon className="h-8 w-8 text-primary-light dark:text-primary-dark group-hover:scale-110 group-hover:rotate-[-15deg] transition-transform duration-300"/>
              <div className="hidden sm:flex items-baseline space-x-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-foreground-light dark:text-foreground-dark">
                    {t('appTitle')}
                  </h1>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering onNavigateHome
                      onNavigateToChangelog();
                    }}
                    className="hidden md:inline-block text-xs font-semibold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary-light"
                    title={t('viewChangelog')}
                  >
                    v1.5.1
                  </button>
              </div>
            </button>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {sessionFileCount > 0 && (
                <button
                  onClick={onNavigateToOptimizer}
                  className="hidden sm:flex items-center relative p-2"
                  title={t('activeSessionIndicator', { count: sessionFileCount })}
                >
                    <HistoryIcon className="w-6 h-6 text-primary-light dark:text-primary-dark" />
                    <span className="absolute -top-0 -right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                      {sessionFileCount}
                    </span>
                </button>
              )}
              <button
                  onClick={() => setIsApiKeyModalOpen(true)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-foreground-light dark:text-foreground-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light dark:focus:ring-offset-background-dark dark:focus:ring-primary-dark"
                  aria-label={t('apiKeySettings')}
                >
                  <KeyIcon className="w-5 h-5" />
              </button>
              <LanguageSwitcher />
              <ThemeSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      <ApiKeyModal isOpen={isApiKeyModalOpen} onClose={() => setIsApiKeyModalOpen(false)} />
    </>
  );
};

export default Header;