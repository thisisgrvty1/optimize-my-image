# Application Configuration

This document explains how to configure the "Optimize my Image" application. This includes setting up the required API key for AI features and customizing the visual theme.

## 1. Google API Key

The AI-powered alt text generation feature requires a Google API key for the Gemini model.

### Setting the API Key

The application is designed for users to provide their own Google API key through a settings modal in the UI.

-   **UI Modal**: Users can click the "Key" icon in the header to open a modal where they can enter and save their API key.
-   **Local Storage**: The key is stored securely in the browser's `localStorage` under the key `google_api_key`. It is never transmitted to any server other than Google's API endpoints.
-   **State Management**: The `SettingsContext` (`contexts/SettingsContext.tsx`) manages the API key state, reading it from `localStorage` on initial load and providing it to components that need it, like `ImageEditor.tsx`.

The `geminiService.ts` receives the key as an argument to the `generateAltText` function and initializes the `GoogleGenAI` client with it for each request.

```typescript
// in services/geminiService.ts
export const generateAltText = async (
    apiKey: string, 
    // ...
): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey });
        // ...
    }
    // ...
};
```

## 2. Theming System

The application features a robust theming system that allows for easy customization of the color palette. The system is built on CSS variables.

### How It Works

1.  **CSS Variables**: Base color definitions are defined in the `<style>` tag of `index.html` within a `:root` selector or a `[data-theme="..."]` attribute selector.
2.  **Theme Context**: `contexts/ThemeContext.tsx` manages the current theme (`themeName`) and mode (`themeMode`). It applies the selected theme by setting the `data-theme` attribute on the `<html>` element and adds the `dark` class for dark mode.
3.  **Tailwind CSS Integration**: Tailwind's configuration (`tailwind.config`) in `index.html` is extended to use these CSS variables, allowing us to use classes like `bg-primary-light` which map to `rgb(var(--color-primary-light) / <alpha-value>)`.

### Adding a New Theme

To add a new color theme (e.g., "cyan"):

1.  **Define CSS Variables**: In `index.html`, add new style blocks for the "cyan" theme for both light and dark modes.

    ```css
    [data-theme="cyan"] {
      --color-primary-light: 20 184 166; /* teal-500 */
      /* ... other light mode colors ... */
    }
    .dark[data-theme="cyan"] {
      --color-primary-dark: 45 212 191; /* teal-400 */
      /* ... other dark mode colors ... */
    }
    ```

2.  **Update TypeScript Type**: In `types.ts`, add the new theme name to the `ThemeName` type alias.

    ```typescript
    export type ThemeName = 'orange' | 'rose' | 'violet' | 'blue' | 'green' | 'slate' | 'cyan';
    ```

3.  **Add to Theme Switcher**: In `components/ThemeSwitcher.tsx`, add the new theme to the `themes` array so it appears in the UI.

    ```typescript
    const themes: { name: ThemeName; color: string }[] = [
      // ... other themes
      { name: 'cyan', color: 'bg-cyan-500' },
    ];
    ```

## 3. Application Constants

Key constants that control application behavior are located in `constants.ts`.

-   `MAX_FILES`: The maximum number of files a user can upload at once. Default is `10`.
-   `TARGET_SIZE_KB`: A visual indicator constant, currently used for color-coding the estimated file size. Default is `150`.

You can modify these values to change the application's constraints.