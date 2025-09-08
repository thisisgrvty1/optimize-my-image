import React from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { useI8n } from '../hooks/useI8n';

interface DragDropOverlayProps {
  isVisible: boolean;
}

const DragDropOverlay: React.FC<DragDropOverlayProps> = ({ isVisible }) => {
  const { t } = useI8n();

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md animate-fade-in"
      style={{ animationDuration: '200ms' }}
    >
      <div className="flex flex-col items-center justify-center p-12 border-4 border-dashed rounded-3xl border-primary-light dark:border-primary-dark bg-card-light dark:bg-card-dark shadow-xl-theme">
        <UploadIcon className="w-24 h-24 mb-6 text-primary-light dark:text-primary-dark" />
        <p className="text-2xl font-bold text-foreground-light dark:text-foreground-dark">
          {t('dropAnywhereTitle')}
        </p>
      </div>
    </div>
  );
};

export default DragDropOverlay;
