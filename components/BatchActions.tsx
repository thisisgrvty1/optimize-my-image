

import React from 'react';
import Button from './ui/Button';
import SegmentedControl from './ui/SegmentedControl';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import { TrashIcon } from './icons/TrashIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { useI8n } from '../hooks/useI8n';

interface BatchActionsProps {
  applyToAll: boolean;
  onApplyToAllChange: (checked: boolean) => void;
  onExportAll: () => void;
  onAddMore: () => void;
  onClearAll: () => void;
  fileCount: number;
  isExporting: boolean;
}

const BatchActions: React.FC<BatchActionsProps> = ({
  applyToAll,
  onApplyToAllChange,
  onExportAll,
  onAddMore,
  onClearAll,
  fileCount,
  isExporting,
}) => {
  const { t } = useI8n();
  const imageText = fileCount === 1 ? t('image_one') : t('image_other');

  return (
    <div className="mb-8 p-4 bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark shadow-lg-theme">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-1">
          <label className="block text-base font-bold text-foreground-light dark:text-foreground-dark mb-2">
            {t('editingMode')} ({fileCount} {imageText})
          </label>
          <SegmentedControl
            options={[
              { label: t('singleItem'), value: 'single' },
              { label: t('applyToAll'), value: 'all' },
            ]}
            value={applyToAll ? 'all' : 'single'}
            onChange={(value) => onApplyToAllChange(value === 'all')}
          />
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button onClick={onAddMore} variant="secondary" className="w-full">
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              {t('addMore')}
          </Button>
          <Button onClick={onClearAll} variant="danger" className="w-full">
              <TrashIcon className="w-5 h-5 mr-2" />
              {t('clearAll')}
          </Button>
          <Button onClick={onExportAll} className="w-full" isLoading={isExporting} disabled={isExporting}>
            <DownloadIcon className="w-5 h-5 mr-2"/>
            {isExporting ? t('exporting') : t('exportAll', { count: fileCount })}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BatchActions;
