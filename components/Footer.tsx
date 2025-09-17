import React from 'react';
import { useI8n } from '../hooks/useI8n';
import { View } from '../types';
import { useCookieConsent } from '../hooks/useCookieConsent';

interface FooterProps {
    onNavigate: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useI8n();
  const { consent, openSettings } = useCookieConsent();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card-light dark:bg-card-dark border-t-2 border-border-light dark:border-border-dark mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left space-y-2 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-0">
             <p className="font-semibold">{t('footerCopyright', { year: currentYear })}</p>
             <span className="md:hidden text-xs font-semibold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
               v1.3.9
             </span>
          </div>
          <div className="flex flex-wrap justify-center items-center space-x-6 font-bold">
            <button 
              onClick={() => onNavigate('imprint')} 
              className="hover:text-primary-light dark:hover:text-primary-dark transition-colors"
            >
              {t('footerImprint')}
            </button>
            <button 
              onClick={() => onNavigate('privacy')}
              className="hover:text-primary-light dark:hover:text-primary-dark transition-colors"
            >
              {t('footerPrivacyPolicy')}
            </button>
            {consent && (
              <button
                onClick={openSettings}
                className="hover:text-primary-light dark:hover:text-primary-dark transition-colors"
              >
                {t('footerCookieSettings')}
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;