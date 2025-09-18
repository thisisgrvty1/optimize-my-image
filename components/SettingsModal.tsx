import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useI8n } from '../hooks/useI8n';
import Modal from './ui/Modal';
import Toggle from './ui/Toggle';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { isZoomEnabled, setIsZoomEnabled } = useSettings();
  const { t } = useI8n();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('settingsModalTitle')}>
      <div className="flex flex-col space-y-4">
        <div className="space-y-4 pt-2">
            {/* Zoom Feature Toggle */}
            <div className="flex items-start justify-between p-4 rounded-2xl bg-background-light dark:bg-background-dark">
                <div className="pr-4">
                    <label htmlFor="enable-zoom-feature" className="font-bold text-foreground-light dark:text-foreground-dark">
                        {t('enableZoomFeature')}
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('enableZoomFeatureDesc')}</p>
                </div>
                <Toggle 
                    id="enable-zoom-feature"
                    checked={isZoomEnabled}
                    onChange={(e) => setIsZoomEnabled(e.target.checked)}
                />
            </div>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
