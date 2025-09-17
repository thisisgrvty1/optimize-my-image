import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { MAX_FILES } from '../constants';
import { useI8n } from '../hooks/useI8n';

interface FileUploadProps {
  onFilesSelected: (files: FileList) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const { t } = useI8n();

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  }, [onFilesSelected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelected(e.target.files);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full h-96 border-4 border-dashed rounded-3xl cursor-pointer transition-all duration-300 ease-in-out-quad
                    ${isDragging ? 'border-primary-light dark:border-primary-dark bg-orange-50 dark:bg-background-dark scale-105' : 'border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark hover:border-primary-light/50'}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
          <UploadIcon className={`w-16 h-16 mb-6 text-gray-400 dark:text-gray-500 transition-transform duration-300 ${isDragging ? 'scale-125 -translate-y-2' : ''}`} />
          <p className="mb-2 text-xl font-bold text-foreground-light dark:text-foreground-dark">
            <span className="text-primary-light dark:text-primary-dark">{t('uploadTitle')}</span> {t('uploadSubtitle')}
          </p>
          <p className="text-base text-gray-500 dark:text-gray-400">{t('uploadInfo', { maxFiles: MAX_FILES })}</p>
        </div>
        <input id="dropzone-file" type="file" className="hidden" multiple onChange={handleChange} accept="image/png, image/jpeg, image/webp, image/gif"/>
      </label>
    </div>
  );
};

export default FileUpload;
