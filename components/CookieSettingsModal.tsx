import React, { useState, useEffect } from 'react';
import { useCookieConsent } from '../hooks/useCookieConsent';
import { useI8n } from '../hooks/useI8n';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Toggle from './ui/Toggle';
import { CookieConsent } from '../types';

const CookieSettingsModal: React.FC = () => {
  const { consent, showSettings, closeSettings, savePreferences, acceptAll } = useCookieConsent();
  const { t } = useI8n();
  
  const [preferences, setPreferences] = useState<CookieConsent>({
    necessary: true,
    analytics: consent?.analytics ?? false,
  });

  useEffect(() => {
    if (showSettings) {
      setPreferences({
        necessary: true,
        analytics: consent?.analytics ?? false,
      });
    }
  }, [consent, showSettings]);

  const handleToggle = (key: keyof Omit<CookieConsent, 'necessary'>) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    savePreferences(preferences);
  };
  
  const handleAcceptAll = () => {
    acceptAll();
  };

  return (
    <Modal isOpen={showSettings} onClose={closeSettings} title={t('cookieSettingsTitle')}>
      <div className="flex flex-col space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">{t('cookieSettingsDescription')}</p>
        
        <div className="space-y-4 pt-2">
            {/* Necessary Cookies */}
            <div className="flex items-start justify-between p-4 rounded-2xl bg-background-light dark:bg-background-dark">
                <div className="pr-4">
                    <label htmlFor="necessary-cookies" className="font-bold text-foreground-light dark:text-foreground-dark">
                        {t('cookieNecessaryTitle')}
                        <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">({t('cookieAlwaysActive')})</span>
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('cookieNecessaryDescription')}</p>
                </div>
                <Toggle id="necessary-cookies" checked={true} disabled />
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-start justify-between p-4 rounded-2xl bg-background-light dark:bg-background-dark">
                <div className="pr-4">
                    <label htmlFor="analytics-cookies" className="font-bold text-foreground-light dark:text-foreground-dark">
                        {t('cookieAnalyticsTitle')}
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('cookieAnalyticsDescription')}</p>
                </div>
                <Toggle 
                    id="analytics-cookies" 
                    checked={preferences.analytics}
                    onChange={() => handleToggle('analytics')}
                />
            </div>
        </div>

        <div className="flex flex-col sm:flex-row-reverse gap-3 pt-4 border-t border-border-light dark:border-border-dark">
            <Button onClick={handleSave} className="w-full sm:w-auto">
                {t('cookieSaveChanges')}
            </Button>
            <Button onClick={handleAcceptAll} variant="secondary" className="w-full sm:w-auto">
                {t('cookieAcceptAll')}
            </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CookieSettingsModal;
