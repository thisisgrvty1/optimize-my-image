

import React from 'react';
import { useI8n } from '../hooks/useI8n';
import Card from './ui/Card';

const PrivacyPolicyPage: React.FC = () => {
  const { t } = useI8n();

  return (
    <Card>
       <div className="prose dark:prose-invert max-w-none prose-h1:font-black prose-p:text-base prose-p:text-foreground-light prose-p:dark:text-foreground-dark">
            <h1>{t('privacyTitle')}</h1>
            <p>{t('privacyIntro')}</p>
            <p className="font-semibold text-secondary-light dark:text-secondary-dark">{t('privacyData')}</p>
            <p>{t('privacyChanges')}</p>
       </div>
    </Card>
  );
};

export default PrivacyPolicyPage;
