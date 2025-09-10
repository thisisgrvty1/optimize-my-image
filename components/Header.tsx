import React, { useState, lazy, Suspense } from 'react';
import ThemeToggle from './ThemeToggle';
import { ZapIcon } from './icons/ZapIcon';
import { useI8n } from '../hooks/useI8n';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import { KeyIcon } from './icons/KeyIcon';
import { View } from '../types';
import { FileImageIcon } from './icons/FileImageIcon';

const ApiKeyModal = lazy(() => import('./ApiKeyModal'));

interface HeaderProps {
  onNavigateHome: () => void;
  onNavigate: (view: View) => void;
  playIntro: boolean;
  sessionFileCount: number;
  currentView: View;
}

const Header: React.FC<HeaderProps> = ({ onNavigateHome, onNavigate, playIntro, sessionFileCount, currentView }) => {
  const { t } = useI8n();
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  return (
    <>
      <header className={`bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark shadow-sm sticky top-0 z-20 ${playIntro ? 'animate-slide-down' : ''}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-baseline space-x-2">
              <button
                onClick={onNavigateHome}
                aria-label={t('appTitle')}
                className="flex items-center space-x-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark rounded-full p-2 -ml-2"
              >
                <ZapIcon className="h-8 w-8 text-primary-light dark:text-primary-dark group-hover:scale-110 group-hover:rotate-[-15deg] transition-transform duration-300"/>
                <div className="hidden sm:flex items-baseline">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-foreground-light dark:text-foreground-dark">
                      {t('appTitle')}
                    </h1>
                </div>
              </button>
              <div className="hidden sm:block">
                <button onClick={() => onNavigate('changelog')} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark rounded-full">
                  <span className="hidden md:inline-block text-xs font-semibold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    v1.4.76
                  </span>
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {currentView !== 'optimizer' && sessionFileCount > 0 && (
                  <button
                      onClick={() => onNavigate('optimizer')}
                      className="flex items-center space-x-2 px-3 py-2 rounded-full bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark hover:bg-primary-light/20 dark:hover:bg-primary-dark/20 transition-colors font-bold text-sm animate-fade-in"
                      aria-label={t('navigateToOptimizer')}
                  >
                      <FileImageIcon className="w-5 h-5" />
                      <span className="leading-none">{sessionFileCount}</span>
                  </button>
              )}
              <button
                  onClick={() => setIsApiKeyModalOpen(true)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-foreground-light dark:text-foreground-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-light dark:focus-visible:ring-offset-background-dark dark:focus-visible:ring-primary-dark"
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
      <Suspense fallback={null}>
        <ApiKeyModal isOpen={isApiKeyModalOpen} onClose={() => setIsApiKeyModalOpen(false)} />
      </Suspense>
    </>
  );
};

export default Header;