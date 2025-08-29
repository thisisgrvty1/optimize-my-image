export type ThemeMode = 'light' | 'dark';
export type ThemeName = 'orange' | 'rose' | 'violet' | 'blue' | 'green' | 'slate';

export type Language = 'en' | 'de';

export type View = 'landing' | 'optimizer' | 'imprint' | 'privacy';

export type CookieConsent = {
  necessary: boolean;
  analytics: boolean;
};

export type OutputFormat = 'jpeg' | 'png' | 'webp';

export interface ImageSettings {
  width: number;
  height: number;
  quality: number;
  format: OutputFormat;
  projectName: string;
  sectionName: string;
  imageElement: string;
  altText: string;
}

export interface ImageFile {
  id: string;
  originalFile: File;
  previewUrl: string;
  width: number;
  height: number;
  settings: ImageSettings;
  processed: {
    isProcessing: boolean;
    estimatedSize?: number;
    error?: string;
  };
}