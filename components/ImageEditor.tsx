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
import { useSettings } from '../contexts/SettingsContext';
import { generateAltText } from '../services/geminiService';
import { fileToBase64 } from '../utils/imageUtils';
import { SparklesIcon } from './icons/SparklesIcon';
import { TARGET_SIZE_KB, WARNING_SIZE_KB } from '../constants';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { ImageIcon } from './icons/ImageIcon';

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
  const { apiKey } = useSettings();
  const [isGeneratingAltText, setIsGeneratingAltText] = useState(false);
  const [altTextError, setAltTextError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<EditorTab>('imageSettings');
  const [processedPreviewUrl, setProcessedPreviewUrl] = useState<string | null>(null);

  // State for zoom/loupe feature
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1: off, 2: 2x, 4: 4x
  const [loupePosition, setLoupePosition] = useState({ x: 0, y: 0 });
  const [isMouseInPreview, setIsMouseInPreview] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    // Effect to revoke the object URL when the component unmounts or the URL changes, to prevent memory leaks.
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
      setProcessedPreviewUrl(newPreviewUrl); // This triggers the cleanup effect for the old URL
      onProcessingStateChange(id, { isProcessing: false, estimatedSize: blob.size });
    } catch (error) {
      console.error('Error processing image for estimation:', error);
      onProcessingStateChange(id, { isProcessing: false, error: 'estimationError' });
      setProcessedPreviewUrl(null); // Clear preview on error
    }
  }, [id, originalFile, debouncedSettings, onProcessingStateChange]);
  
  useEffect(() => {
    updatePreviewAndSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (!apiKey) {
      alert(t('apiKeyMissingError'));
      return;
    }

    setIsGeneratingAltText(true);
    setAltTextError(null);

    try {
      const { mimeType, data } = await fileToBase64(originalFile);
      const generatedText = await generateAltText(apiKey, { mimeType, data }, language);
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
        {/* Column 1: Previews */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative group">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  {/* Original Image */}
                  <div>
                      <h3 className="text-center font-bold text-gray-600 dark:text-gray-400 mb-2">{t('original')}</h3>
                      <img src={previewUrl} alt={originalFile.name} className="w-full rounded-2xl object-contain border-2 border-border-light dark:border-border-dark" />
                      <div className="text-sm space-y-1 text-center mt-2">
                          <p className="font-bold text-base truncate" title={originalFile.name}>{originalFile.name}</p>
                          <p className="text-gray-500 dark:text-gray-400">{width} x {height}px</p>
                          <p className="text-gray-500 dark:text-gray-400">{formatBytes(originalFile.size)}</p>
                      </div>
                  </div>

                  {/* Processed Preview */}
                  <div>
                      <h3 className="text-center font-bold text-gray-600 dark:text-gray-400 mb-2">{t('preview')}</h3>
                      <div 
                        ref={previewContainerRef}
                        onMouseEnter={() => setIsMouseInPreview(true)}
                        onMouseLeave={() => setIsMouseInPreview(false)}
                        onMouseMove={(e) => {
                            if (previewContainerRef.current) {
                                const rect = previewContainerRef.current.getBoundingClientRect();
                                setLoupePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                            }
                        }}
                        className="relative w-full bg-background-light dark:bg-background-dark rounded-2xl border-2 border-border-light dark:border-border-dark flex items-center justify-center overflow-hidden"
                        style={{ aspectRatio: `${width} / ${height}`, cursor: zoomLevel > 1 && processedPreviewUrl ? 'crosshair' : 'default' }}
                      >
                           {/* Zoom Controls */}
                           {processedPreviewUrl && (
                               <div className="absolute top-2 right-2 z-30 bg-black/40 backdrop-blur-sm rounded-full p-1 flex items-center space-x-1">
                                  <button
                                      onClick={() => setZoomLevel(prev => prev === 2 ? 1 : 2)}
                                      title={t('zoom2x')}
                                      className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${zoomLevel === 2 ? 'bg-primary-light text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}
                                  >
                                      2x
                                  </button>
                                  <button
                                      onClick={() => setZoomLevel(prev => prev === 4 ? 1 : 4)}
                                      title={t('zoom4x')}
                                      className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${zoomLevel === 4 ? 'bg-primary-light text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}
                                  >
                                      4x
                                  </button>
                              </div>
                           )}

                           {/* Loupe Element */}
                           {isMouseInPreview && zoomLevel > 1 && processedPreviewUrl && previewContainerRef.current && (
                               <div
                                   style={{
                                       position: 'absolute',
                                       width: '150px',
                                       height: '150px',
                                       borderRadius: '50%',
                                       border: '3px solid white',
                                       boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                                       pointerEvents: 'none',
                                       zIndex: 20,
                                       left: `${loupePosition.x - 75}px`,
                                       top: `${loupePosition.y - 75}px`,
                                       backgroundImage: `url(${processedPreviewUrl})`,
                                       backgroundRepeat: 'no-repeat',
                                       backgroundSize: `${previewContainerRef.current.clientWidth * zoomLevel}px ${previewContainerRef.current.clientHeight * zoomLevel}px`,
                                       backgroundPosition: `-${loupePosition.x * zoomLevel - 75}px -${loupePosition.y * zoomLevel - 75}px`,
                                   }}
                               />
                           )}
                           
                           <img 
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
               <button onClick={() => onRemove(id)} className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 hover:scale-110 transition-all transform duration-200" aria-label={t('removeImage')}>
                  <XIcon className="w-5 h-5" />
               </button>
          </div>
        </div>
        
        {/* Column 2: Settings */}
        <div className="lg:col-span-2 flex flex-col">
            <div className="border-b border-border-light dark:border-border-dark">
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
                          <h3 className="font-bold text-lg mb-2">{t('quality', { quality: settings.quality })}</h3>
                          <Slider id={`quality-${id}`} min={10} max={100} step={1} value={settings.quality} onChange={e => updateSettings({ quality: parseInt(e.target.value, 10) })} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-2">{t('format')}</h3>
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
                     <div>
                      <h3 className="font-bold text-lg mb-2">{t('outputFilename')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input placeholder={t('projectName')} value={settings.projectName} onChange={e => updateSettings({ projectName: e.target.value })}/>
                        <Input placeholder={t('sectionName')} value={settings.sectionName} onChange={e => updateSettings({ sectionName: e.target.value })}/>
                        <Input placeholder={t('elementName')} value={settings.imageElement} onChange={e => updateSettings({ imageElement: e.target.value })}/>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 truncate bg-background-light dark:bg-background-dark p-3 rounded-lg border border-border-light dark:border-border-dark">
                        {finalFileName}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{t('altText')}</h3>
                      <div className="relative">
                        <Input placeholder={t('altTextPlaceholder')} value={settings.altText} onChange={e => updateSettings({ altText: e.target.value })} className={`pr-32 transition-opacity duration-300 ${isGeneratingAltText ? 'opacity-50 cursor-wait' : ''}`} disabled={isGeneratingAltText} />
                        <Button variant="ghost" className="absolute top-1/2 right-1 transform -translate-y-1/2 !px-3" onClick={handleGenerateAltText} isLoading={isGeneratingAltText} disabled={isGeneratingAltText || !apiKey} title={!apiKey ? t('apiKeyMissingError') : t('generateAltText')}>
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