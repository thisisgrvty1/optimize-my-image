

import React, { useEffect } from 'react';
import { ZapIcon } from './icons/ZapIcon';
import { useI8n } from '../hooks/useI8n';

interface IntroAnimationProps {
  onAnimationEnd: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onAnimationEnd }) => {
  const { t } = useI8n();

  useEffect(() => {
    const endTimer = setTimeout(() => {
      onAnimationEnd();
    }, 2500); // Duration must match the animation in CSS

    return () => clearTimeout(endTimer);
  }, [onAnimationEnd]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background-light dark:bg-background-dark animate-intro-wrapper"
    >
      <div className="flex flex-col items-center">
        <ZapIcon className="h-28 w-28 text-primary-light dark:text-primary-dark animate-bounce-in" />
        <h1 className="text-4xl sm:text-5xl font-black text-foreground-light dark:text-foreground-dark mt-6 animate-fade-in animation-delay-800">
          {t('appTitle')}
        </h1>
      </div>
    </div>
  );
};

export default IntroAnimation;
