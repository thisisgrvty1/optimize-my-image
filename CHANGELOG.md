# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.9] - 2025-09-02

### Changed
- **Project Architecture Overhaul**: Transitioned the application from a browser-based, import-map/CDN setup to a standard Vite build system. This significantly improves performance, enables modern tooling, and makes the project compatible with professional deployment workflows (e.g., on Plesk).

### Added
- Standard project configuration files: `package.json` for dependency management, `vite.config.ts` for the build process, and `tsconfig.json` for robust TypeScript settings.
- A `.gitignore` file to follow best practices for version control.

## [1.3.8] - 2025-08-31

### Changed
- **Landing Page Section Order**: Reordered the sections on the landing page for a more intuitive and impactful user flow. The new order is Hero, Drag & Drop, Powerful Features, Boost Your Website, Private & Secure, and How It Works.
- **Landing Page Redesign**: Redesigned the "Packed with Powerful Features" section with a vibrant, glowing aesthetic, replacing the individual cards with a single, large "glass-morphism" container to unify the design and align it with other modern sections of the page.
- **Privacy Section Animation**: Enhanced the "Private & Secure" section with a bold, attention-grabbing animation, including a radiating "shockwave" pulse and a more intense glow effect on the central icon to emphasize the feature's importance.

## [1.3.7] - 2025-08-30

### Added
- **Live Image Preview**: Implemented a side-by-side "Original vs. Preview" view in the image editor. The preview now updates in real-time as the quality slider and other settings are adjusted, providing instant visual feedback on compression.
- **AI Feature Section**: Added a new dedicated section to the landing page to highlight the "AI-Powered Alt Text" generation feature.
- **Comprehensive History**: Created a detailed version history in `CHANGELOG.md` documenting all notable changes since version 1.0.0.

### Changed
- **Default Theme**: The default color theme for the application has been changed from "orange" to "green" for a fresh, modern look.
- **Landing Page Redesign**:
    - Redesigned the "Drag & Drop" feature section with a vibrant, glowing, glass-blur aesthetic and moved it to the second position for prominence.
    - Redesigned the "Private & Secure" section with a matching vibrant and playful design.
    - Reordered all landing page sections to create a more intuitive and engaging user journey.
- **Landing Page Animations**: Reworked the on-scroll animation for the "AI-Powered Alt Text" section to create a more dynamic and layered entrance.

## [1.3.6] - 2025-08-28

### Changed
- Renamed the "Optimize & Transform" tab to "Image Settings" for better clarity.
- Reordered the fields within the "Image Settings" tab to a more logical flow: Dimensions, Quality, and Format.

## [1.3.5] - 2025-08-27

### Added
- Global drag-and-drop support. Users can now drop images anywhere on the application window to upload them.
- A full-screen overlay now provides visual feedback during the drag operation.

## [1.3.4] - 2025-08-25

### Added
- Comprehensive project documentation in a new `/docs` folder.
- Redesigned tab-based interface for the image settings panel.
- Dynamic, color-coded feedback for the estimated file size.
- Smooth fade animations for the estimated size calculation.
- User-friendly hint with a direct link to settings when the Google API key is missing.

### Changed
- Streamlined settings workflow by merging "Optimize" and "Transform" controls.
- Repositioned and restyled the "Estimated Size" display to be more prominent.

### Fixed
- Resolved intermittent "Failed to create blob from canvas" errors with more robust image processing logic.
- Corrected a JavaScript module import error for the `useI8n` hook.

## [1.3.3] - 2025-08-22

### Added
- A new, beautifully animated landing page with smooth on scroll animations using GSAP to showcase features and improve user onboarding.

## [1.3.2] - 2025-08-20

### Added
- AI-powered alt text generation by integrating the Google Gemini API.
- An API Key modal in the settings to allow users to securely add their own Google API key.

## [1.3.1] - 2025-08-18

### Added
- Internationalization (i18n) support.
- German language translations for the entire user interface.
- A language switcher component in the header.

## [1.3.0] - 2025-08-15

### Added
- Support for converting images to the modern WebP format.
- Advanced file naming options to generate SEO-friendly filenames based on project, section, and element names.

## [1.2.1] - 2025-08-10

### Changed
- Improved performance of UI animations and transitions for a smoother experience.
- Optimized initial asset loading.

## [1.2.0] - 2025-08-08

### Added
- A complete user interface overhaul with a modern, clean design.
- Dark mode support.
- A theme switcher with multiple color palettes to personalize the application.

## [1.1.1] - 2025-08-05

### Fixed
- Fixed an issue where exporting a large number of images simultaneously could cause the browser to crash.
- Improved error handling for failed image processing.

## [1.1.0] - 2025-08-01

### Added
- Batch processing capability. Users can now upload and process up to 10 images at once.
- "Export All" feature which packages all optimized images into a single ZIP file for convenient download.

## [1.0.0] - 2025-07-20

### Added
- Initial release of "Optimize my Image".
- Core client-side image optimization features: resizing and quality compression.
- Support for JPEG and PNG formats.
- Real-time estimated file size calculation.
- Single image upload and download functionality.