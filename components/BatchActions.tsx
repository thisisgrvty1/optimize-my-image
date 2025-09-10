import React from 'react';
import Button from './ui/Button';
import SegmentedControl from './ui/SegmentedControl';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import { TrashIcon } from './icons/TrashIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { useI8n } from '../hooks/useI8n';
import { SparklesIcon } from './icons/SparklesIcon';

interface BatchActionsProps {
  applyToAll: boolean;
  onApplyToAllChange: (checked: boolean) => void;
  onExportAll: () => void;
  onAddMore: () => void;
  onClearAll: () => void;
  onGenerateAllAltTexts: () => void;
  fileCount: number;
  isExporting: boolean;
  isGeneratingAltTexts: boolean;
}

const BatchActions: React.FC<BatchActionsProps> = ({
  applyToAll,
  onApplyToAllChange,
  onExportAll,
  onAddMore,
  onClearAll,
  onGenerateAllAltTexts,
  fileCount,
  isExporting,
  isGeneratingAltTexts,
}) => {
  const { t } = useI8n();
  
  const secondaryButtonClasses = "bg-primary-light/10 hover:bg-primary-light/20 dark:bg-primary-dark/10 dark:hover:bg-primary-dark/20 text-primary-light dark:text-primary-dark shadow-none px-4 py-2";
  const destructiveButtonClasses = "bg-red-500/10 text-red-500 hover:bg-red-500/20 shadow-none px-4 py-2";


  return (
    <div className="mb-8 p-4 relative glass-card-glow rounded-2xl">
      <div className="relative z-10">

        {/* --- Desktop Layout (md and up) --- */}
        <div className="hidden md:flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div>
              <label className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-2 block">
                {t('editingMode')}
              </label>
              <SegmentedControl
                options={[
                  { label: t('singleItem'), value: 'single' },
                  { label: t('applyToAll'), value: 'all' },
                ]}
                value={applyToAll ? 'all' : 'single'}
                onChange={(value) => onApplyToAllChange(value === 'all')}
                ariaLabel={t('editingMode')}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button onClick={onAddMore} className={secondaryButtonClasses}>
                <PlusCircleIcon className="w-5 h-5 mr-2" />
                {t('addMore')}
              </Button>
              <Button onClick={onGenerateAllAltTexts} className={secondaryButtonClasses} isLoading={isGeneratingAltTexts} disabled={isGeneratingAltTexts || isExporting}>
                <SparklesIcon className="w-5 h-5 mr-2" />
                {isGeneratingAltTexts ? t('generating') : t('generateAllAltTexts')}
              </Button>
              <Button onClick={onClearAll} className={destructiveButtonClasses}>
                <TrashIcon className="w-5 h-5 mr-2" />
                {t('clearAll')}
              </Button>
            </div>
          </div>

          <div>
            <Button 
              onClick={onExportAll} 
              isLoading={isExporting} 
              disabled={isExporting || isGeneratingAltTexts}
              className="animate-pulse-glow-button"
            >
              <DownloadIcon className="w-5 h-5 mr-2" />
              {isExporting ? t('exporting') : t('exportAll', { count: fileCount })}
            </Button>
          </div>
        </div>

        {/* --- Mobile Layout (up to md) --- */}
        <div className="md:hidden">
          <div className="flex flex-col items-center gap-2 mb-4 pb-4 border-b border-border-light dark:border-border-dark">
            <label className="block text-base font-bold text-foreground-light dark:text-foreground-dark">
              {t('editingMode')}
            </label>
            <SegmentedControl
              options={[
                { label: t('singleItem'), value: 'single' },
                { label: t('applyToAll'), value: 'all' },
              ]}
              value={applyToAll ? 'all' : 'single'}
              onChange={(value) => onApplyToAllChange(value === 'all')}
              ariaLabel={t('editingMode')}
            />
          </div>

          <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button onClick={onAddMore} className={`${secondaryButtonClasses} w-full`}>
                  <PlusCircleIcon className="w-5 h-5 mr-2" />
                  {t('addMore')}
                  </Button>
                  <Button onClick={onGenerateAllAltTexts} className={`${secondaryButtonClasses} w-full`} isLoading={isGeneratingAltTexts} disabled={isGeneratingAltTexts || isExporting}>
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  {isGeneratingAltTexts ? t('generating') : t('generateAllAltTexts')}
                  </Button>
              </div>
              <Button onClick={onClearAll} className={`${destructiveButtonClasses} w-full`}>
                  <TrashIcon className="w-5 h-5 mr-2" />
                  {t('clearAll')}
              </Button>
              <Button 
                onClick={onExportAll} 
                className="w-full animate-pulse-glow-button"
                isLoading={isExporting} 
                disabled={isExporting || isGeneratingAltTexts}
              >
                  <DownloadIcon className="w-5 h-5 mr-2"/>
                  {isExporting ? t('exporting') : t('exportAll', { count: fileCount })}
              </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchActions;