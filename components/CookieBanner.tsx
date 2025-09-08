import React from 'react';
import { useCookieConsent } from '../hooks/useCookieConsent';
import { useI8n } from '../hooks/useI8n';
import Button from './ui/Button';
import Card from './ui/Card';
import { CookieIcon } from './icons/CookieIcon';
import { View } from '../types';

interface CookieBannerProps {
  onNavigate: (view: View) => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ onNavigate }) => {
  const { showBanner, acceptAll, declineAll, openSettings } = useCookieConsent();
  const { t } = useI8n();

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 right-0 left-0 sm:left-auto z-50 p-4 animate-slide-up-in" role="region" aria-label={t('cookieConsentRegionLabel')}>
      <Card className="max-w-md ml-auto">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 text-primary-light dark:text-primary-dark">
              <CookieIcon className="w-8 h-8"/>
          </div>
          <div>
              <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark">{t('cookieBannerTitle')}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-4">
                  {t('cookieBannerText')}
                  {' '}
                  <button onClick={openSettings} className="font-bold underline hover:text-primary-light dark:hover:text-primary-dark">{t('cookieCustomize')}</button>.
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <button onClick={() => onNavigate('imprint')} className="underline hover:text-primary-light dark:hover:text-primary-dark">{t('footerImprint')}</button>
                  <span className="mx-2">|</span>
                  <button onClick={() => onNavigate('privacy')} className="underline hover:text-primary-light dark:hover:text-primary-dark">{t('footerPrivacyPolicy')}</button>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <Button onClick={acceptAll} variant="primary" className="w-full sm:w-auto px-4 py-2 text-sm">{t('cookieAcceptAll')}</Button>
                  <Button onClick={declineAll} variant="secondary" className="w-full sm:w-auto px-4 py-2 text-sm">{t('cookieDecline')}</Button>
              </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CookieBanner;