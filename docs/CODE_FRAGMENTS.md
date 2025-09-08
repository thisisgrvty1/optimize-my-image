# Important Code Fragments & Patterns

This document highlights and explains key code fragments and architectural patterns used in the "Optimize my Image" application.

## 1. Client-Side Image Processing

The core image processing logic resides in `services/imageService.ts`. It leverages the browser's Canvas API to perform all operations without needing a server.

### `processImage` Function

This function takes an image file and settings, and returns a processed `Blob`.

```typescript
// in services/imageService.ts

export const processImage = (file: File, settings: ImageSettings): Promise<{ blob: Blob }> => {
  return new Promise((resolve, reject) => {
    const { width, height, format, quality } = settings;
    const mimeType = `image/${format}`;
    const qualityValue = quality / 100;

    const img = new Image();
    img.src = URL.createObjectURL(file); // Load the image
    img.onload = () => {
      // Create an off-screen canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return reject(new Error('Failed to get canvas context.'));
      }

      // Draw the image onto the canvas at the new dimensions
      ctx.drawImage(img, 0, 0, width, height);

      // Export the canvas content as a blob with specified format and quality
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({ blob });
          } else {
            reject(new Error('Failed to create blob from canvas.'));
          }
          URL.revokeObjectURL(img.src); // Clean up memory
        },
        mimeType,
        format === 'jpeg' || format === 'webp' ? qualityValue : undefined
      );
    };
    img.onerror = (err) => {
        reject(err);
        URL.revokeObjectURL(img.src);
    }
  });
};
```

-   **`URL.createObjectURL(file)`**: Creates a temporary URL for the user's local file, allowing it to be used as an `Image` source.
-   **`canvas.getContext('2d')`**: Provides the 2D rendering context for drawing.
-   **`ctx.drawImage(...)`**: This is where the resizing happens. The original image is drawn onto the canvas, scaled to the target `width` and `height`.
-   **`canvas.toBlob(...)`**: This is the key step for compression and format conversion. It asynchronously converts the canvas content into a `Blob` object. The `mimeType` and `qualityValue` arguments control the output format and compression level.

## 2. Gemini API for Alt Text Generation

The integration with the Google Gemini API in `services/geminiService.ts` demonstrates how to perform multimodal queries (image + text).

### `generateAltText` Function

```typescript
// in services/geminiService.ts

import { GoogleGenAI } from "@google/genai";
// ...

export const generateAltText = async (
    apiKey: string, 
    image: { mimeType: string; data: string },
    language: Language
): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey });

        const imagePart = {
            inlineData: {
                mimeType: image.mimeType,
                data: image.data,
            },
        };
        
        const textPart = {
            text: getPrompt(language), // "Generate a concise alt text..."
        };

        // Send both image and text to the model
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });

        const text = response.text.trim();
        return text.replace(/^["']|["']$/g, ''); // Clean up potential quotes

    } catch (error) {
        // ... error handling
    }
};
```

-   **`new GoogleGenAI({ apiKey })`**: Initializes the GenAI client.
-   **Multimodal Prompt**: The `contents` object is structured with an array of `parts`. One part is the `imagePart` (containing the base64-encoded image data and its MIME type), and the other is the `textPart` (the textual prompt instructing the model).
-   **`ai.models.generateContent`**: This is the core API call that sends the request to the Gemini model.
-   **`response.text`**: The generated text is directly accessible via the `.text` property on the response object, providing a clean and direct way to get the result.

## 3. Global State Management with React Context

The application uses React Context for managing global state like the current theme, language, and user settings. This avoids "prop drilling" and provides a clean API for components to access and modify global state.

### `ThemeContext.tsx` Example

```typescript
// in contexts/ThemeContext.tsx

// ... imports

interface ThemeContextType {
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ... initial state logic

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeName, setThemeNameState] = useState<ThemeName>(getInitialThemeName);
  const [themeMode, setThemeModeState] = useState<ThemeMode>(getInitialThemeMode);

  useEffect(() => {
    // Apply theme to the DOM
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem(THEME_NAME_KEY, themeName);
  }, [themeName]);

  useEffect(() => {
    // Apply dark/light mode to the DOM
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_MODE_KEY, themeMode);
  }, [themeMode]);
  
  // ... memoized functions

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
```

-   **`createContext`**: Initializes the context.
-   **`ThemeProvider`**: A component that wraps parts of the application (in this case, the entire app in `index.tsx`). It holds the state and provides it to all descendant components.
-   **`useEffect`**: Side effects are used to persist the theme to `localStorage` and to update the `<html>` element's attributes (`data-theme` and `class="dark"`), which triggers the CSS variable changes.
-   **`useTheme` Hook**: A custom hook (`hooks/useTheme.ts`) provides a simple and clean way for components to consume this context.