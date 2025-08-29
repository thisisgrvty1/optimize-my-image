

import { ImageFile } from '../types';

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const generateFileName = (file: ImageFile): string => {
    const { settings, originalFile } = file;
    const { projectName, sectionName, imageElement, width, height, format } = settings;

    const originalNameWithoutExt = originalFile.name.split('.').slice(0, -1).join('.');

    if (projectName || sectionName || imageElement) {
        const proj = projectName || 'project';
        const sect = sectionName || 'section';
        const elem = imageElement || 'image';
        return `${proj}-${sect}_${elem}-${width}x${height}.${format}`;
    } else {
        return `${originalNameWithoutExt}-${width}x${height}.${format}`;
    }
};
