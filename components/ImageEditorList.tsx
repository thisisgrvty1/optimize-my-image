
import React from 'react';
import { ImageFile, ImageSettings } from '../types';
import ImageEditor from './ImageEditor';

interface ImageEditorListProps {
  files: ImageFile[];
  onSettingsChange: (id: string, newSettings: Partial<ImageSettings>) => void;
  onRemoveImage: (id: string) => void;
  onProcessingStateChange: (id: string, state: Partial<ImageFile['processed']>) => void;
}

const ImageEditorList: React.FC<ImageEditorListProps> = ({ files, onSettingsChange, onRemoveImage, onProcessingStateChange }) => {
  return (
    <div className="space-y-8">
      {files.map((file) => (
        <ImageEditor
          key={file.id}
          file={file}
          onSettingsChange={onSettingsChange}
          onRemove={onRemoveImage}
          onProcessingStateChange={onProcessingStateChange}
        />
      ))}
    </div>
  );
};

export default ImageEditorList;
