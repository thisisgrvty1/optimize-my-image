import { ImageSettings } from '../types';

export const getImageMetadata = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(objectUrl); // Clean up
    };

    img.onerror = (err) => {
      reject(err);
      URL.revokeObjectURL(objectUrl); // Clean up
    };
    
    img.src = objectUrl;
  });
};

export const processImage = (file: File, settings: ImageSettings): Promise<{ blob: Blob }> => {
  return new Promise((resolve, reject) => {
    const { width, height, format, quality } = settings;

    // Add sanity checks for dimensions to prevent errors in canvas operations.
    if (!width || !height || !Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      return reject(new Error(`Invalid dimensions for processing: ${width}x${height}`));
    }
    
    const mimeType = `image/${format}`;
    const qualityValue = quality / 100;

    const img = new Image();
    const objectUrl = URL.createObjectURL(file); // Store URL to revoke it reliably

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        // Be explicit about alpha channel. JPEGs don't have it, which can be an optimization.
        const ctx = canvas.getContext('2d', { alpha: format !== 'jpeg' });

        if (!ctx) {
          // This should ideally never happen in modern browsers.
          return reject(new Error('Failed to get canvas context.'));
        }

        // Fill background for formats that don't support transparency.
        if (format === 'jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ blob });
            } else {
              reject(new Error('Failed to create blob from canvas.'));
            }
          },
          mimeType,
          format === 'jpeg' || format === 'webp' ? qualityValue : undefined
        );
      } catch (error) {
          reject(error);
      } finally {
          // Ensure cleanup happens even if context creation or drawing fails.
          URL.revokeObjectURL(objectUrl);
      }
    };

    img.onerror = (err) => {
        URL.revokeObjectURL(objectUrl); // Clean up on error
        reject(err);
    }
    
    img.src = objectUrl;
  });
};