import React, { useEffect, useCallback, useMemo, useState, useRef } from 'react';
import { ImageFile, ImageSettings, OutputFormat } from '../types';
import { formatBytes, generateFileName } from '../utils/fileUtils';
import { processImage } from '../services/imageService';
import { useDebounce } from '../hooks/useDebounce';
import Card from './ui/Card';
import Input from './ui/Input';
import Select from './ui/Select';
import Slider from './ui/Slider';
import Button from './ui/Button';
import { XIcon } from './icons/XIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { useI8n } from '../hooks/useI8n';
import { generateAltText } from '../services/geminiService';
import { fileToBase64 } from '../utils/imageUtils';
import { SparklesIcon } from './icons/SparklesIcon';
import { TARGET_SIZE_KB, WARNING_SIZE_KB } from '../constants';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { ImageIcon } from './icons/ImageIcon';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';

interface ImageEditorProps {
  file: ImageFile;
  onSettingsChange: (id: string, newSettings: Partial<ImageSettings>) => void;
  onRemove: (id: string) => void;
  onProcessingStateChange: (id: string, state: Partial<ImageFile['processed']>) => void;
}

type EditorTab = 'imageSettings' | 'naming';

const ImageEditor: React.FC<ImageEditorProps> = ({ file, onSettingsChange, onRemove, onProcessingStateChange }) => {
  const { id, originalFile, previewUrl, width, height, settings, processed } = file;
  const debouncedSettings = useDebounce(settings, 300);
  const { t, language } = useI8n();
  const [isGeneratingAltText, setIsGeneratingAltText] = useState(false);
  const [altTextError, setAltTextError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<EditorTab>('imageSettings');
  const [processedPreviewUrl, setProcessedPreviewUrl] = useState<string | null>(null);

  const [isZoomEnabled, setIsZoomEnabled] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(2);
  const [magnifierStyle, setMagnifierStyle] = useState<React.CSSProperties>({ opacity: 0, visibility: 'hidden' });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const previewImageRef = useRef<HTMLImageElement>(null);
  const zoomOptions = [2, 4, 6];

  useEffect(() => {
    return () => {
      if (processedPreviewUrl) {
        URL.revokeObjectURL(processedPreviewUrl);
      }
    };
  }, [processedPreviewUrl]);

  const sizeColorClass = useMemo(() => {
    if (processed.estimatedSize === undefined) {
      return 'text-gradient-theme';
    }
    const sizeInKb = processed.estimatedSize / 1024;

    if (sizeInKb < TARGET_SIZE_KB) {
      return 'text-green-500 dark:text-green-400';
    }
    if (sizeInKb <= WARNING_SIZE_KB) {
      return 'text-secondary-light dark:text-secondary-dark';
    }
    return 'text-red-500 dark:text-red-400';
  }, [processed.estimatedSize]);

  const updateSettings = (newSettings: Partial<ImageSettings>) => {
    onSettingsChange(id, newSettings);
  };

  const updatePreviewAndSize = useCallback(async () => {
    onProcessingStateChange(id, { isProcessing: true, error: undefined });
    try {
      const { blob } = await processImage(originalFile, debouncedSettings);
      const newPreviewUrl = URL.createObjectURL(blob);
      setProcessedPreviewUrl(newPreviewUrl);
      onProcessingStateChange(id, { isProcessing: false, estimatedSize: blob.size });
    } catch (error) {
      console.error('Error processing image for estimation:', error);
      onProcessingStateChange(id, { isProcessing: false, error: 'estimationError' });
      setProcessedPreviewUrl(null);
    }
  }, [id, originalFile, debouncedSettings, onProcessingStateChange]);
  
  useEffect(() => {
    updatePreviewAndSize();
  }, [debouncedSettings]);

  const handleDownload = async () => {
    onProcessingStateChange(id, { isProcessing: true });
    try {
        const { blob } = await processImage(originalFile, settings);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = generateFileName(file);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch(error) {
        console.error('Download failed', error);
        alert(t('downloadFailedError'));
    } finally {
        onProcessingStateChange(id, { isProcessing: false });
    }
  }

  const handleGenerateAltText = async () => {
    if (!process.env.API_KEY) {
      alert(t('apiKeyMissingError'));
      return;
    }

    setIsGeneratingAltText(true);
    setAltTextError(null);

    try {
      const { mimeType, data } = await fileToBase64(originalFile);
      const generatedText = await generateAltText({ mimeType, data }, language);
      updateSettings({ altText: generatedText });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'altTextGenerationFailed';
      setAltTextError(t(errorMessage as any));
      console.error(error);
    } finally {
      setIsGeneratingAltText(false);
    }
  };
  
  const finalFileName = useMemo(() => generateFileName(file), [file]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomEnabled || !previewContainerRef.current || !previewImageRef.current || !processedPreviewUrl) {
      if (showMagnifier) setShowMagnifier(false);
      return;
    }
  
    const container = previewContainerRef.current;
    const img = previewImageRef.current;
    const rect = container.getBoundingClientRect();
  
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
  
    if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
      if (showMagnifier) setShowMagnifier(false);
      return;
    }
    
    if (!showMagnifier) setShowMagnifier(true);
  
    const MAG_SIZE = 150;
    const ZOOM_LEVEL = zoomLevel;
  
    const { naturalWidth, naturalHeight } = img;
    const backgroundImageUrl = img.src;
  
    const bgWidth = naturalWidth * ZOOM_LEVEL;
    const bgHeight = naturalHeight * ZOOM_LEVEL;
  
    const bgX = -(x * (bgWidth / rect.width) - MAG_SIZE / 2);
    const bgY = -(y * (bgHeight / rect.height) - MAG_SIZE / 2);
  
    setMagnifierStyle({
      backgroundImage: `url(${backgroundImageUrl})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: `${bgWidth}px ${bgHeight}px`,
      backgroundPosition: `${bgX}px ${bgY}px`,
      top: `${y - MAG_SIZE / 2}px`,
      left: `${x - MAG_SIZE / 2}px`,
      width: `${MAG_SIZE}px`,
      height: `${MAG_SIZE}px`,
    });
  };
  
  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const TabButton: React.FC<{ tab: EditorTab; label: string }> = ({ tab, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      role="tab"
      aria-selected={activeTab === tab}
      className={`px-1 py-3 text-sm sm:text-base font-bold transition-colors duration-200 ease-in-out-quad focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background-dark
        ${activeTab === tab
          ? 'text-primary-light dark:text-primary-dark border-b-4 border-primary-light dark:border-primary-dark'
          : 'text-gray-500 dark:text-gray-400 hover:text-foreground-light dark:hover:text-foreground-dark border-b-4 border-transparent'
        }`}
    >
      {label}
    </button>
  );

  return (
    <Card>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-4">
          <div className="relative group">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  <div>
                      <h3 className="text-center font-bold text-gray-600 dark:text-gray-400 mb-2">{t('original')}</h3>
                      <img src={previewUrl} alt={originalFile.name} className="w-full rounded-2xl object-contain border-2 border-border-light dark:border-border-dark" />
                      <div className="text-sm space-y-1 text-center mt-2">
                          <p className="font-bold text-base truncate" title={originalFile.name}>{originalFile.name}</p>
                          <p className="text-gray-500 dark:text-gray-400">{width} x {height}px</p>
                          <p className="text-gray-500 dark:text-gray-400">{formatBytes(originalFile.size)}</p>
                      </div>
                  </div>
                  <div>
                      <div className="flex items-center justify-center flex-wrap gap-2 mb-2">
                          <h3 className="text-center font-bold text-gray-600 dark:text-gray-400">{t('preview')}</h3>
                          <button
                            onClick={() => setIsZoomEnabled(!isZoomEnabled)}
                            className={`p-1 rounded-full transition-colors ${isZoomEnabled ? 'bg-primary-light/20 text-primary-light dark:bg-primary-dark/20 dark:text-primary-dark' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                            aria-label={t('toggleZoom')}
                            title={t('toggleZoom')}
                          >
                              <MagnifyingGlassIcon className="w-4 h-4" />
                          </button>
                           {isZoomEnabled && (
                              <div className="flex items-center space-x-1 bg-gray-200 dark:bg-gray-700 rounded-full p-0.5 animate-fade-in" style={{ animationDuration: '200ms' }}>
                                  {zoomOptions.map((level) => (
                                      <button
                                          key={level}
                                          onClick={() => setZoomLevel(level)}
                                          className={`px-2 py-0.5 text-xs font-bold rounded-full transition-colors ${
                                              zoomLevel === level
                                              ? 'bg-card-light text-primary-light dark:bg-card-dark dark:text-primary-dark shadow-sm'
                                              : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
                                          }`}
                                          aria-pressed={zoomLevel === level}
                                          aria-label={`Set zoom to ${level}x`}
                                      >
                                          {level}x
                                      </button>
                                  ))}
                              </div>
                          )}
                      </div>
                      <div 
                        ref={previewContainerRef}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        className="relative w-full bg-background-light dark:bg-background-dark rounded-2xl border-2 border-border-light dark:border-border-dark flex items-center justify-center overflow-hidden"
                        style={{ aspectRatio: `${width} / ${height}`, cursor: isZoomEnabled ? 'none' : 'default' }}
                      >
                           <img 
                              ref={previewImageRef}
                              src={processedPreviewUrl || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}
                              alt={t('processedPreview')} 
                              className={`w-full h-full object-contain transition-opacity duration-300 ${processed.isProcessing ? 'opacity-20' : 'opacity-100'}`}
                              style={{ visibility: processedPreviewUrl ? 'visible' : 'hidden' }}
                          />
                          {processed.isProcessing && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                  <SpinnerIcon className="w-8 h-8 animate-spin text-primary-light dark:text-primary-dark" />
                              </div>
                          )}
                          {!processedPreviewUrl && !processed.isProcessing && (
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-400 p-4">
                                  <ImageIcon className="w-10 h-10 mb-2"/>
                                  <p className="text-xs">{t('previewUpdatesHere')}</p>
                              </div>
                          )}
                          {isZoomEnabled && showMagnifier && processedPreviewUrl && (
                            <div
                                style={magnifierStyle}
                                className="absolute pointer-events-none rounded-full border-4 border-card-light dark:border-card-dark shadow-lg"
                            />
                           )}
                      </div>
                      <div className="text-center mt-2 h-12 flex flex-col justify-center">
                          <p className={`font-bold text-lg transition-colors duration-300 ${sizeColorClass}`}>
                              {processed.error ? t(processed.error as any) : formatBytes(processed.estimatedSize ?? 0)}
                          </p>
                           <p className={`text-sm text-gray-500 transition-opacity duration-300 ${processed.isProcessing ? 'opacity-100' : 'opacity-0'}`}>
                              {t('calculating')}
                           </p>
                      </div>
                  </div>
              </div>
               <button onClick={() => onRemove(id)} className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 hover:scale-110 transition-all transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500" aria-label={t('removeImage')}>
                  <XIcon className="w-5 h-5" />
               </button>
          </div>
        </div>
        
        <div className="lg:col-span-2 flex flex-col">
            <div role="tablist" aria-label={t('imageEditorTabs')} className="border-b border-border-light dark:border-border-dark">
              <nav className="-mb-px flex space-x-4 sm:space-x-8" aria-label="Tabs">
                <TabButton tab="imageSettings" label={t('tabImageSettings')} />
                <TabButton tab="naming" label={t('tabNamingSeo')} />
              </nav>
            </div>

            <div className="flex-grow pt-6">
              {activeTab === 'imageSettings' && (
                  <div className="space-y-6 animate-fade-in" style={{ animationDuration: '300ms' }}>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{t('dimensions')}</h3>
                      <div className="flex items-center space-x-3">
                        <Input type="number" label={t('width')} id={`width-${id}`} value={settings.width} onChange={e => {
                          const val = parseInt(e.target.value, 10);
                          if (val > 0) updateSettings({ width: val });
                        }}/>
                        <span className="text-gray-400 font-bold text-lg">x</span>
                        <Input type="number" label={t('height')} id={`height-${id}`} value={settings.height} onChange={e => {
                          const val = parseInt(e.target.value, 10);
                          if (val > 0) updateSettings({ height: val });
                        }}/>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor={`quality-${id}`} className="font-bold text-lg mb-2 block">{t('quality', { quality: settings.quality })}</label>
                          <Slider id={`quality-${id}`} min={10} max={100} step={1} value={settings.quality} onChange={e => updateSettings({ quality: parseInt(e.target.value, 10) })} />
                        </div>
                        <div>
                            <label htmlFor={`format-${id}`} className="font-bold text-lg mb-2 block">{t('format')}</label>
                            <Select id={`format-${id}`} value={settings.format} onChange={e => updateSettings({ format: e.target.value as OutputFormat })}>
                                <option value="jpeg">JPEG</option>
                                <option value="png">PNG</option>
                                <option value="webp">WebP</option>
                            </Select>
                        </div>
                    </div>
                  </div>
              )}
              {activeTab === 'naming' && (
                  <div className="space-y-6 animate-fade-in" style={{ animationDuration: '300ms' }}>
                     <fieldset>
                      <legend className="font-bold text-lg mb-2">{t('outputFilename')}</legend>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input placeholder={t('projectName')} aria-label={t('projectName')} value={settings.projectName} onChange={e => updateSettings({ projectName: e.target.value })}/>
                        <Input placeholder={t('sectionName')} aria-label={t('sectionName')} value={settings.sectionName} onChange={e => updateSettings({ sectionName: e.target.value })}/>
                        <Input placeholder={t('elementName')} aria-label={t('elementName')} value={settings.imageElement} onChange={e => updateSettings({ imageElement: e.target.value })}/>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 truncate bg-background-light dark:bg-background-dark p-3 rounded-lg border border-border-light dark:border-border-dark">
                        {finalFileName}
                      </p>
                    </fieldset>
                    <div>
                      <label htmlFor={`alt-text-${id}`} className="font-bold text-lg mb-2 block">{t('altText')}</label>
                      <div className="relative">
                        <Input id={`alt-text-${id}`} placeholder={t('altTextPlaceholder')} value={settings.altText} onChange={e => updateSettings({ altText: e.target.value })} className={`pr-32 transition-opacity duration-300 ${isGeneratingAltText ? 'opacity-50 cursor-wait' : ''}`} disabled={isGeneratingAltText} />
                        <Button variant="ghost" className="absolute top-1/2 right-1 transform -translate-y-1/2 !px-3" onClick={handleGenerateAltText} isLoading={isGeneratingAltText} disabled={isGeneratingAltText || !process.env.API_KEY} title={!process.env.API_KEY ? t('apiKeyMissingError') : t('generateAltText')}>
                          <SparklesIcon className="w-5 h-5 mr-2" />
                          {isGeneratingAltText ? t('generating') : t('generate')}
                        </Button>
                      </div>
                      {altTextError && <p className="text-sm text-red-500 mt-1">{altTextError}</p>}
                    </div>
                  </div>
              )}
            </div>
            
            <div className="flex items-center justify-end pt-6 mt-auto border-t border-border-light dark:border-border-dark">
                <Button onClick={handleDownload} disabled={processed.isProcessing} className="w-full sm:w-auto">
                    <DownloadIcon className="w-5 h-5 mr-2"/>
                    {processed.isProcessing ? t('processing') : t('download')}
                </Button>
            </div>
        </div>
      </div>
    </Card>
  );
};

export default ImageEditor;