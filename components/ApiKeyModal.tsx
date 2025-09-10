import React from 'react';
import { useI8n } from '../hooks/useI8n';
import Modal from './ui/Modal';
import { KeyIcon } from './icons/KeyIcon';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const { t } = useI8n();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('apiKeyModalTitle')}>
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
            <div className="p-4 bg-primary-light/10 dark:bg-primary-dark/10 rounded-full">
                <KeyIcon className="w-8 h-8 text-primary-light dark:text-primary-dark" />
            </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('apiKeyInfo')}
        </p>
        <div className="p-3 bg-background-light dark:bg-background-dark rounded-lg border border-border-light dark:border-border-dark">
          <code className="text-sm font-mono text-foreground-light dark:text-foreground-dark">
            API_KEY="your_google_api_key_here"
          </code>
        </div>
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
        </p>
      </div>
    </Modal>
  );
};

export default ApiKeyModal;