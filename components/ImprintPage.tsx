

import React from 'react';
import { useI8n } from '../hooks/useI8n';
import Card from './ui/Card';

const ImprintPage: React.FC = () => {
  const { t } = useI8n();

  return (
    <Card>
        <div className="prose dark:prose-invert max-w-none prose-h1:font-black prose-h2:font-bold prose-p:text-base prose-p:text-foreground-light prose-p:dark:text-foreground-dark">
            <h1>{t('imprintTitle')}</h1>
            <p className="font-semibold">{t('imprintName')}</p>
            <p>{t('imprintAddress')}</p>
            <h2>{t('imprintContactTitle')}</h2>
            <p>{t('imprintPhone')}</p>
            <p>
                {t('imprintEmail')}
            </p>
        </div>
    </Card>
  );
};

export default ImprintPage;
