import React from 'react';
import { useI8n } from '../hooks/useI8n';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useI8n();

  return (
    <div className="flex items-center space-x-1 bg-gray-200 dark:bg-gray-700 rounded-full p-1">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 text-sm font-bold rounded-full transition-colors ${
          language === 'en'
            ? 'bg-card-light text-primary-light dark:bg-card-dark dark:text-primary-dark shadow-md'
            : 'text-foreground-light dark:text-foreground-dark hover:bg-card-light/50 dark:hover:bg-card-dark/50'
        }`}
        aria-pressed={language === 'en'}
        aria-label={t('languageSwitchToEN')}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('de')}
        className={`px-3 py-1 text-sm font-bold rounded-full transition-colors ${
          language === 'de'
            ? 'bg-card-light text-primary-light dark:bg-card-dark dark:text-primary-dark shadow-md'
            : 'text-foreground-light dark:text-foreground-dark hover:bg-card-light/50 dark:hover:bg-card-dark/50'
        }`}
         aria-pressed={language === 'de'}
         aria-label={t('languageSwitchToDE')}
      >
        DE
      </button>
    </div>
  );
};

export default LanguageSwitcher;