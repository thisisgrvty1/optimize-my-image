# Project Structure

This document outlines the folder and file structure of the "Optimize my Image" application. The structure is organized to separate concerns, making the codebase scalable and easy to navigate.

## Root Directory

The root directory contains the main HTML entry point, the React application's root file, and configuration files.

```
.
├── index.html              # The main HTML file, includes CDN scripts and base styles.
├── index.tsx               # The entry point for the React application.
├── App.tsx                 # The root React component, handles state and view routing.
├── types.ts                # Global TypeScript type definitions.
├── constants.ts            # Application-wide constants (e.g., MAX_FILES).
├── metadata.json           # Application metadata.
├── components/             # Reusable React components.
├── contexts/               # React Context providers for global state.
├── hooks/                  # Custom React hooks.
├── locales/                # Internationalization (i18n) translation files.
├── services/               # Business logic and API communication.
├── utils/                  # Utility and helper functions.
└── docs/                   # Project documentation (you are here).
```

## Folder Breakdown

### `/components`

This folder contains all React components. It's further subdivided for clarity.

-   `/components/ui`: Generic, reusable UI elements like `Button.tsx`, `Card.tsx`, `Input.tsx`, and `Modal.tsx`. These components are application-agnostic.
-   `/components/icons`: A collection of SVG icons converted into React components for easy use and styling.
-   Other components in the root of `/components` are more specific to the application's features, such as `ImageEditor.tsx`, `FileUpload.tsx`, and `Header.tsx`.

### `/contexts`

This directory holds all of the app's React Context providers, which manage global state.

-   `ThemeContext.tsx`: Manages the current color theme and light/dark mode.
-   `I18nContext.tsx`: Manages the application's language and provides the translation function.
-   `SettingsContext.tsx`: Manages user-specific settings, primarily the Google API Key.
-   `CookieConsentContext.tsx`: Handles the state for the cookie consent banner and modal.

### `/hooks`

This folder contains custom React hooks that encapsulate reusable logic.

-   `useI18n.ts`: A simple hook to access the `I18nContext`.
-   `useTheme.ts`: A hook to access the `ThemeContext`.
-   `useDebounce.ts`: A utility hook to debounce a value, used for performance optimization in the image editor.
-   `useSettings.ts`: A hook to access the `SettingsContext`.

### `/locales`

Contains the translation files for internationalization (i18n).

-   `en.ts`: English translations.
-   `de.ts`: German translations.
-   Files are TypeScript modules exporting a default object of key-value pairs.

### `/services`

This directory is for modules that handle external interactions and core business logic.

-   `imageService.ts`: Contains the core logic for processing images (resizing, compressing, changing format) using the browser's Canvas API.
-   `geminiService.ts`: Handles all communication with the Google Gemini API for generating alt text.

### `/utils`

Contains miscellaneous helper functions that can be used throughout the application.

-   `fileUtils.ts`: Functions related to file operations, like formatting byte sizes and generating dynamic filenames.
-   `imageUtils.ts`: Functions for handling image data, such as converting a `File` object to a base64 string.