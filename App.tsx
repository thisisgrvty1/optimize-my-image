


import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ImageFile, ImageSettings, View } from './types';
import { processImage, getImageMetadata } from './services/imageService';
import { generateFileName } from './utils/fileUtils';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import BatchActions from './components/BatchActions';
import ImageEditorList from './components/ImageEditorList';
import LandingPage from './components/LandingPage';
import Breadcrumbs from './components/Breadcrumbs';
import ImprintPage from './components/ImprintPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import Footer from './components/Footer';
import { MAX_FILES } from './constants';
import { useI8n } from './hooks/useI8n';
import { useCookieConsent } from './hooks/useCookieConsent';
import CookieBanner from './components/CookieBanner';
import CookieSettingsModal from './components/CookieSettingsModal';
import IntroAnimation from './components/IntroAnimation';
import DragDropOverlay from './components/DragDropOverlay';

declare var JSZip: any;

const App: React.FC = () => {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [applyToAll, setApplyToAll] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [view, setView] = useState<View>('landing');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dragCounter = useRef(0);
  const { t, language } = useI8n();
  const { consent, runAnalyticsScripts } = useCookieConsent();

  // State for one-time intro animation
  const [isInitialSession] = useState(() => sessionStorage.getItem('introPlayed') !== 'true');
  const [showIntro, setShowIntro] = useState(isInitialSession);
  const [playContentIntro, setPlayContentIntro] = useState(isInitialSession);


  useEffect(() => {
    if (consent?.analytics) {
      runAnalyticsScripts();
    }
  }, [consent, runAnalyticsScripts]);

  useEffect(() => {
    document.title = t('appTitle');
  }, [t, language]);
  
  useEffect(() => {
    // This effect ensures the content intro animation only plays once
    // by setting playContentIntro to false after the animation has had time to complete.
    if (playContentIntro) {
      const timer = setTimeout(() => setPlayContentIntro(false), 1000); // Animation duration is ~0.7s
      return () => clearTimeout(timer);
    }
  }, [playContentIntro]);

  const handleIntroEnd = () => {
    sessionStorage.setItem('introPlayed', 'true');
    setShowIntro(false);
  };
  
  const handleRemoveAll = useCallback(() => {
    imageFiles.forEach(file => URL.revokeObjectURL(file.previewUrl));
    setImageFiles([]);
  }, [imageFiles]);
  
  const navigateTo = useCallback((newView: View) => {
    if (newView === 'landing' && view !== 'landing') {
        handleRemoveAll();
    }
    setView(newView);
    window.scrollTo(0, 0);
  }, [view, handleRemoveAll]);

  const handleFilesSelected = useCallback(async (files: FileList) => {
    const newImageFiles: ImageFile[] = [];
    const totalFiles = imageFiles.length + files.length;
    if (totalFiles > MAX_FILES) {
        alert(t('maxFilesError', { maxFiles: MAX_FILES }));
    }

    const filesToProcess = Array.from(files).slice(0, MAX_FILES - imageFiles.length);

    for (const file of filesToProcess) {
      if (!file.type.startsWith('image/')) continue;

      const metadata = await getImageMetadata(file);
      const newFile: ImageFile = {
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        originalFile: file,
        previewUrl: URL.createObjectURL(file),
        ...metadata,
        settings: {
          width: metadata.width,
          height: metadata.height,
          quality: 90,
          format: 'jpeg',
          projectName: '',
          sectionName: '',
          imageElement: '',
          altText: '',
        },
        processed: {
            isProcessing: false,
        }
      };
      newImageFiles.push(newFile);
    }

    if (newImageFiles.length > 0) {
        setImageFiles(prev => [...prev, ...newImageFiles]);
    }
  }, [imageFiles.length, t]);
  
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current++;
      if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
        setIsDraggingOver(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current--;
      if (dragCounter.current === 0) {
        setIsDraggingOver(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(false);
      dragCounter.current = 0;
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        handleFilesSelected(e.dataTransfer.files);
        if (view === 'landing') {
          navigateTo('optimizer');
        }
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, [view, handleFilesSelected, navigateTo]);


  const handleSettingsChange = useCallback((id: string, newSettings: Partial<ImageSettings>) => {
    setImageFiles(prevFiles => {
        if (applyToAll) {
            return prevFiles.map(file => {
                const updatedSettings = { ...file.settings, ...newSettings };
                if (newSettings.width !== undefined && newSettings.height === undefined) {
                    updatedSettings.height = Math.round((newSettings.width / file.width) * file.height);
                } else if (newSettings.height !== undefined && newSettings.width === undefined) {
                    updatedSettings.width = Math.round((newSettings.height / file.height) * file.width);
                }
                return { ...file, settings: updatedSettings };
            });
        } else {
            const targetIndex = prevFiles.findIndex(f => f.id === id);
            if (targetIndex === -1) return prevFiles;

            const updatedFiles = [...prevFiles];
            const fileToUpdate = updatedFiles[targetIndex];
            const oldSettings = fileToUpdate.settings;
            const mergedSettings = { ...oldSettings, ...newSettings };

            if (newSettings.width !== undefined && newSettings.width !== oldSettings.width) {
                mergedSettings.height = Math.round((newSettings.width / fileToUpdate.width) * fileToUpdate.height);
            } else if (newSettings.height !== undefined && newSettings.height !== oldSettings.height) {
                mergedSettings.width = Math.round((newSettings.height / fileToUpdate.height) * fileToUpdate.width);
            }
            
            updatedFiles[targetIndex] = { ...fileToUpdate, settings: mergedSettings };
            return updatedFiles;
        }
    });
  }, [applyToAll]);

  const updateProcessingState = useCallback((id: string, state: Partial<ImageFile['processed']>) => {
    setImageFiles(prev => prev.map(f => f.id === id ? { ...f, processed: { ...f.processed, ...state } } : f));
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    setImageFiles(prev => {
        const fileToRemove = prev.find(f => f.id === id);
        if (fileToRemove) {
            URL.revokeObjectURL(fileToRemove.previewUrl);
        }
        return prev.filter(f => f.id !== id);
    });
  }, []);
  
  const handleExportAll = useCallback(async () => {
    if (imageFiles.length === 0 || isExporting) return;

    setIsExporting(true);
    try {
      const zip = new JSZip();

      const filePromises = imageFiles.map(async (file) => {
        try {
          const { blob } = await processImage(file.originalFile, file.settings);
          return { name: generateFileName(file), blob };
        } catch (error) {
          console.error(`Failed to process ${file.originalFile.name}:`, error);
          updateProcessingState(file.id, { error: 'exportFailedError' });
          return null;
        }
      });

      const results = await Promise.all(filePromises);
      const validFiles = results.filter((result): result is { name: string; blob: Blob } => result !== null);
      
      if (validFiles.length === 0) {
        alert(t('noFilesToExportError'));
        return;
      }
      
      validFiles.forEach(file => {
        zip.file(file.name, file.blob);
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `image-optimizer-export-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

    } catch (error) {
      console.error('Error creating ZIP file:', error);
      alert(t('zipError'));
    } finally {
      setIsExporting(false);
    }
  }, [imageFiles, isExporting, updateProcessingState, t]);

  const renderContent = () => {
    const optimizerContent = (
      <>
        {imageFiles.length === 0 ? (
          <FileUpload onFilesSelected={handleFilesSelected} />
        ) : (
          <>
            <BatchActions
              applyToAll={applyToAll}
              onApplyToAllChange={setApplyToAll}
              onExportAll={handleExportAll}
              onAddMore={() => document.getElementById('dropzone-file')?.click()}
              onClearAll={handleRemoveAll}
              fileCount={imageFiles.length}
              isExporting={isExporting}
            />
            <ImageEditorList
              files={imageFiles}
              onSettingsChange={handleSettingsChange}
              onRemoveImage={handleRemoveImage}
              onProcessingStateChange={updateProcessingState}
            />
          </>
        )}
      </>
    );

    switch (view) {
      case 'optimizer':
        return (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Breadcrumbs view={view} onNavigateHome={() => navigateTo('landing')} />
            {optimizerContent}
          </div>
        );
      case 'imprint':
        return (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Breadcrumbs view={view} onNavigateHome={() => navigateTo('landing')} />
            <ImprintPage />
          </div>
        );
      case 'privacy':
        return (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Breadcrumbs view={view} onNavigateHome={() => navigateTo('landing')} />
            <PrivacyPolicyPage />
          </div>
        );
      case 'landing':
      default:
        return <LandingPage onStart={() => navigateTo('optimizer')} playIntro={playContentIntro} />;
    }
  };

  if (showIntro) {
    return <IntroAnimation onAnimationEnd={handleIntroEnd} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark font-sans">
      <Header onNavigateHome={() => navigateTo('landing')} playIntro={playContentIntro && view === 'landing'} />
      <main className="flex-grow">
        <div key={view} className="animate-view-enter">
          {renderContent()}
        </div>
      </main>
      <Footer onNavigate={navigateTo} />
      <CookieBanner onNavigate={navigateTo} />
      <CookieSettingsModal />
      <DragDropOverlay isVisible={isDraggingOver} />
    </div>
  );
};

export default App;