import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useI8n } from '../hooks/useI8n';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const { apiKey, setApiKey } = useSettings();
  const [currentKey, setCurrentKey] = useState(apiKey || '');
  const { t } = useI8n();

  const handleSave = () => {
    setApiKey(currentKey);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('apiKeyModalTitle')}>
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('apiKeyModalDesc1')}
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-bold text-primary-light dark:text-primary-dark underline hover:opacity-80 transition-opacity"
          >
            {t('apiKeyModalLinkText')}
          </a>.
          {t('apiKeyModalDesc2')}
        </p>
        <Input
          id="api-key-input"
          type="password"
          placeholder={t('apiKeyModalPlaceholder')}
          value={currentKey}
          onChange={(e) => setCurrentKey(e.target.value)}
          aria-label={t('apiKeyModalPlaceholder')}
        />
        <div className="flex justify-end pt-2">
          <Button onClick={handleSave}>{t('save')}</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ApiKeyModal;
